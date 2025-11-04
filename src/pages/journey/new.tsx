import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useMutation } from "@tanstack/react-query";
import AuthenticationGuard from "@/components/guards/authentication-guard";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  journeyFormSchema,
  type JourneyFormData,
} from "@/lib/validations/journey.schemas";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewJourney() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<JourneyFormData>({
    resolver: zodResolver(journeyFormSchema),
    mode: "onSubmit",
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      resumeFileName: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      form.setValue("resumeFileName", file.name);
    }
  };

  const createJourneyMutation = useMutation({
    mutationFn: async (data: JourneyFormData & { resumeFile: File }) => {
      // Create FormData like the playground
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("jobTitle", data.jobTitle);
      formData.append("jobDescription", data.jobDescription);
      formData.append("resume", data.resumeFile);

      const response = await fetch("/api/journeys", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create application");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Journey created successfully");
      router.push(`/journey/${data._id}`);
    },
    onError: (error) => {
      console.error("onError error: Failed to create journey:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: JourneyFormData) => {
    if (!resumeFile) {
      toast.error("Please upload a resume");
      return;
    }

    createJourneyMutation.mutate({
      ...data,
      resumeFile,
    });
  };

  return (
    <AuthenticationGuard>
      <DashboardLayout>
        <div>
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Start new journey</h1>
            <p className="text-muted-foreground mt-2">
              Upload your resume and job details to get personalized insights
              and cover letters.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Name and Job Title Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                  <FormItem>
                    <FormLabel className="text-base">Company name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Google, Microsoft, Apple"
                        className="w-full p-4 bg-background/80 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors outline-none"
                        {...form.register("companyName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
                  <FormItem>
                    <FormLabel className="text-base">Job title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Senior Software Engineer, Product Manager"
                        className="w-full p-4 bg-background/80 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors outline-none"
                        {...form.register("jobTitle")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>

              {/* Resume and Job Description Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resume Upload */}
                <div className="bg-card/50 backdrop-blur-lg h-full rounded-xl border border-white/20 p-6 shadow-lg flex flex-col">
                  <Label className="text-base mb-4">Resume</Label>
                  <div
                    className="flex-1 min-h-[180px] border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-colors group flex flex-col items-center justify-center"
                    onClick={() =>
                      document.getElementById("resume-upload")?.click()
                    }>
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
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Job Description */}
                <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg flex flex-col">
                  <Label className="text-base mb-4">Job description</Label>
                  <textarea
                    placeholder="Paste the job description here..."
                    className="w-full flex-1 min-h-[180px] p-4 bg-background/80 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors outline-none"
                    {...form.register("jobDescription")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createJourneyMutation.isPending}
                className="w-full h-12 text-base">
                {createJourneyMutation.isPending
                  ? "Starting journey..."
                  : "Start journey"}
              </Button>
            </form>
          </Form>
        </div>
      </DashboardLayout>
    </AuthenticationGuard>
  );
}
