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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUploadExtractor } from "@/components/FileUploadExtractor";
import { FileText, Upload, CheckCircle, ArrowRight, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import type { Resume } from "@shared/schema";

export default function ResumeUpload({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

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
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileTextExtracted = (text: string, extractedFileName: string) => {
    setResumeText(text);
    setFileName(extractedFileName);
    toast({
      title: "Text extracted successfully",
      description: `Extracted text from ${extractedFileName}. Fill in details and save.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      toast({
        title: "Resume text required",
        description: "Please paste your resume content or upload a file.",
        variant: "destructive",
      });
      return;
    }

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
                  <Label>Upload Resume File</Label>
                  <FileUploadExtractor
                    onTextExtracted={handleFileTextExtracted}
                    disabled={uploadMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a PDF or DOCX file to automatically extract the text
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or paste text manually
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume-text">Resume Content *</Label>
                  <Textarea
                    id="resume-text"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Copy and paste your resume content here..."
                    className="min-h-[300px] font-mono text-sm"
                    required
                    data-testid="textarea-resume-content"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the full text of your resume
                  </p>
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
