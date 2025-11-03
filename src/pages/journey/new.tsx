import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import AuthenticationGuard from '@/components/guards/authentication-guard';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useCreateJourney } from '@/lib/hooks/use-journey-mutations';
import { journeyFormSchema, type JourneyFormData } from '@/lib/validations/journey.schemas';
import { resumeService } from '@/lib/resume/resume.service';
import { useSession } from '@/lib/hooks/use-session';
import { toast } from 'sonner';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewJourney() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const router = useRouter();
  const { data: session } = useSession();

  const createJourneyMutation = useCreateJourney();

  const form = useForm<JourneyFormData>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      resumeFileName: '',
      resumeText: '',
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    setIsUploading(true);
    try {
      // Extract text from resume
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const { text: extractedText } = await resumeService.getText(
        buffer,
        file.type
      );

      if (extractedText.length < 100) {
        toast.error('Resume seems too short. Please check the file and try again.');
        return;
      }

      setUploadedFileName(file.name);
      setResumeText(extractedText);

      // Update form values
      form.setValue('resumeFileName', file.name);
      form.setValue('resumeText', extractedText);

      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to process resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: JourneyFormData) => {
    if (!session?.user?.id) {
      toast.error('User session not found');
      return;
    }

    try {
      const journeyData = {
        ...data,
        userId: session.user.id,
      };

      const result = await createJourneyMutation.mutateAsync(journeyData);
      router.push(`/journey/${result._id}`);
    } catch (error) {
      console.error('Failed to create journey:', error);
      toast.error('Failed to create application');
    }
  };

  const isFormValid = form.watch('companyName') &&
                     form.watch('jobTitle') &&
                     form.watch('jobDescription') &&
                     uploadedFileName &&
                     resumeText;

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Create New Application</h1>
            <p className="text-muted-foreground mt-2">
              Upload your resume and job details to get personalized insights and cover letters.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Name */}
            <div>
              <label className="block text-base font-medium text-foreground mb-3">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g., Google, Microsoft, Apple"
                className="w-full h-12 px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-base placeholder:text-[#808080] touch-manipulation"
                {...form.register('companyName')}
              />
              {form.formState.errors.companyName && (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.companyName.message}</p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-base font-medium text-foreground mb-3">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g., Senior Software Engineer, Product Manager"
                className="w-full h-12 px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-base placeholder:text-[#808080] touch-manipulation"
                {...form.register('jobTitle')}
              />
              {form.formState.errors.jobTitle && (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.jobTitle.message}</p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-base font-medium text-foreground mb-3">
                Resume
              </label>
              <div
                className="border-2 border-dashed border-[#d9d9d9] rounded-lg p-8 text-center hover:border-[#002ed4] transition-colors cursor-pointer"
                onClick={() => document.getElementById('resume-upload')?.click()}>
                <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-[#002ed4]/10 flex items-center justify-center">
                  {uploadedFileName ? (
                    <FileText className="w-6 h-6 text-[#002ed4]" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#002ed4]" />
                  )}
                </div>
                {uploadedFileName ? (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {uploadedFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to upload a different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Click to upload resume
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF or DOCX format (max 5MB)
                    </p>
                  </div>
                )}
                {isUploading && (
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#002ed4] mx-auto"></div>
                    <p className="text-xs text-muted-foreground mt-2">Processing resume...</p>
                  </div>
                )}
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFileName && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Resume processed successfully ({resumeText.length} characters)
                </p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-base font-medium text-foreground mb-3">
                Job Description
              </label>
              <textarea
                placeholder="Paste the job description here..."
                className="w-full h-40 px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-base placeholder:text-[#808080] resize-none touch-manipulation"
                {...form.register('jobDescription')}
              />
              {form.formState.errors.jobDescription && (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.jobDescription.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || createJourneyMutation.isPending || isUploading}
                className="w-full bg-[#002ed4] hover:bg-[#0020b8] text-white font-medium py-3 px-4 rounded-lg h-auto text-base">
                {createJourneyMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Application...
                  </>
                ) : (
                  'Create Application'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
