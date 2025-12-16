import { useState, useRef } from "react";
import { Geist } from "next/font/google";
import Link from "next/link";
import AppButton from "@/components/ui/app-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Loader2, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Footer from "@/components/ui/footer";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/lib/hooks/use-session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface APIResponse {
  insights?: string;
  coverLetter?: string;
  error?: string;
}

export default function Playground() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [insights, setInsights] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const generateInsightsMutation = useMutation({
    mutationFn: async ({
      resume,
      jobDescription,
    }: {
      resume: File;
      jobDescription: string;
    }) => {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/generate-insights", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      return response.json() as Promise<APIResponse>;
    },
    onSuccess: (data) => {
      if (data.insights) {
        toast.success("Insights generated successfully");
        setInsights(data.insights);
      }
    },
    onError: () => {
      toast.error("Error generating insights");
    },
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: async ({
      resume,
      jobDescription,
    }: {
      resume: File;
      jobDescription: string;
    }) => {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Failed to generate cover letter");
        throw new Error("Failed to generate cover letter");
      }

      return response.json() as Promise<APIResponse>;
    },
    onSuccess: (data) => {
      if (data.coverLetter) {
        toast.success("Cover letter generated successfully");
        setCoverLetter(data.coverLetter);
      }
    },
    onError: () => {
      toast.error("Error generating cover letter");
    },
  });

  const exportCoverLetterMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/export-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to export cover letter");
      }

      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Cover letter exported successfully");
    },
    onError: () => {
      toast.error("Error exporting cover letter");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleGenerateInsights = () => {
    if (!resumeFile || !jobDescription.trim()) return;
    setInsights("");
    generateInsightsMutation.mutate({ resume: resumeFile, jobDescription });
  };

  const handleGenerateCoverLetter = () => {
    if (!resumeFile || !jobDescription.trim()) return;
    setCoverLetter("");
    generateCoverLetterMutation.mutate({ resume: resumeFile, jobDescription });
  };

  const handleExportCoverLetter = () => {
    if (!coverLetter) return;
    exportCoverLetterMutation.mutate(coverLetter);
  };

  const isFormValid = resumeFile && jobDescription.trim();
  const isGeneratingInsights = generateInsightsMutation.isPending;
  const isGeneratingCoverLetter = generateCoverLetterMutation.isPending;
  const isExporting = exportCoverLetterMutation.isPending;

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${geistSans.variable} font-[family-name:var(--font-geist-sans)]`}>
      <div className="flex flex-col gap-6 lg:gap-8 relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <nav className="flex justify-between items-center pt-4">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Hunt Assistant
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" size="sm" className="hover:bg-secondary">
              Sign up
            </Button>
          </Link>
        </nav>

        <header className="text-center pb-8 border-b border-white/10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-foreground">
            Playground
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
            Try Hunt Assistant without signing up.
          </p>
        </header>

        <main className="flex-1">
          {/* Input Section */}
          <section className="text-center py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-6 mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-left text-card-foreground">
                      1. Upload resume
                    </h2>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 min-h-[180px] border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-colors group flex flex-col items-center justify-center">
                      <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <svg
                          className="w-6 h-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      {resumeFile ? (
                        <div>
                          <p className="text-sm font-medium text-card-foreground">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-card-foreground mb-1">
                            Click to upload resume
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF or DOCX format
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                <Card className="flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-left text-card-foreground">
                      2. Job description
                    </h2>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full flex-1 min-h-[180px] p-4 bg-background/80 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors outline-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6 lg:mb-8">
            <AppButton
              onClick={handleGenerateInsights}
              disabled={
                !isFormValid || isGeneratingInsights || isGeneratingCoverLetter
              }
              className="bg-secondary text-secondary-foreground">
              {isGeneratingInsights ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get insights"
              )}
            </AppButton>

            <AppButton
              onClick={handleGenerateCoverLetter}
              disabled={
                !isFormValid || isGeneratingCoverLetter || isGeneratingInsights
              }>
              {isGeneratingCoverLetter ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Writing...
                </>
              ) : (
                "Generate cover letter"
              )}
            </AppButton>
          </div>

          {/* Separator */}
          <div className="relative mb-6 lg:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Generated Content
              </span>
            </div>
          </div>

          {/* Results Section */}
          <section className="py-16 px-4 bg-card/30">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-6 pb-8">
                {(isGeneratingInsights || isGeneratingCoverLetter) && (
                  <Card className="animate-pulse">
                    <CardContent className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      </div>
                      <CardTitle className="text-lg font-medium mb-2 text-card-foreground">
                        Generating...
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        The AI is working its magic. This might take a moment.
                      </CardDescription>
                    </CardContent>
                  </Card>
                )}

                {insights && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center gap-3 text-card-foreground">
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-lg shadow-secondary/50"></div>
                        Job fit analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mb-4 text-card-foreground">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-semibold mb-3 text-card-foreground">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-medium mb-2 text-card-foreground">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-4 text-card-foreground/80 leading-relaxed">
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
                            <ul className="pl-4 list-disc mb-4">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="pl-4 list-decimal mb-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-card-foreground/80">
                              {children}
                            </li>
                          ),
                        }}>
                        {insights}
                      </ReactMarkdown>
                    </CardContent>
                  </Card>
                )}

                {coverLetter && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-card-foreground">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                          Cover letter
                        </CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <AppButton
                                  onClick={handleExportCoverLetter}
                                  disabled={isExporting || !session}
                                  variant="outline"
                                  size="sm"
                                  className="ml-4">
                                  {isExporting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Downloading...
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-4 h-4" />
                                      Download
                                    </>
                                  )}
                                </AppButton>
                              </div>
                            </TooltipTrigger>
                            {!session && (
                              <TooltipContent>
                                <p>Sign up to get access to this feature</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none text-card-foreground/80 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold mb-4 text-card-foreground">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold mb-3 text-card-foreground">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-medium mb-2 text-card-foreground">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-4 text-card-foreground/80 leading-relaxed">
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
                              <ul className="pl-4 list-disc mb-4">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="pl-4 list-decimal mb-4">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-card-foreground/80">
                                {children}
                              </li>
                            ),
                          }}>
                          {coverLetter}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!insights &&
                  !coverLetter &&
                  !isGeneratingInsights &&
                  !isGeneratingCoverLetter && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg font-medium mb-2 text-card-foreground">
                          No results yet
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          Generated insights and cover letters will appear here.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
