
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/components/ui/sidebar"; // Import new SidebarLink
import type { SidebarLinkItem } from "@/components/ui/sidebar"; // Import type for links
import Logo from "@/components/icons/logo";
import { ScanLine, Info, Blend, LayoutList, Menu } from "lucide-react"; // Menu might be for mobile toggle if needed by new sidebar
import { useSidebar } from "@/components/ui/sidebar"; // To access 'open' state for logo display
import React from "react"; // Import React

const navItems: SidebarLinkItem[] = [ // Converted to SidebarLinkItem[]
  { href: "/smart-scan", label: "Smart Scan", icon: <ScanLine /> },
  { href: "/jargon-explanation", label: "Clarity Tool", icon: <Info /> },
  { href: "/contract-analysis", label: "Compare & Refine", icon: <Blend /> },
  { href: "/animated-list-demo", label: "Animated List", icon: <LayoutList /> },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { open, animate } = useSidebar(); // Get open state

  return (
    // The new sidebar structure manages layout differently.
    // SidebarHeader and SidebarMenu concepts are now part of how children are structured inside SidebarBody.
    <div className="flex flex-col h-full">
      <div className={cn("p-4 mb-4", animate && !open ? "px-3.5" : "px-4")}> {/* Adjust padding for logo when collapsed */}
        {/* Conditional Logo based on open state */}
        {animate && !open ? (
           <Logo className="text-sm justify-center items-center flex [&>svg]:h-6 [&>svg]:w-6 [&>span]:hidden" />
        ) : (
          <Logo />
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2"> {/* Links container */}
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            link={item}
            isActive={pathname === item.href || (pathname === '/' && item.href === '/smart-scan')}
          />
        ))}
      </nav>
      {/* Footer content can be added here if needed */}
    </div>
  );
}
