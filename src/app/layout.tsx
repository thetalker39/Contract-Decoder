
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import AppHeader from '@/components/layout/app-header';
import SidebarNav from '@/components/layout/sidebar-nav';

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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full bg-background text-foreground`}>
        <SidebarProvider defaultOpen={true}>
          <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <SidebarNav />
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
