import { UserRole } from "@prisma/client";
import { type ComponentType, type ComponentProps } from "react";
import { 
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
  translationKey: string; // The key used in messages/ar.json and messages/en.json
  href: string;
  icon: SharedDashboardIcon; 
  roles: UserRole[];
}

export const dashboardNavItems: NavItem[] = [
  {
    translationKey: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "POS",
    href: "/dashboard/pos",
    icon: Receipt,
    roles: ["OWNER", "BRANCH_MANAGER", "CASHIER"],
  },
  {
    translationKey: "Kitchen",
    href: "/dashboard/kitchen",
    icon: ChefHat,
    roles: ["OWNER", "KITCHEN_STAFF"],
  },
  {
    translationKey: "Branches",
    href: "/dashboard/branches",
    icon: Store,
    roles: ["OWNER"],
  },
  {
    translationKey: "Menu",
    href: "/dashboard/menu",
    icon: Utensils,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "Staff",
    href: "/dashboard/staff",
    icon: Users,
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER"],
  },
];