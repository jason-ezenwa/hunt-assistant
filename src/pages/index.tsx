import { useState, useRef } from "react";
import { Geist } from "next/font/google";
import AppButton from "@/components/ui/app-button";
import { FileText, Loader2, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Footer from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface APIResponse {
  insights?: string;
  coverLetter?: string;
  error?: string;
}

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [insights, setInsights] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <div className="aurora-background"></div>
      <div className="flex flex-col gap-6 lg:gap-8 relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center pb-8 border-b border-white/10">
          <h1 className="text-5xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Hunt Assistant
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your personal AI-powered job hunting co-pilot.
          </p>
        </header>

        <main className="pt-8">
          {/* Input Section */}
          <div className="space-y-6 mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card/50 backdrop-blur-lg h-full rounded-xl border border-white/20 p-6 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold mb-4">1. Upload resume</h2>
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
                    <p className="text-sm font-medium text-foreground">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
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
            </div>

            <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold mb-4">2. Job description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full flex-1 min-h-[180px] p-4 bg-background/80 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors outline-none"
              />
            </div>
          </div>
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
                "Get Insights"
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
                "Generate Cover Letter"
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

          <div className="space-y-6 pb-8">
            {(isGeneratingInsights || isGeneratingCoverLetter) && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg animate-pulse">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Generating...</h3>
                  <p className="text-muted-foreground text-sm">
                    The AI is working its magic. This might take a moment.
                  </p>
                </div>
              </div>
            )}

            {insights && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-lg shadow-secondary/50"></div>
                  Job fit analysis
                </h3>
                <div
                  className="markdown max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: insights }}
                />
              </div>
            )}

            {coverLetter && (
              <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                    Cover letter
                  </h3>
                  <AppButton
                    onClick={handleExportCoverLetter}
                    disabled={isExporting}
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
                <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {coverLetter}
                </div>
              </div>
            )}

            {!insights &&
              !coverLetter &&
              !isGeneratingInsights &&
              !isGeneratingCoverLetter && (
                <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No results yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Generated insights and cover letters will appear here.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
