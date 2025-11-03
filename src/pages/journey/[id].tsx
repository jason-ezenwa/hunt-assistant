import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthenticationGuard from '@/components/guards/authentication-guard';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useJourney } from '@/lib/hooks/use-journeys';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function JourneyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: journey, isLoading } = useJourney(id as string);

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const handleGenerateInsights = async () => {
    if (!journey) return;

    setIsGeneratingInsights(true);
    try {
      const response = await fetch(`/api/journeys/${journey._id}/insights`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      toast.success('Insights generated successfully');
      // Refetch the journey data
      window.location.reload();
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!journey) return;

    setIsGeneratingCoverLetter(true);
    try {
      const response = await fetch(`/api/journeys/${journey._id}/cover-letter`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      toast.success('Cover letter generated successfully');
      // Refetch the journey data
      window.location.reload();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleExportCoverLetter = async () => {
    if (!journey?.coverLetter) return;

    try {
      const response = await fetch('/api/export-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: journey.coverLetter }),
      });

      if (!response.ok) {
        throw new Error('Failed to export cover letter');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover-letter.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Cover letter exported successfully');
    } catch (error) {
      console.error('Error exporting cover letter:', error);
      toast.error('Failed to export cover letter');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'applied':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
              The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
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
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{journey.companyName}</h1>
                <p className="text-xl text-muted-foreground">{journey.jobTitle}</p>
              </div>
              <Badge className={`${getStatusColor(journey.status)} text-sm`}>
                {journey.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights || isGeneratingCoverLetter}
              variant="secondary"
              className="h-auto py-3">
              {isGeneratingInsights ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {journey.insights ? 'Regenerate Insights' : 'Generate Insights'}
                </>
              )}
            </Button>

            <Button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCoverLetter || isGeneratingInsights}
              className="h-auto py-3">
              {isGeneratingCoverLetter ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Writing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {journey.coverLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}
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
                        <em className="italic text-foreground/90">{children}</em>
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
                  <h3 className="text-lg font-medium mb-2">No content generated yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate insights and a cover letter to get started with your application.
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
