import { ReactNode } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="h-screen">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <SidebarInset className="h-screen flex flex-col">
        {/* Mobile header - hidden on desktop */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <div>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/journeys/new">
              <Button size="sm" className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                New
              </Button>
            </Link>
          </div>
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
