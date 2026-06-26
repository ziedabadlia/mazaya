import { UserRole } from "@prisma/client";
import {
  LayoutDashboard,
  Utensils,
  Store,
  Users,
  Receipt,
  ChefHat,
  Settings,
  Shield,
} from "lucide-react";

export const navIconMap = {
  LayoutDashboard,
  Utensils,
  Store,
  Users,
  Receipt,
  ChefHat,
  Settings,
  Shield,
} as const;

export type NavIconKey = keyof typeof navIconMap;

export interface NavItem {
  translationKey: string;
  href: string;
  iconKey: NavIconKey;
  roles: UserRole[];
}

export const dashboardNavItems: NavItem[] = [
  {
    translationKey: "Overview",
    href: "/dashboard",
    iconKey: "LayoutDashboard",
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "POS",
    href: "/dashboard/pos",
    iconKey: "Receipt",
    roles: ["OWNER", "BRANCH_MANAGER", "CASHIER"],
  },
  {
    translationKey: "Kitchen",
    href: "/dashboard/kitchen",
    iconKey: "ChefHat",
    roles: ["OWNER", "KITCHEN_STAFF"],
  },
  {
    translationKey: "Branches",
    href: "/dashboard/branches",
    iconKey: "Store",
    roles: ["OWNER"],
  },
  {
    translationKey: "Menu",
    href: "/dashboard/menu",
    iconKey: "Utensils",
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "Staff",
    href: "/dashboard/staff",
    iconKey: "Users",
    roles: ["OWNER", "BRANCH_MANAGER"],
  },
  {
    translationKey: "Settings",
    href: "/dashboard/settings",
    iconKey: "Settings",
    roles: ["OWNER"],
  },
  // ── SUPER ADMIN ──
  {
    translationKey: "OwnerAccounts",
    href: "/dashboard/admin/owner-accounts",
    iconKey: "Shield", // FIX: was "Users", should be "Shield" for the admin section
    roles: ["SUPER_ADMIN"],
  },
];
