import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="h-screen">
      <DashboardSidebar />

      <SidebarInset className="h-screen flex flex-col">
        {/* Mobile header - hidden on desktop */}
        <header className="sticky top-0 z-10 flex h-[65px] shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:hidden">
          <SidebarTrigger />
          <ThemeToggle />
        </header>

        {/* Desktop header - visible on desktop */}
        <header className="sticky top-0 z-10 hidden md:flex h-[69px]  shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6 lg:px-8">
          <div>{/* <SidebarTrigger className="-ml-1" /> */}</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
