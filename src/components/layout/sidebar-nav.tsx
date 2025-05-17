
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Logo from "@/components/icons/logo";
import { ScanLine, Info, Blend, Home, LayoutList } from "lucide-react";

const navItems = [
  { href: "/smart-scan", label: "Smart Scan", icon: ScanLine },
  { href: "/jargon-explanation", label: "Clarity Tool", icon: Info },
  { href: "/contract-analysis", label: "Compare & Refine", icon: Blend },
  { href: "/animated-list-demo", label: "Animated List", icon: LayoutList },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="block">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarMenu className="p-4">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname === '/' && item.href === '/smart-scan')}
                className={cn(
                  "w-full justify-start",
                  (pathname === item.href || (pathname === '/' && item.href === '/smart-scan' && item.href === '/smart-scan' )) // ensure home redirect logic applies only to smart-scan
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                tooltip={item.label}
              >
                <a>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
