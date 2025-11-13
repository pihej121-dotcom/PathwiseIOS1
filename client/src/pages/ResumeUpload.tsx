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
import { FileText, Upload, CheckCircle, ArrowRight, Trash2, LogIn } from "lucide-react";
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
        extractedText: resumeText,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/active"] });
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been saved. Switch to Resume Analysis to analyze it.",
      });
      setResumeText("");
      setFileName("");
      setExtractorResetKey(prev => prev + 1);
    },
    onError: (error: any) => {
      console.log('Upload error:', error);
      
      // Handle session expiry specially - check if it's an APIError with 401 status
      if (error instanceof APIError && error.status === 401) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Redirecting to sign in...",
          variant: "destructive",
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.pathname);
          setLocation(`/login?returnTo=${returnTo}`);
        }, 2000);
      } else if (error instanceof Error) {
        // Handle other errors with the error message
        toast({
          title: "Upload failed",
          description: error.message || "An error occurred while saving your resume.",
          variant: "destructive",
        });
      } else {
        // Handle unexpected error types (network failures, etc.)
        toast({
          title: "Upload failed",
          description: "A network error occurred. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleFileTextExtracted = (text: string, extractedFileName: string) => {
    console.log('Text extracted:', { length: text.length, fileName: extractedFileName });
    setResumeText(text);
    setFileName(extractedFileName);
    console.log('State updated - resumeText length:', text.length);
  };

  const handleClearFile = () => {
    setResumeText("");
    setFileName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submit clicked - resumeText length:', resumeText.length);
    
    if (!resumeText.trim()) {
      console.log('Resume text is empty or whitespace only');
      toast({
        title: "Resume text required",
        description: "Please paste your resume content or upload a file.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting resume...');
    uploadMutation.mutate({
      resumeText: resumeText.trim(),
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
    return embedded ? loadingContent : (
      <Layout title="Resume Upload" subtitle="Upload and manage your resumes">
        {loadingContent}
      </Layout>
    );
  }

  const content = (
    <div className="space-y-6">
        {/* Upload Form */}
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
                <div className="space-y-2">
                  <Label>Upload Resume File (Optional)</Label>
                  <FileUploadExtractor
                    onTextExtracted={handleFileTextExtracted}
                    onClear={handleClearFile}
                    disabled={uploadMutation.isPending}
                    autoExtractAndSave={false}
                    resetKey={extractorResetKey}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a PDF or DOCX file to auto-fill the text below, or manually paste your resume.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume-text">Resume Content</Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste your resume text here or upload a file above..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={uploadMutation.isPending}
                    rows={15}
                    className="font-mono text-sm"
                    data-testid="textarea-resume-content"
                  />
                  <p className="text-xs text-muted-foreground">
                    {resumeText.length > 0 ? `${resumeText.length} characters` : 'No content yet'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-name">File Name (Optional)</Label>
                  <Input
                    id="file-name"
                    type="text"
                    placeholder="e.g., John_Doe_Resume.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    disabled={uploadMutation.isPending}
                    data-testid="input-file-name"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10"
                disabled={!resumeText.trim() || uploadMutation.isPending}
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

        {/* Success Message */}
        {uploadMutation.isSuccess && !embedded && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Resume saved successfully!{" "}
              <Link href="/resume">
                <a className="font-medium underline inline-flex items-center gap-1 hover:text-green-900 dark:hover:text-green-100">
                  Go to Resume Analysis <ArrowRight className="w-3 h-3" />
                </a>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Resume List */}
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
                    data-testid={`resume-item-${resume.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{resume.fileName}</p>
                        {activeResume?.id === resume.id && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {resume.createdAt ? format(new Date(resume.createdAt), "MMM d, yyyy 'at' h:mm a") : "Unknown date"}
                      </p>
                      {resume.targetRole && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: {resume.targetRole}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {resume.rmsScore && (
                        <Badge variant="outline" className="text-xs">
                          Score: {resume.rmsScore}
                        </Badge>
                      )}
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
