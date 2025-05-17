
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar"; // Import new Sidebar components
import SidebarNav from '@/components/layout/sidebar-nav';
import Logo from '@/components/icons/logo'; // For mobile header

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Harmonic Agreement',
  description: 'Review and analyze your music contracts with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full bg-background text-foreground flex flex-col md:flex-row`}>
        <Sidebar animate={true}> {/* Sidebar now wraps its own provider logic */}
          <SidebarBody logoSlotMobile={<Logo className="text-lg text-foreground"/>}> {/* Pass children directly to SidebarBody */}
            <SidebarNav />
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-y-auto flex flex-col">
           {/* AppHeader is effectively replaced by MobileSidebar's header part for mobile, 
               and DesktopSidebar is standalone. Main content area below. */}
          <div className="flex-1 p-6 overflow-y-auto"> {/* Added a div for main content scrolling & padding */}
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
