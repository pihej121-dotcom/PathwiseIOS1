import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, APIError } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUploadExtractor } from "@/components/FileUploadExtractor";
import { FileText, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import type { Resume } from "@shared/schema";

export default function ResumeUpload({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [extractorResetKey, setExtractorResetKey] = useState(0);

  const { data: resumes = [], isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: activeResume = null } = useQuery<Resume | null>({
    queryKey: ["/api/resumes/active"],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      resumeText,
      fileName,
    }: {
      resumeText: string;
      fileName: string;
    }) => {
      const res = await apiRequest("POST", "/api/resumes", {
        fileName,
        filePath: "/text-input",
        extractedText: resumeText || "", // allow empty text
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/active"] });

      toast({
        title: "Resume saved!",
        description: "Your resume has been uploaded successfully.",
      });

      setResumeText("");
      setFileName("");
      setExtractorResetKey((prev) => prev + 1);
    },
    onError: (error: any) => {
      if (error instanceof APIError && error.status === 401) {
        toast({
          title: "Session Expired",
          description: "Redirecting you to sign in...",
          variant: "destructive",
        });

        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.pathname);
          setLocation(`/login?returnTo=${returnTo}`);
        }, 2000);
      } else {
        toast({
          title: "Upload failed",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    },
  });

  /** When the extractor finishes — but saving no longer requires this */
  const handleFileTextExtracted = (text: string, extractedFileName: string) => {
    setResumeText(text || ""); // allow empty/no extracted content
    setFileName(extractedFileName);

    toast({
      title: "Resume uploaded",
      description: "Click 'Save Resume' to continue.",
    });
  };

  const handleClearFile = () => {
    setResumeText("");
    setFileName("");
  };

  /** Save button no longer requires extracted text */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only requirement now: a file must be uploaded
    if (!fileName) {
      toast({
        title: "Upload required",
        description: "Please upload a resume file before saving.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      resumeText: resumeText || "",
      fileName: fileName || "resume.txt",
    });
  };

  const loadingContent = (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-muted rounded-lg"></div>
      <div className="h-48 bg-muted rounded-lg"></div>
    </div>
  );

  if (isLoading) {
    return embedded ? (
      loadingContent
    ) : (
      <Layout title="Resume Upload" subtitle="Upload and manage your resumes">
        {loadingContent}
      </Layout>
    );
  }

  const content = (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Your Resume
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Select Your Resume File</Label>

              <FileUploadExtractor
                onTextExtracted={handleFileTextExtracted}
                onClear={handleClearFile}
                disabled={uploadMutation.isPending}
                autoExtractAndSave={true}
                resetKey={extractorResetKey}
              />

              <p className="text-xs text-muted-foreground">
                Upload a PDF or DOCX. We'll extract your content in the background.
              </p>
            </div>

            {/* No need to show extracted text */}

            <Button
              type="submit"
              className="w-full h-10"
              disabled={!fileName || uploadMutation.isPending} // ONLY requires a file
              data-testid="button-save-resume"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Resume
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Notice */}
      {uploadMutation.isSuccess && !embedded && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Resume saved!{" "}
            <Link href="/resume">
              <a className="font-medium underline inline-flex items-center gap-1 hover:text-green-900 dark:hover:text-green-100">
                Go to Resume Analysis <ArrowRight className="w-3 h-3" />
              </a>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Resume list (unchanged) */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Your Resumes
          </CardTitle>
        </CardHeader>

        <CardContent>
          {resumes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No resumes uploaded yet</p>
              <p className="text-sm mt-1">Upload your first resume above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{resume.fileName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {resume.createdAt
                        ? format(new Date(resume.createdAt), "MMM d, yyyy 'at' h:mm a")
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return embedded ? content : (
    <Layout title="Resume Upload" subtitle="Upload and manage your resumes">
      {content}
    </Layout>
  );
}

