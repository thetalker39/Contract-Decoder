
"use client";

import { cn } from "@/lib/utils";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface SidebarLinkItem {
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
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  useEffect(() => {
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

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & { logoSlotMobile?: React.ReactNode }
) => {
  // Explicitly destructure props
  const { logoSlotMobile, children, className, ...desktopSpecificProps } = props;

  return (
    <>
      {/* Pass only relevant props to DesktopSidebar. Children are needed. className can be passed if intended for the main div. */}
      {/* desktopSpecificProps should now only contain motion.div compatible props. */}
      <DesktopSidebar className={className} {...desktopSpecificProps}>
        {children}
      </DesktopSidebar>
      {/* Pass explicitly needed props to MobileSidebar */}
      <MobileSidebar className={className} logoSlotMobile={logoSlotMobile}>
        {children}
      </MobileSidebar>
    </>
  );
};

// DesktopSidebar no longer expects logoSlotMobile in its direct props type
export const DesktopSidebar = ({
  className,
  children,
  ...rest // These are motion.div compatible props from desktopSpecificProps
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (animate && !open) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (animate && open) {
      leaveTimeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 150); 
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground w-[260px] flex-shrink-0 border-r border-sidebar-border overflow-hidden",
        className
      )}
      animate={{
        width: animate ? (open ? "260px" : "72px") : "260px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest} // logoSlotMobile is not in rest
    >
      {children}
    </motion.div>
  );
};

// MobileSidebar receives props explicitly from SidebarBody
export const MobileSidebar = ({
  className,
  children,
  logoSlotMobile,
}: {
  className?: string; // For the mobile header bar
  children?: React.ReactNode;
  logoSlotMobile?: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-background text-foreground w-full border-b border-border sticky top-0 z-20",
          className, // Apply className to the mobile header bar
        )}
      >
        {logoSlotMobile}
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
              "fixed h-full w-full inset-0 bg-sidebar text-sidebar-foreground p-6 z-[100] flex flex-col justify-between md:hidden"
              // Note: className from SidebarBody is applied to the header bar, not this motion.div directly.
            )}
          >
            <div
              className="absolute right-6 top-6 z-50 text-sidebar-foreground cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <X className="h-6 w-6"/>
            </div>
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
          display: animate && open ? "inline-block" : "none",
          opacity: animate && open ? 1 : 0,                
        }}
        transition={{ duration: 0.15 }} 
        className={cn(
            "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre", 
            isActive ? "text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground", 
            (animate && !open) ? "md:hidden" : "" 
        )}
      >
        {link.label}
      </motion.span>
    </NextLink>
  );
};
