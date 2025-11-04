import AuthenticationGuard from '@/components/guards/authentication-guard';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { useJourneys } from '@/lib/hooks/use-journeys';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface Journey {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  insights?: string | null;
  coverLetter?: string | null;
  createdAt: string;
}

export default function JourneysPage() {
  const { data: journeys, isLoading } = useJourneys();

  const columns: ColumnDef<Journey>[] = [
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <Link href={`/journeys/${row.original._id}`} className="hover:underline text-primary">
          {row.getValue("companyName")}
        </Link>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: "Position",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colors = {
          completed: { bg: "#CBF4C9", text: "#0E6245", border: "#CBF4C9" },
          "in-progress": { bg: "#F8E5BA", text: "#9C3F0F", border: "#F8E5BA" },
          applied: { bg: "#FFE5E5", text: "#C53030", border: "#FFE5E5" },
          archived: { bg: "#F3F4F6", text: "#6B7280", border: "#F3F4F6" },
          default: { bg: "#FEF3C7", text: "#92400E", border: "#FEF3C7" },
        };

        const color = colors[status as keyof typeof colors] || colors.default;

        return (
          <Badge
            className="text-xs border"
            style={{
              backgroundColor: color.bg,
              color: color.text,
              borderColor: color.border,
            }}
          >
            {status.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "insights",
      header: "Insights",
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          {row.original.insights ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">○</span>
          )}
        </span>
      ),
    },
    {
      id: "coverLetter",
      header: "Cover Letter",
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          {row.original.coverLetter ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">○</span>
          )}
        </span>
      ),
    },
  ];

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Journeys</h1>
              <p className="text-muted-foreground">
                Manage all your job applications and track progress.
              </p>
            </div>
            <Button asChild>
              <Link href="/journeys/new">
                <Plus className="w-4 h-4 mr-2" />
                New journey
              </Link>
            </Button>
          </div>

          {/* Journeys Table */}
          <DataTable
            columns={columns}
            data={journeys || []}
            loading={isLoading}
          />
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
