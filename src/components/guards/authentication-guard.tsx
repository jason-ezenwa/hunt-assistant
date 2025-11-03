import { useSession } from '@/lib/hooks/use-session';
import { useRouter } from 'next/router';
import { isAfter } from 'date-fns';
import { useEffect, useState, ReactNode } from 'react';

interface AuthenticationGuardProps {
  children: ReactNode;
}

export default function AuthenticationGuard({ children }: AuthenticationGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/auth/sign-in');
        return;
      }

      // Check if session is expired
      if (isAfter(new Date(), new Date(session.session.expiresAt))) {
        router.push('/auth/sign-in');
        return;
      }

      // Session is valid
      setIsCheckingAuth(false);
    }
  }, [session, isPending, router]);

  // Show loading state while checking authentication
  if (isPending || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If we get here, session is valid
  return <>{children}</>;
}
