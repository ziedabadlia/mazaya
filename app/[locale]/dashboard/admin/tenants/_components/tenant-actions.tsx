"use client";

import { useTransition } from "react";
import { activateTenant, suspendTenant } from "../actions";
import { Loader2 } from "lucide-react";

interface TenantActionsProps {
  tenantId: string;
  currentStatus: string;
}

export function TenantActions({ tenantId, currentStatus }: TenantActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleActivate = () => {
    startTransition(() => activateTenant(tenantId));
  };

  const handleSuspend = () => {
    startTransition(() => suspendTenant(tenantId));
  };

  return (
    <div className='flex items-center gap-2'>
      {currentStatus !== "ACTIVE" && (
        <button
          onClick={handleActivate}
          disabled={isPending}
          className='rounded-md border border-status-success/20 bg-status-success-bg px-3 py-1.5 text-xs font-medium text-status-success transition-colors hover:bg-status-success/20 disabled:opacity-50'
        >
          {isPending ? <Loader2 className='h-3 w-3 animate-spin' /> : "تفعيل"}
        </button>
      )}
      {currentStatus !== "SUSPENDED" && (
        <button
          onClick={handleSuspend}
          disabled={isPending}
          className='rounded-md border border-status-danger/20 bg-status-danger-bg px-3 py-1.5 text-xs font-medium text-status-danger transition-colors hover:bg-status-danger/20 disabled:opacity-50'
        >
          {isPending ? <Loader2 className='h-3 w-3 animate-spin' /> : "إيقاف"}
        </button>
      )}
    </div>
  );
}
