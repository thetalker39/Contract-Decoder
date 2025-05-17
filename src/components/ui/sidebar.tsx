
"use client";

import { cn } from "@/lib/utils";
import NextLink, { LinkProps as NextLinkProps } from "next/link"; // Renamed to avoid conflict
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

// Interface for link items, compatible with existing navItems
export interface SidebarLinkItem { // Exporting for use in sidebar-nav.tsx
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// This Provider is internal to this component. If RootLayout needs one, it should use this one.
const InternalSidebarProvider = ({ 
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false); // Default to closed for mobile-first logic

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Add keyboard shortcut to toggle sidebar (Ctrl/Cmd + B)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);


  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Main Sidebar component - acts as the provider wrapper
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <InternalSidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </InternalSidebarProvider>
  );
};


export const SidebarBody = (props: React.ComponentProps<typeof motion.div> & { logoSlotMobile?: React.ReactNode}) => {
  // This component now just decides whether to render Desktop or Mobile structure
  // The actual sidebar content (links, logo etc) will be passed as children
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  logoSlotMobile, // Destructure logoSlotMobile to prevent it from being spread by ...rest
  ...rest // Use ...rest for remaining motion.div props
}: React.ComponentProps<typeof motion.div> & { logoSlotMobile?: React.ReactNode }) => { // Add logoSlotMobile to component's props type
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground w-[260px] flex-shrink-0 border-r border-sidebar-border", 
        className
      )}
      animate={{
        width: animate ? (open ? "260px" : "72px") : "260px", 
      }}
      onMouseEnter={() => {
        if (animate && !open) setOpen(true);
      }}
      onMouseLeave={() => {
        if (animate && open) setOpen(false);
      }}
      {...rest} // Spread only the valid DOM/motion props
    >
      {children} {/* Children will be SidebarNav content */}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  logoSlotMobile, // Destructure logoSlotMobile here
  ...props
}: React.ComponentProps<"div"> & { logoSlotMobile?: React.ReactNode}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* This div is part of the AppHeader essentially for mobile */}
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-background text-foreground w-full border-b border-border sticky top-0 z-20",
        )}
      >
        {logoSlotMobile} {/* Slot for logo on mobile header */}
        <Menu
            className="text-foreground cursor-pointer h-6 w-6" 
            onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-sidebar text-sidebar-foreground p-6 z-[100] flex flex-col justify-between", 
              className
            )}
          >
            <div
              className="absolute right-6 top-6 z-50 text-sidebar-foreground cursor-pointer" 
              onClick={() => setOpen(!open)}
            >
              <X className="h-6 w-6"/>
            </div>
            {/* Children (SidebarNav content) will be rendered here for mobile */}
            <div className="flex flex-col h-full">
                {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  isActive, 
  ...props
}: {
  link: SidebarLinkItem; 
  className?: string;
  isActive?: boolean; 
  props?: NextLinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <NextLink 
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-md", 
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground", 
        className
      )}
      {...props}
    >
      {React.cloneElement(link.icon as React.ReactElement, { className: cn("h-5 w-5 flex-shrink-0", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground group-hover/sidebar:text-sidebar-accent-foreground") })}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
            "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
            isActive ? "text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground", 
             (animate && !open) ? "md:hidden" : ""
        )}
      >
        {link.label}
      </motion.span>
    </NextLink>
  );
};

