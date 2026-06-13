import { UserRole } from "@prisma/client";
import { type ComponentType, type ComponentProps } from "react";
import { 
  type LucideProps,
  LayoutDashboard, 
  Utensils, 
  Store, 
  Users, 
  Receipt, 
  ChefHat, 
  Settings 
} from "lucide-react";

export type SharedDashboardIcon = ComponentType<ComponentProps<typeof LayoutDashboard>>;

export interface NavItem {
  titleEn: string;
  titleAr: string;
  href: string;
  icon: SharedDashboardIcon; 
  roles: UserRole[];
}

export const dashboardNavItems: NavItem[] = [
  {
    titleEn: "Overview",
    titleAr: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    titleEn: "POS / Checkout",
    titleAr: "نقطة البيع",
    href: "/dashboard/pos",
    icon: Receipt,
    roles: ["OWNER", "BRANCH_MANAGER", "CASHIER"],
  },
  {
    titleEn: "Kitchen KDS",
    titleAr: "شاشة المطبخ",
    href: "/dashboard/kitchen",
    icon: ChefHat,
    roles: ["OWNER", "KITCHEN_STAFF"],
  },
  {
    titleEn: "Branches",
    titleAr: "الفروع",
    href: "/dashboard/branches",
    icon: Store,
    roles: ["OWNER"],
  },
  {
    titleEn: "Menu Management",
    titleAr: "إدارة القائمة",
    href: "/dashboard/menu",
    icon: Utensils,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    titleEn: "Staff Control",
    titleAr: "إدارة الموظفين",
    href: "/dashboard/staff",
    icon: Users,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    titleEn: "Settings",
    titleAr: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER"],
  },
];