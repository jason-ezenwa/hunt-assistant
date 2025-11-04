import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";

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
  const [deletePopoverState, setDeletePopoverState] = useState<{
    isOpen: boolean;
    journeyId: string | null;
    companyName: string | null;
  }>({ isOpen: false, journeyId: null, companyName: null });

  const handleDeleteJourney = (journeyId: string, companyName: string) => {
    setDeletePopoverState({ isOpen: true, journeyId, companyName });
  };

  const handleConfirmDelete = () => {
    if (!deletePopoverState.journeyId) return;
    deleteJourneyMutation.mutate(deletePopoverState.journeyId, {
      onSuccess: () => {
        toast.success("Journey deleted successfully");
        setDeletePopoverState({
          isOpen: false,
          journeyId: null,
          companyName: null,
        });
      },
      onError: (error) => {
        console.error("Error deleting journey:", error);
        toast.error("Failed to delete journey");
        setDeletePopoverState({
          isOpen: false,
          journeyId: null,
          companyName: null,
        });
      },
    });
  };

  const handleCancelDelete = () => {
    setDeletePopoverState({
      isOpen: false,
      journeyId: null,
      companyName: null,
    });
  };

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
        const colors = {
          completed: { bg: "#CBF4C9", text: "#0E6245", border: "#CBF4C9" },
          "in-progress": { bg: "#F8E5BA", text: "#9C3F0F", border: "#F8E5BA" },
          applied: { bg: "#DCFCE7", text: "#166534", border: "#DCFCE7" },
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
            <span className="text-primary">✓</span>
          ) : (
            <span className="text-gray-400">○</span>
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const cellRef = React.useRef<HTMLDivElement>(null);
        return (
          <>
            <div ref={cellRef}>
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
                    onClick={() => {
                      setDeletePopoverState({
                        isOpen: true,
                        journeyId: row.original._id,
                        companyName: row.original.companyName,
                      });
                    }}
                    disabled={deleteJourneyMutation.isPending}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Popover
              open={
                deletePopoverState.isOpen &&
                deletePopoverState.journeyId === row.original._id
              }
              onOpenChange={(open) => {
                if (!open) {
                  setDeletePopoverState({
                    isOpen: false,
                    journeyId: null,
                    companyName: null,
                  });
                }
              }}>
              <PopoverAnchor asChild>
                <div ref={cellRef} />
              </PopoverAnchor>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Delete journey</h4>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Are you sure you want to delete the journey for{" "}
                      <span className="font-medium">
                        {row.original.companyName}
                      </span>
                      ?
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDelete}
                        disabled={deleteJourneyMutation.isPending}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleConfirmDelete}
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
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        );
      },
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
