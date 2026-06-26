import { TenantActions } from "./tenant-actions";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  _count: { users: number };
}

interface TenantTableProps {
  tenants: Tenant[];
}

const statusStyles: Record<string, string> = {
  ACTIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  PENDING: "border-brand/20 bg-brand/10 text-brand",
  SUSPENDED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "نشط",
  PENDING: "قيد المراجعة",
  SUSPENDED: "موقوف",
};

export function TenantTable({ tenants }: TenantTableProps) {
  if (tenants.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center rounded-xl border border-dashed border-border'>
        <p className='text-sm text-txt-muted'>لا توجد مطاعم مسجلة بعد</p>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-xl border border-border bg-surface-1'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border bg-surface-2/50'>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              المطعم
            </th>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              المعرّف
            </th>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              المستخدمون
            </th>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              تاريخ التسجيل
            </th>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              الحالة
            </th>
            <th className='px-4 py-3 text-start text-xs font-semibold text-txt-muted'>
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className='transition-colors hover:bg-surface-2/30'
            >
              <td className='px-4 py-3 font-medium text-txt-primary'>
                {tenant.name}
              </td>
              <td className='px-4 py-3 text-txt-muted' dir='ltr'>
                {tenant.slug}
              </td>
              <td className='px-4 py-3 text-txt-secondary'>
                {tenant._count.users}
              </td>
              <td className='px-4 py-3 text-txt-muted'>
                {new Date(tenant.createdAt).toLocaleDateString("ar-SA")}
              </td>
              <td className='px-4 py-3'>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[tenant.status]}`}
                >
                  {statusLabels[tenant.status] ?? tenant.status}
                </span>
              </td>
              <td className='px-4 py-3'>
                <TenantActions
                  tenantId={tenant.id}
                  currentStatus={tenant.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
