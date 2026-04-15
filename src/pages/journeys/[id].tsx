import React from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { getStatusColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  FileText,
  CheckCircle,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JourneyDetail() {
  const router = useRouter();

  const { id } = router.query;

  const { data: journey, isLoading } = useJourney(id as string);
  const queryClient = useQueryClient();
  const updateJourneyMutation = useUpdateJourney();
  const deleteJourneyMutation = useDeleteJourney();

  const [downloadingResume, setDownloadingResume] = React.useState(false);
  const [downloadingCoverLetter, setDownloadingCoverLetter] = React.useState(false);
  const [resumeExpanded, setResumeExpanded] = React.useState(true);
  const [insightsExpanded, setInsightsExpanded] = React.useState(true);
  const [coverLetterExpanded, setCoverLetterExpanded] = React.useState(true);

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

  const generateTailoredResumeMutation = useMutation({
    mutationFn: async (journeyId: string) => {
      const response = await fetch(
        `/api/journeys/${journeyId}/tailored-resume`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate tailored resume");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Tailored resume generated successfully");
      queryClient.invalidateQueries({ queryKey: ["journey", journey?._id] });
    },
    onError: (error) => {
      console.error("Error generating tailored resume:", error);
      toast.error("Failed to generate tailored resume");
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

  const handleGenerateTailoredResume = () => {
    if (!journey) return;
    generateTailoredResumeMutation.mutate(journey._id);
  };

  const handleDownloadResume = async () => {
    if (!journey?.tailoredResume) return;

    setDownloadingResume(true);
    try {
      const response = await fetch(
        `/api/journeys/${journey._id}/export-resume`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to download tailored resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-resume.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Tailored resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading tailored resume:", error);
      toast.error("Failed to download tailored resume");
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleExportCoverLetter = async () => {
    if (!journey?.coverLetter) return;

    setDownloadingCoverLetter(true);
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
      toast.success("Cover letter downloaded successfully");
    } catch (error) {
      console.error("Error exporting cover letter:", error);
      toast.error("Failed to export cover letter");
    } finally {
      setDownloadingCoverLetter(false);
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

  const handleConfirmDelete = () => {
    if (!journey) return;
    deleteJourneyMutation.mutate(journey._id, {
      onSuccess: () => {
        toast.success("Journey deleted successfully");
        router.push("/journeys");
      },
      onError: (error) => {
        console.error("Error deleting journey:", error);
        toast.error("Failed to delete journey");
      },
    });
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

            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
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
                      generateTailoredResumeMutation.isPending ||
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
                <Dialog>
                  <DialogTrigger asChild>
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
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        Delete journey
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the journey for{" "}
                        <span className="font-medium">
                          {journey.companyName}
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
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                generateTailoredResumeMutation.isPending ||
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
                generateTailoredResumeMutation.isPending ||
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

            <Button
              onClick={handleGenerateTailoredResume}
              disabled={
                generateTailoredResumeMutation.isPending ||
                generateCoverLetterMutation.isPending ||
                generateInsightsMutation.isPending ||
                updateJourneyMutation.isPending ||
                deleteJourneyMutation.isPending
              }
              variant="outline"
              className="h-auto py-3 sm:col-span-2">
              {generateTailoredResumeMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {journey.tailoredResume
                    ? "Regenerate tailored resume"
                    : "Generate tailored resume"}
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Tailored Resume */}
            {journey.tailoredResume && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-xl font-semibold flex items-center gap-2 text-card-foreground">
                      <div className="w-2.5 h-2.5 shrink-0 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
                      Tailored resume
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={handleDownloadResume}
                        disabled={downloadingResume}
                        variant="outline"
                        size="sm"
                        className="hover:bg-secondary">
                        {downloadingResume ? (
                          <>
                            <RefreshCw className="w-4 h-4 sm:mr-2 animate-spin" />
                            <span className="hidden sm:inline">Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
                          </>
                        )}
                      </Button>
                      <button
                        onClick={() => setResumeExpanded((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        {resumeExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                {resumeExpanded && (
                  <CardContent>
                    <div className="max-w-none text-sm text-card-foreground leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-base font-bold mb-1 text-card-foreground">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-sm font-bold mt-4 mb-1 text-card-foreground uppercase tracking-wide">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mb-0.5 text-card-foreground">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 text-card-foreground/80 leading-relaxed">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-card-foreground">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-card-foreground/90">
                              {children}
                            </em>
                          ),
                          ul: ({ children }) => (
                            <ul className="pl-4 list-disc mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="pl-4 list-decimal mb-2">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-card-foreground/80 mb-0.5">
                              {children}
                            </li>
                          ),
                        }}>
                        {journey.tailoredResume}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Insights */}
            {journey.insights && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-xl font-semibold flex items-center gap-2 text-card-foreground">
                      <div className="w-2.5 h-2.5 shrink-0 bg-secondary rounded-full shadow-lg shadow-secondary/50"></div>
                      Job fit analysis
                    </CardTitle>
                    <button
                      onClick={() => setInsightsExpanded((v) => !v)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {insightsExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                {insightsExpanded && (
                <CardContent>
                  <div className="prose prose-sm max-w-none text-card-foreground/80 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg sm:text-2xl font-bold mb-3 text-card-foreground">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base sm:text-xl font-semibold mb-2 text-card-foreground">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm sm:text-lg font-medium mb-2 text-card-foreground">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 text-sm text-card-foreground/80 leading-relaxed">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-card-foreground">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-card-foreground/90">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="pl-4 list-disc mb-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="pl-4 list-decimal mb-4">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm text-card-foreground/80 mb-1">{children}</li>
                        ),
                      }}>
                      {journey.insights}
                    </ReactMarkdown>
                  </div>
                </CardContent>
                )}
              </Card>
            )}

            {/* Cover Letter */}
            {journey.coverLetter && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-xl font-semibold flex items-center gap-2 text-card-foreground">
                      <div className="w-2.5 h-2.5 shrink-0 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                      Cover letter
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={handleExportCoverLetter}
                        disabled={downloadingCoverLetter}
                        variant="outline"
                        size="sm"
                        className="hover:bg-secondary">
                        {downloadingCoverLetter ? (
                          <>
                            <RefreshCw className="w-4 h-4 sm:mr-2 animate-spin" />
                            <span className="hidden sm:inline">Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
                          </>
                        )}
                      </Button>
                      <button
                        onClick={() => setCoverLetterExpanded((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        {coverLetterExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                {coverLetterExpanded && (
                <CardContent>
                  <div className="max-w-none text-sm text-card-foreground leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold mb-3 text-card-foreground">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-semibold mb-2 text-card-foreground">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-medium mb-1 text-card-foreground">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 text-card-foreground/80 leading-relaxed">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-card-foreground">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-card-foreground/90">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="pl-4 list-disc mb-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="pl-4 list-decimal mb-4">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-card-foreground/80 mb-1">{children}</li>
                        ),
                      }}>
                      {journey.coverLetter}
                    </ReactMarkdown>
                  </div>
                </CardContent>
                )}
              </Card>
            )}

            {/* No content yet */}
            {!journey.insights && !journey.coverLetter && !journey.tailoredResume && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-medium mb-2 text-card-foreground">
                    No content generated yet
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Generate insights and a cover letter to get started with
                    your application.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
