import { ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/hooks/use-session';
import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-background">
      <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-300 bg-clip-text text-transparent">
                Hunt Assistant
              </h1>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {session?.user?.name || session?.user?.email}
              </span>
              <Link href="/journey/new">
                <Button size="sm" className="text-xs md:text-sm">
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New journey</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
