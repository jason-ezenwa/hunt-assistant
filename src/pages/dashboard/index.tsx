import AuthenticationGuard from '@/components/guards/authentication-guard';
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useJourneys } from "@/lib/hooks/use-journeys";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, TrendingUp, Calendar, Plus } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";

export default function Dashboard() {
  const { data: journeys } = useJourneys();
  const { data: session } = useSession();

  const user = session?.user;

  const userName = user?.name?.split(" ")[0];
  // Get the most recent journey
  const recentJourney =
    journeys && journeys.length > 0
      ? journeys.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;

  const stats = {
    total: journeys?.length || 0,
    completed: journeys?.filter((j) => j.status === "completed").length || 0,
    inProgress: journeys?.filter((j) => j.status === "in-progress").length || 0,
  };

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              {` Welcome back${
                !user ? "" : `, ${userName}`
              }! Here's an overview of your job search
              journey.`}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total journeys
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In progress
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Journey */}
          {recentJourney && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent journey</h2>
                <Button asChild size="sm" variant="outline">
                  <Link href="/journeys">View all journeys</Link>
                </Button>
              </div>
              <Card className="hover:shadow-md transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {recentJourney.companyName}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {recentJourney.jobTitle}
                      </CardDescription>
                    </div>
                    <Badge
                      className="text-xs border"
                      style={{
                        backgroundColor:
                          recentJourney.status === "completed"
                            ? "#CBF4C9"
                            : recentJourney.status === "in-progress"
                            ? "#F8E5BA"
                            : recentJourney.status === "applied"
                            ? "#FFE5E5"
                            : "#F3F4F6",
                        color:
                          recentJourney.status === "completed"
                            ? "#0E6245"
                            : recentJourney.status === "in-progress"
                            ? "#9C3F0F"
                            : recentJourney.status === "applied"
                            ? "#C53030"
                            : "#6B7280",
                        borderColor:
                          recentJourney.status === "completed"
                            ? "#CBF4C9"
                            : recentJourney.status === "in-progress"
                            ? "#F8E5BA"
                            : recentJourney.status === "applied"
                            ? "#FFE5E5"
                            : "#F3F4F6",
                      }}>
                      {recentJourney.status.replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Insights:
                      </span>
                      {recentJourney.insights ? (
                        <span className="text-primary">✓</span>
                      ) : (
                        <span className="text-muted-foreground">○</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Cover Letter:
                      </span>
                      {recentJourney.coverLetter ? (
                        <span className="text-primary">✓</span>
                      ) : (
                        <span className="text-muted-foreground">
                          ○ Not Generated
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/journeys/${recentJourney._id}`}>
                        View details
                      </Link>
                    </Button>
                    {!recentJourney.insights && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/journeys/${recentJourney._id}`}>
                          Generate insights
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          {!recentJourney && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Get started</h2>
              <p className="text-muted-foreground mb-6">
                Create your first journey to start getting personalized insights
                and cover letters.
              </p>
              <Button asChild size="lg">
                <Link href="/journeys/new">
                  <Plus className="w-5 h-5 mr-2" />
                  Create your first journey
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
