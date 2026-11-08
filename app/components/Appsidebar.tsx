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
import { Moon, BookOpen, UserRound, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/dreams/new", label: "Record a dream", icon: Moon },
  { href: "/dashboard/dreams", label: "Dream journal", icon: BookOpen },
  { href: "/dashboard/profile", label: "My background", icon: UserRound },
];

export function AppSidebar() {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  if (!isSignedIn) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
          <div>
            <p className="text-sm font-semibold text-[#12213A] dark:text-[#F6F1E7]">
              Dream{" "}
              <span className="text-violet-600 dark:text-violet-400">
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
          <div className="px-3 py-2 border-t border-violet-900/10 dark:border-violet-400/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-medium text-violet-700 dark:text-violet-300">
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
