"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/components/ui/sidebar"; // Import new SidebarLink
import type { SidebarLinkItem } from "@/components/ui/sidebar"; // Import type for links
import Logo from "@/components/icons/logo";
import { ScanLine, Info, Blend, LayoutList, HelpCircle } from "lucide-react"; // Added HelpCircle
import { useSidebar } from "@/components/ui/sidebar"; 
import React from "react"; 

const navItems: SidebarLinkItem[] = [ 
  { href: "/smart-scan", label: "Smart Scan", icon: <ScanLine /> },
  { href: "/jargon-explanation", label: "Clarity Tool", icon: <Info /> },
  { href: "/contract-analysis", label: "Compare & Refine", icon: <Blend /> },
  { href: "/ask-a-question", label: "Ask A Question", icon: <HelpCircle /> }, // Updated
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
            isActive={pathname === item.href || (pathname === '/' && item.href === '/smart-scan')}
          />
        ))}
      </nav>
    </div>
  );
}