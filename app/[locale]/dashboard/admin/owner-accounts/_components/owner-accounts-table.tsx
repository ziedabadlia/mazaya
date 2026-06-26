"use client";

import { useTranslations } from "next-intl";
import { Pagination } from "./pagination";
import { RowActionsMenu } from "./row-actions-menu";

interface OwnerAccountsTableProps {
  data: any[];
  isLoading: boolean;
  isError: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

const statusStyles = {
  ACTIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  SUSPENDED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return { date: "-", time: "" };
  const date = new Date(dateString);
  const d = new Intl.DateTimeFormat("en-CA").format(date).replace(/-/g, "/");
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return { date: d, time };
};

export function OwnerAccountsTable({
  data,
  isLoading,
  isError,
  total,
  page,
  limit,
  onPageChange,
  onRefetch,
}: OwnerAccountsTableProps) {
  const t = useTranslations("OwnerAccounts");

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center bg-surface-2 rounded-xl mt-4'>
        <p className='text-status-danger mb-2 font-medium'>{t("error")}</p>
        <button
          onClick={onRefetch}
          className='text-sm text-brand hover:underline'
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-border bg-surface-2/50 text-txt-secondary'>
              <th className='whitespace-nowrap px-4 py-3 text-start font-medium'>
                {t("columns.restaurant")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-start font-medium'>
                {t("columns.owner")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-start font-medium'>
                {t("columns.email")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-start font-medium'>
                {t("columns.status")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-center font-medium'>
                {t("columns.submitted_at")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-center font-medium'>
                {t("columns.approved_at")}
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-end font-medium'>
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border bg-surface-1'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-surface-3 shrink-0' />
                      <div className='h-4 w-28 bg-surface-3 rounded' />
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-24 bg-surface-3 rounded' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-36 bg-surface-3 rounded' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-6 w-16 bg-surface-3 rounded-full' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-24 bg-surface-3 rounded' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-24 bg-surface-3 rounded' />
                  </td>
                  <td className='px-4 py-4 text-end'>
                    <div className='h-8 w-8 bg-surface-3 rounded ms-auto' />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-4 py-12 text-center text-txt-muted'
                >
                  {t("empty")}
                </td>
              </tr>
            ) : (
              data.map((tenant) => {
                const owner = tenant.users?.[0] || {};
                const createdDate = formatDate(tenant.createdAt);
                const approvedDate = tenant.approvedAt
                  ? formatDate(tenant.approvedAt)
                  : null;
                const statusLabel =
                  (
                    {
                      ACTIVE: t("active"),
                      PENDING: t("pending"),
                      SUSPENDED: t("suspended"),
                    } as Record<string, string>
                  )[tenant.status] ?? tenant.status;

                return (
                  <tr
                    key={tenant.id}
                    className='transition-colors hover:bg-surface-2/50'
                  >
                    {/* Restaurant */}
                    <td className='whitespace-nowrap px-4 py-4'>
                      <div className='flex items-center gap-3'>
                        {tenant.logo ? (
                          <img
                            src={tenant.logo}
                            alt={tenant.name}
                            className='h-10 w-10 rounded-full object-cover border border-border shrink-0'
                          />
                        ) : (
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-bold shrink-0 border border-brand/20'>
                            {tenant.name.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className='font-medium text-txt-primary'>
                          {tenant.name}
                        </span>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className='whitespace-nowrap px-4 py-4 text-txt-secondary text-sm'>
                      {owner.name || "–"}
                    </td>

                    {/* Email */}
                    <td className='whitespace-nowrap px-4 py-4 text-txt-secondary text-sm'>
                      <div
                        dir='ltr'
                        className='inline-flex flex-col items-start text-left'
                      >
                        {owner.email || "–"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className='whitespace-nowrap px-4 py-4'>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[
                            tenant.status as keyof typeof statusStyles
                          ] || ""
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    {/* Submission date */}
                    <td className='whitespace-nowrap px-4 py-4 text-txt-secondary text-sm text-center'>
                      <div
                        dir='ltr'
                        className='inline-flex flex-col items-start text-left'
                      >
                        <span>{createdDate.date}</span>
                        {createdDate.time && (
                          <span className='text-xs text-txt-muted mt-0.5'>
                            {createdDate.time}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Approval date */}
                    <td className='whitespace-nowrap px-4 py-4 text-txt-secondary text-sm text-center'>
                      {approvedDate ? (
                        <div
                          dir='ltr'
                          className='inline-flex flex-col items-start text-left'
                        >
                          <span>{approvedDate.date}</span>
                          <span className='text-xs text-txt-muted mt-0.5'>
                            {approvedDate.time}
                          </span>
                        </div>
                      ) : (
                        <span className='text-txt-muted'>–</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className='whitespace-nowrap px-4 py-4 text-end'>
                      <RowActionsMenu tenant={tenant} onRefetch={onRefetch} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={total}
        onChange={onPageChange}
      />
    </div>
  );
}
