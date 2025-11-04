import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AuthenticationGuard from "@/components/guards/authentication-guard";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/lib/hooks/use-journeys";
import {
  useUpdateJourney,
  useDeleteJourney,
} from "@/lib/hooks/use-journey-mutations";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  FileText,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function JourneyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: journey, isLoading } = useJourney(id as string);
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateJourneyMutation = useUpdateJourney();
  const deleteJourneyMutation = useDeleteJourney();

  const generateInsightsMutation = useMutation({
    mutationFn: async (journeyId: string) => {
      const response = await fetch(`/api/journeys/${journeyId}/insights`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Insights generated successfully");
      queryClient.invalidateQueries({ queryKey: ["journey", journey?._id] });
    },
    onError: (error) => {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights");
    },
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: async (journeyId: string) => {
      const response = await fetch(`/api/journeys/${journeyId}/cover-letter`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Cover letter generated successfully");
      queryClient.invalidateQueries({ queryKey: ["journey", journey?._id] });
    },
    onError: (error) => {
      console.error("Error generating cover letter:", error);
      toast.error("Failed to generate cover letter");
    },
  });

  const handleGenerateInsights = () => {
    if (!journey) return;
    generateInsightsMutation.mutate(journey._id);
  };

  const handleGenerateCoverLetter = () => {
    if (!journey) return;
    generateCoverLetterMutation.mutate(journey._id);
  };

  const handleExportCoverLetter = async () => {
    if (!journey?.coverLetter) return;

    try {
      const response = await fetch("/api/export-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: journey.coverLetter }),
      });

      if (!response.ok) {
        throw new Error("Failed to export cover letter");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Cover letter exported successfully");
    } catch (error) {
      console.error("Error exporting cover letter:", error);
      toast.error("Failed to export cover letter");
    }
  };

  const handleMarkAsApplied = () => {
    if (!journey) return;
    updateJourneyMutation.mutate(
      {
        id: journey._id,
        data: { status: "applied" },
      },
      {
        onSuccess: () => {
          toast.success("Job marked as applied");
          queryClient.invalidateQueries({ queryKey: ["journey", journey._id] });
        },
        onError: (error) => {
          console.error("Error marking job as applied:", error);
          toast.error("Failed to mark job as applied");
        },
      }
    );
  };

  const handleDeleteJourney = () => {
    setIsDeletePopoverOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!journey) return;
    deleteJourneyMutation.mutate(journey._id, {
      onSuccess: () => {
        toast.success("Journey deleted successfully");
        router.push("/journeys");
        setIsDeletePopoverOpen(false);
      },
      onError: (error) => {
        console.error("Error deleting journey:", error);
        toast.error("Failed to delete journey");
        setIsDeletePopoverOpen(false);
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeletePopoverOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "#CBF4C9", text: "#0E6245", border: "#CBF4C9" };
      case "in-progress":
        return { bg: "#F8E5BA", text: "#9C3F0F", border: "#F8E5BA" };
      case "applied":
        return { bg: "#DCFCE7", text: "#166534", border: "#DCFCE7" };
      case "archived":
        return { bg: "#F3F4F6", text: "#6B7280", border: "#F3F4F6" };
      default:
        return { bg: "#FEF3C7", text: "#92400E", border: "#FEF3C7" };
    }
  };

  if (isLoading) {
    return (
      <AuthenticationGuard>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002ed4] mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading application...</p>
          </div>
        </DashboardLayout>
      </AuthenticationGuard>
    );
  }

  if (!journey) {
    return (
      <AuthenticationGuard>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The application you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Link href="/journeys">
              <Button>Back to journeys</Button>
            </Link>
          </div>
        </DashboardLayout>
      </AuthenticationGuard>
    );
  }

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/journeys"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to journeys
            </Link>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {journey.companyName}
                </h1>
                <p className="text-xl text-muted-foreground mb-3">
                  {journey.jobTitle}
                </p>
                <Badge
                  className="text-sm border"
                  style={{
                    backgroundColor: getStatusColor(journey.status).bg,
                    color: getStatusColor(journey.status).text,
                    borderColor: getStatusColor(journey.status).border,
                  }}>
                  {journey.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {journey.status !== "applied" && (
                  <Button
                    onClick={handleMarkAsApplied}
                    size="sm"
                    disabled={
                      generateCoverLetterMutation.isPending ||
                      generateInsightsMutation.isPending ||
                      updateJourneyMutation.isPending ||
                      deleteJourneyMutation.isPending
                    }
                    className="h-auto py-2 px-4">
                    {updateJourneyMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as applied
                      </>
                    )}
                  </Button>
                )}
                <Popover
                  open={isDeletePopoverOpen}
                  onOpenChange={setIsDeletePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={deleteJourneyMutation.isPending}>
                      {deleteJourneyMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
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
                            {journey.companyName}
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={handleGenerateInsights}
              disabled={
                generateInsightsMutation.isPending ||
                generateCoverLetterMutation.isPending ||
                updateJourneyMutation.isPending ||
                deleteJourneyMutation.isPending
              }
              variant="secondary"
              className="h-auto py-3">
              {generateInsightsMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {journey.insights
                    ? "Regenerate insights"
                    : "Generate insights"}
                </>
              )}
            </Button>

            <Button
              onClick={handleGenerateCoverLetter}
              disabled={
                generateCoverLetterMutation.isPending ||
                generateInsightsMutation.isPending ||
                updateJourneyMutation.isPending ||
                deleteJourneyMutation.isPending
              }
              className="h-auto py-3">
              {generateCoverLetterMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Writing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {journey.coverLetter
                    ? "Regenerate cover letter"
                    : "Generate cover letter"}
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Insights */}
            {journey.insights && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-lg shadow-secondary/50"></div>
                  Job fit analysis
                </h2>
                <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 text-foreground">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-3 text-foreground">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium mb-2 text-foreground">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 text-foreground/80 leading-relaxed">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-foreground/90">
                          {children}
                        </em>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-4 list-disc mb-4">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-4 list-decimal mb-4">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground/80">{children}</li>
                      ),
                    }}>
                    {journey.insights}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {journey.coverLetter && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                    Cover letter
                  </h2>
                  <Button
                    onClick={handleExportCoverLetter}
                    variant="outline"
                    size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 text-foreground">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-3 text-foreground">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium mb-2 text-foreground">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 text-foreground/80 leading-relaxed">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-foreground/90">
                          {children}
                        </em>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-4 list-disc mb-4">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-4 list-decimal mb-4">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground/80">{children}</li>
                      ),
                    }}>
                    {journey.coverLetter}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* No content yet */}
            {!journey.insights && !journey.coverLetter && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No content generated yet
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Generate insights and a cover letter to get started with
                    your application.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
