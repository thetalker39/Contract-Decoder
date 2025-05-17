
"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/components/icons/logo";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-6 shadow-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:block">
        <Logo className="text-lg" />
      </div>
      {/* Add UserMenu or other header items here if needed */}
    </header>
  );
}
