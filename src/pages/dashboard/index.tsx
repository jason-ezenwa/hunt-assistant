import AuthenticationGuard from '@/components/guards/authentication-guard';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import JourneyList from '@/components/dashboard/journey-list';
import { useJourneys } from '@/lib/hooks/use-journeys';

export default function Dashboard() {
  const { data: journeys, isLoading } = useJourneys();

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Applications</h1>
          <p className="text-muted-foreground">
            Manage your job applications and track your progress.
          </p>
        </div>

        <JourneyList journeys={journeys || []} isLoading={isLoading} />
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
