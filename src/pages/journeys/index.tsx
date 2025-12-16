import { useRouter } from "next/router";
import AuthenticationGuard from "@/components/guards/authentication-guard";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useJourneys } from "@/lib/hooks/use-journeys";
import { useDeleteJourney } from "@/lib/hooks/use-journey-mutations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { getStatusColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const router = useRouter();
  const { data: journeys, isLoading } = useJourneys();
  const deleteJourneyMutation = useDeleteJourney();

  const columns: ColumnDef<Journey>[] = [
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <Link
          href={`/journeys/${row.original._id}`}
          className="hover:underline text-primary">
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
        const color = getStatusColor(status);

        return (
          <Badge
            className="text-xs border"
            style={{
              backgroundColor: color.bg,
              color: color.text,
              borderColor: color.border,
            }}>
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
            <span className="text-primary">✓</span>
          ) : (
            <span className="text-muted-foreground">○</span>
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
            <span className="text-primary">✓</span>
          ) : (
            <span className="text-muted-foreground">○</span>
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/journeys/${row.original._id}`);
                }}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
                disabled={deleteJourneyMutation.isPending}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center w-full">
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      Delete
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        Delete journey
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the journey for{" "}
                        <span className="font-medium">
                          {row.original.companyName}
                        </span>
                        .
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        disabled={deleteJourneyMutation.isPending}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          deleteJourneyMutation.mutate(row.original._id, {
                            onSuccess: () => {
                              toast.success("Journey deleted successfully");
                            },
                            onError: (error) => {
                              console.error("Error deleting journey:", error);
                              toast.error("Failed to delete journey");
                            },
                          });
                        }}
                        disabled={deleteJourneyMutation.isPending}>
                        {deleteJourneyMutation.isPending ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="max-w-[62%] md:max-w-full flex-1">
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
