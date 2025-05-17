
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

// Renamed from SidebarProvider to InternalSidebarProvider to avoid conflict
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
  ...rest // All other props
}: React.ComponentProps<typeof motion.div> & { logoSlotMobile?: React.ReactNode }) => {
  
  // Prepare props for MobileSidebar
  const mobileSidebarProps = {
    className, // This className likely applies to the wrapper/header for mobile
    logoSlotMobile,
    children, // Children are passed to be rendered inside the mobile sheet
  };

  // DesktopSidebar gets the remaining props (like Framer Motion props) and children
  const desktopSidebarProps = {
    className, // This className applies to the DesktopSidebar's motion.div
    children,
    ...rest, // Spread the Framer motion props here
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
  // logoSlotMobile, // Explicitly destructure to prevent passing to motion.div
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
      }, 150); // Small delay before closing
    }
  };

   useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground w-[260px] flex-shrink-0 border-r border-sidebar-border overflow-hidden", // Added overflow-hidden
        className
      )}
      animate={{
        width: animate ? (open ? "260px" : "72px") : "260px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest} // Spread the rest of the props here (e.g., Framer Motion props)
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
          className, // This className is for the mobile header bar
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
            <div className="flex flex-col h-full"> {/* Ensure children take full height */}
                {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface SidebarLinkProps extends Omit<NextLinkProps, 'href'> {
  link: SidebarLinkItem;
  className?: string;
  isActive?: boolean;
}

export const SidebarLink = ({ link, className, isActive, ...props }: SidebarLinkProps) => {
  const { open, animate, setOpen } = useSidebar();
  const [isMounted, setIsMounted] = useState(false); // For client-side only rendering/styling

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    // Close mobile sidebar on click
    if (typeof window !== 'undefined' && window.innerWidth < 768 && open) {
       setOpen(false);
    }
  };

  // Define classes based on isActive, but apply them conditionally using isMounted
  const linkBaseClasses = "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const activeStateLinkClasses = isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground";
  
  const iconBaseClasses = "h-5 w-5 flex-shrink-0";
  const activeStateIconClasses = isActive 
    ? "text-sidebar-primary-foreground" 
    : "text-sidebar-foreground group-hover/sidebar:text-sidebar-accent-foreground";

  const labelBaseClasses = "text-sm group-hover/sidebar:translate-x-1 whitespace-pre overflow-hidden";
  const activeStateLabelClasses = isActive ? "text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground";

  return (
    <NextLink
      href={link.href}
      onClick={handleClick}
      className={cn(
        linkBaseClasses,
        isMounted ? activeStateLinkClasses : "text-sidebar-foreground", // Fallback for SSR/initial client
        className
      )}
      {...props}
    >
      {isValidElement(link.icon) ? cloneElement(link.icon as React.ReactElement<{className?: string}>, {
        className: cn(
          iconBaseClasses,
          (link.icon as React.ReactElement<{className?: string}>).props.className,
          isMounted ? activeStateIconClasses : "text-sidebar-foreground group-hover/sidebar:text-sidebar-accent-foreground" // Fallback for SSR/initial client
        )
      }) : link.icon}

      {isMounted ? (
        <motion.span
          key={link.label + (open ? "-open" : "-closed")} 
          initial={false} 
          animate={{
            opacity: animate && open ? 1 : 0,
            width: animate && open ? 'auto' : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(labelBaseClasses, activeStateLabelClasses)} // isActive is fine here as span only renders when isMounted
        >
          {link.label}
        </motion.span>
      ) : null}
    </NextLink>
  );
};
