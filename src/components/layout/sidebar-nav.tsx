
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/components/ui/sidebar"; 
import type { SidebarLinkItem } from "@/components/ui/sidebar"; 
import Logo from "@/components/icons/logo";
import { ScanLine, Sparkles, BarChart3, HelpCircle, LogOut, LayoutDashboard } from "lucide-react"; // Added LayoutDashboard, Sparkles, BarChart3, LogOut
import { useSidebar } from "@/components/ui/sidebar"; 
import React from "react"; 

const navItems: SidebarLinkItem[] = [ 
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/smart-scan", label: "Smart Scan", icon: <ScanLine /> },
  { href: "/jargon-explanation", label: "Clarity Tool", icon: <Sparkles /> }, // Icon updated
  { href: "/contract-analysis", label: "Compare & Refine", icon: <BarChart3 /> }, // Icon updated
  { href: "/ask-a-question", label: "Ask A Question", icon: <HelpCircle /> }, 
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { open, animate } = useSidebar(); 

  return (
    <div className="flex flex-col h-full">
      <div className={cn("p-4 mb-4", animate && !open ? "px-3.5" : "px-4")}> 
        {animate && !open ? (
           <Logo className="text-sm justify-center items-center flex [&>svg]:h-6 [&>svg]:w-6 [&>span]:hidden" />
        ) : (
          <Logo />
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2"> 
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            link={item}
            isActive={pathname === item.href || (pathname === '/' && item.href === '/dashboard')} // Updated default active
          />
        ))}
      </nav>
      <div className="mt-auto p-2"> {/* Logout button section */}
        <SidebarLink
          link={{ href: "#", label: "Logout", icon: <LogOut /> }}
          isActive={false} // Assuming logout is not an "active" page
        />
      </div>
    </div>
  );
}
