"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Moon,
  BookOpen,
  UserRound,
  LayoutDashboard,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/dreams/new", label: "Record a dream", icon: Moon },
  { href: "/dashboard/dreams", label: "Dream journal", icon: BookOpen },
  { href: "/dashboard/profile", label: "My background", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings2Icon },
];

export function AppSidebar() {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  if (!isSignedIn) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-500 shadow-[0_0_10px_2px_color-mix(in_srgb,var(--accent-400)_60%,transparent)]" />
          <div>
            <p className="text-sm font-semibold text-[#12213A] dark:text-[#F6F1E7]">
              Dream{" "}
              <span className="text-accent-600 dark:text-accent-400 [filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--accent-400)_40%,transparent))]">
                Reader
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              Your dreams, read in context of your life
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={pathname === href}>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <div className="px-3 py-2 border-t border-accent-500/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-medium text-accent-700 dark:text-accent-300">
                {(user.fullName ?? user.username ?? "U").slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-[#12213A] dark:text-[#F6F1E7]">
                  {user.fullName ?? user.username}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
