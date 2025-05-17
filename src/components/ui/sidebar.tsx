
"use client";

import { cn } from "@/lib/utils";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React, { useState, createContext, useContext, useRef, useEffect, cloneElement, isValidElement } from "react";
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

export const SidebarBody = ({
  logoSlotMobile,
  children,
  className,
  ...rest
}: React.ComponentProps<typeof motion.div> & { logoSlotMobile?: React.ReactNode }) => {
  const mobileSidebarProps = {
    className,
    logoSlotMobile,
    children,
  };

  const desktopSidebarProps = {
    className,
    children,
    ...rest,
  };

  return (
    <>
      <DesktopSidebar {...desktopSidebarProps} />
      <MobileSidebar {...mobileSidebarProps} />
    </>
  );
};


export const DesktopSidebar = ({
  className,
  children,
  logoSlotMobile: _logoSlotMobile, // Explicitly receive and ignore if not used
  ...rest
}: Omit<React.ComponentProps<typeof motion.div>, 'logoSlotMobile'> & { logoSlotMobile?: React.ReactNode }) => {
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
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  logoSlotMobile,
}: {
  className?: string;
  children?: React.ReactNode;
  logoSlotMobile?: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-background text-foreground w-full border-b border-border sticky top-0 z-20",
          className,
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

// Defining SidebarLinkProps type for clarity, matching `src/components/layout/sidebar-nav.tsx`
interface SidebarLinkProps extends Omit<NextLinkProps, 'href'> {
  link: SidebarLinkItem;
  className?: string;
  isActive?: boolean;
}

export const SidebarLink = ({ link, className, isActive, ...props }: SidebarLinkProps) => {
  const { open, animate, setOpen } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    // Close mobile sidebar on click
    if (typeof window !== 'undefined' && window.innerWidth < 768 && open) {
       setOpen(false);
    }
  };

  return (
    <NextLink
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-md",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
        className
      )}
      {...props}
    >
      {isValidElement(link.icon) ? cloneElement(link.icon as React.ReactElement<{className?: string}>, {
        className: cn(
          "h-5 w-5 flex-shrink-0",
          (link.icon as React.ReactElement<{className?: string}>).props.className,
          isActive ? "text-sidebar-primary-foreground"
                   : "text-sidebar-foreground group-hover/sidebar:text-sidebar-accent-foreground"
        )
      }) : link.icon}

      {isMounted ? (
        <motion.span
          key={link.label + (open ? "-open" : "-closed")}
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: animate && open ? 1 : 0, // Explicitly use animate context
            width: animate && open ? 'auto' : 0,   // Explicitly use animate context
          }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "text-sm group-hover/sidebar:translate-x-1 whitespace-pre overflow-hidden",
            isActive ? "text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground"
          )}
        >
          {link.label}
        </motion.span>
      ) : null }
    </NextLink>
  );
};
