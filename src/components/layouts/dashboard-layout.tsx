import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="h-screen">
      <DashboardSidebar />

      <SidebarInset className="h-screen flex flex-col">
        {/* Mobile header - hidden on desktop */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger />
        </header>

        {/* Desktop header - visible on desktop */}
        <header className="hidden md:flex h-16 shrink-0 items-center gap-2 border-b md:px-6 lg:px-8">
          {/* <SidebarTrigger className="-ml-1" /> */}
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
