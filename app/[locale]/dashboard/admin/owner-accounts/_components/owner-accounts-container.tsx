"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusTabs } from "./status-tabs";
import { FilterBar } from "./filter-bar";
import { OwnerAccountsTable } from "./owner-accounts-table";

/**
 * All filter state lives in the URL search params so the view is fully
 * shareable and survives hard reloads.
 *
 * Two independent queries:
 *  1. `owner-accounts-counts` — hits /api/admin/owner-accounts/counts.
 *     Always unfiltered — chips always show true database totals regardless
 *     of what search/date filters are active. Longer staleTime (5 min).
 *
 *  2. `owner-accounts-table` — hits /api/admin/owner-accounts with all
 *     filter params. Re-fetches on every filter change. Has its own loading
 *     skeleton so the chips never flicker while the table loads.
 *
 * After a row action (activate/suspend/delete), both queries are invalidated
 * so counts AND table data refresh together.
 */
export function OwnerAccountsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // ── Read state from URL ──────────────────────────────────────────────
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const dateType = searchParams.get("dateType") || "submission";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // ── Write state to URL ───────────────────────────────────────────────
  const setParams = useCallback(
    (updates: Record<string, string>) => {
      // Read searchParams inline at call time, not captured in closure
      router.replace(
        `${pathname}?${(() => {
          const next = new URLSearchParams(window.location.search); // ✅ always fresh
          for (const [key, value] of Object.entries(updates)) {
            if (
              value === "" ||
              (value === "ALL" && key === "status") ||
              (value === "desc" && key === "sort") ||
              (value === "1" && key === "page") ||
              (value === "submission" && key === "dateType")
            ) {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }
          return next.toString();
        })()}`,
        { scroll: false },
      );
    },
    [router, pathname], // ✅ searchParams removed from deps
  );

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleStatusChange = useCallback((val: string) => setParams({ status: val, page: "1" }), [setParams]);
  const handleSearchChange = useCallback((val: string) => setParams({ search: val, page: "1" }), [setParams]);
  const handleSortChange = useCallback((val: string) => setParams({ sort: val, page: "1" }), [setParams]);
  const handleDateFromChange = useCallback((val: string) => setParams({ dateFrom: val, page: "1" }), [setParams]);
  const handleDateToChange = useCallback((val: string) => setParams({ dateTo: val, page: "1" }), [setParams]);
  const handleClearDates = useCallback(() => setParams({ dateFrom: "", dateTo: "", page: "1" }), [setParams]);
  const handleDateTypeChange = useCallback((val: string) => setParams({ dateType: val, page: "1" }), [setParams]);
  const handlePageChange = useCallback((val: number) => setParams({ page: val.toString() }), [setParams]);

  // ── Query 1: Status chip counts (unfiltered, independent) ─────────────
  const { data: countsData, isLoading: countsLoading } = useQuery({
    queryKey: ["owner-accounts-counts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/owner-accounts/counts");
      if (!res.ok) throw new Error("Failed to fetch counts");
      return res.json() as Promise<{
        ALL: number;
        PENDING: number;
        ACTIVE: number;
        SUSPENDED: number;
      }>;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // ── Query 2: Filtered table data ──────────────────────────────────────
  const {
    data: tableData,
    isLoading: tableLoading,
    isError: tableError,
  } = useQuery({
    queryKey: [
      "owner-accounts-table",
      status,
      search,
      sort,
      dateFrom,
      dateTo,
      dateType,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        status,
        search,
        sort,
        page: page.toString(),
        dateType,
      });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const res = await fetch(`/api/admin/owner-accounts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch owner accounts");
      return res.json();
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  });

  /**
   * Called by RowActionsMenu after activate / suspend / delete.
   * Invalidates both queries so the table AND the chips refresh immediately
   * to reflect the new state.
   */
  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["owner-accounts-counts"] });
    queryClient.invalidateQueries({ queryKey: ["owner-accounts-table"] });
  }, [queryClient]);

  const emptyCounts = { ALL: 0, PENDING: 0, ACTIVE: 0, SUSPENDED: 0 };
  const counts = countsData ?? emptyCounts;

  return (
    <div className='flex-1 rounded-xl bg-surface-1 p-3 sm:p-5 shadow-sm border border-border'>
      {/* Chips — independent query, never blocked by table loading */}
      <StatusTabs
        currentStatus={status}
        onChange={handleStatusChange}
        counts={counts}
        isLoading={countsLoading}
      />

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
        dateFrom={dateFrom}
        onDateFromChange={handleDateFromChange}
        dateTo={dateTo}
        onDateToChange={handleDateToChange}
        onClearDates={handleClearDates}
        dateType={dateType}
        onDateTypeChange={handleDateTypeChange}
      />

      {/* Table — has its own skeleton; loads independently */}
      <OwnerAccountsTable
        data={tableData?.tenants || []}
        isLoading={tableLoading}
        isError={tableError}
        total={tableData?.total || 0}
        page={page}
        onPageChange={handlePageChange}
        limit={tableData?.limit || 10}
        onRefetch={handleRefetch}
      />
    </div>
  );
}
