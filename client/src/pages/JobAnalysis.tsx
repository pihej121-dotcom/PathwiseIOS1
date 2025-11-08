import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Sparkles, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FeatureGate } from "@/components/FeatureGate";

interface JobDetails {
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements?: string;
  url?: string;
}

interface JobAnalysisResult {
  overallMatch: number;
  competitivenessBand: string;
  strengths: string[];
  concerns: string[];
  skillsAnalysis: {
    strongMatches: string[];
    partialMatches: string[];
    missingSkills: string[];
    explanation: string;
  };
  experienceAnalysis: {
    relevantExperience: string[];
    experienceGaps: string[];
    explanation: string;
  };
  recommendations: string[];
  nextSteps: string[];
}

interface TailoredResumeResult {
  tailoredContent: string;
  jobSpecificScore: number;
  keywordsCovered: string[];
  remainingGaps: any[];
  diffJson: any[];
  docxBuffer?: string;
}

export default function JobAnalysis({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const [jobDetails, setJobDetails] = useState<JobDetails>(() => {
    if (embedded) {
      const saved = localStorage.getItem("jobAnalysis_jobDetails");
      if (saved) return JSON.parse(saved);
    }
    return {
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: "",
    };
  });

  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(() => {
    if (embedded) {
      try {
        const saved = localStorage.getItem("jobAnalysis_analysis");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved analysis:", e);
      }
    }
    return null;
  });

  const [tailoredResume, setTailoredResume] = useState<TailoredResumeResult | null>(() => {
    if (embedded) {
      try {
        const saved = localStorage.getItem("jobAnalysis_tailoredResume");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved tailored resume:", e);
      }
    }
    return null;
  });

  const [coverLetter, setCoverLetter] = useState<string | null>(() => {
    if (embedded) {
      try {
        const saved = localStorage.getItem("jobAnalysis_coverLetter");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved cover letter:", e);
      }
    }
    return null;
  });

  const updateJobDetails = (details: JobDetails) => {
    setJobDetails(details);
    if (embedded) {
      localStorage.setItem("jobAnalysis_jobDetails", JSON.stringify(details));
    }
  };

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/jobs/analyze-match`, {
        method: "POST",
        body: JSON.stringify({ jobData: jobDetails }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Analysis failed");
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log("Job Analysis Response:", data);
      setAnalysis(data);
      if (embedded) {
        const saved = JSON.stringify(data);
        localStorage.setItem("jobAnalysis_analysis", saved);
      }
      toast({
        title: "Analysis complete",
        description: `${data.competitivenessBand} match - ${data.overallMatch}% compatibility`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Please ensure you have an active resume uploaded",
        variant: "destructive",
      });
    },
  });

  const tailorResumeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/jobs/tailor-resume`, {
        method: "POST",
        body: JSON.stringify({ jobData: jobDetails }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Tailoring failed");
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log("Tailored Resume Response:", data);
      setTailoredResume(data);
      if (embedded) {
        localStorage.setItem("jobAnalysis_tailoredResume", JSON.stringify(data));
      }
      toast({
        title: "Resume tailored",
        description: `Job-specific score: ${data.jobSpecificScore}%`,
      });
    },
    onError: () => {
      toast({
        title: "Tailoring failed",
        description: "Please ensure you have an active resume uploaded",
        variant: "destructive",
      });
    },
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/jobs/generate-cover-letter`, {
        method: "POST",
        body: JSON.stringify({ jobData: jobDetails }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Generation failed");
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log("Cover Letter Response:", data);
      setCoverLetter(data.coverLetter);
      if (embedded) {
        localStorage.setItem("jobAnalysis_coverLetter", JSON.stringify(data.coverLetter));
      }
      toast({
        title: "Cover letter generated",
        description: "Review and customize as needed",
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Please ensure you have an active resume uploaded",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!jobDetails.title || !jobDetails.company || !jobDetails.description) {
      toast({
        title: "Missing details",
        description: "Please fill in at least title, company, and description",
        variant: "destructive",
      });
      return;
    }
    analyzeJobMutation.mutate();
  };

  const handleDownloadResume = () => {
    if (!tailoredResume?.docxBuffer) return;

    const link = document.createElement("a");
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${tailoredResume.docxBuffer}`;
    link.download = `${jobDetails.title.replace(/\s+/g, "_")}_Resume.docx`;
    link.click();
  };

  const isJobDetailsValid = jobDetails.title && jobDetails.company && jobDetails.description;

  const content = (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Enter job details to get AI-powered match analysis, resume tailoring, and cover letter generation
        </p>
      </div>

      {/* --- JOB DETAILS CARD (Tabs removed) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter job information to analyze your fit
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the job details below to analyze your match and tailor your resume.
          </p>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                data-testid="input-job-title"
                placeholder="Software Engineer"
                value={jobDetails.title}
                onChange={(e) => updateJobDetails({ ...jobDetails, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                data-testid="input-company"
                placeholder="Tech Corp"
                value={jobDetails.company}
                onChange={(e) => updateJobDetails({ ...jobDetails, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              data-testid="input-location"
              placeholder="San Francisco, CA or Remote"
              value={jobDetails.location}
              onChange={(e) => updateJobDetails({ ...jobDetails, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              data-testid="input-description"
              placeholder="Paste the full job description here..."
              value={jobDetails.description}
              onChange={(e) => updateJobDetails({ ...jobDetails, description: e.target.value })}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Qualifications (Optional)</Label>
            <Textarea
              id="requirements"
              data-testid="input-requirements"
              placeholder="Required skills, experience, education..."
              value={jobDetails.requirements}
              onChange={(e) => updateJobDetails({ ...jobDetails, requirements: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={!isJobDetailsValid || analyzeJobMutation.isPending}
              className="flex-1"
              data-testid="button-analyze"
            >
              {analyzeJobMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Analyze Match
            </Button>

            <Button
              onClick={() => tailorResumeMutation.mutate()}
              disabled={!isJobDetailsValid || tailorResumeMutation.isPending}
              variant="outline"
              className="flex-1"
              data-testid="button-tailor-resume"
            >
              {tailorResumeMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Tailor Resume
            </Button>

            <Button
              onClick={() => generateCoverLetterMutation.mutate()}
              disabled={!isJobDetailsValid || generateCoverLetterMutation.isPending}
              variant="outline"
              className="flex-1"
              data-testid="button-generate-cover-letter"
            >
              {generateCoverLetterMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generate Cover Letter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- RESULTS SECTION --- */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Match Analysis</CardTitle>
            <CardDescription>AI-powered compatibility assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Match</span>
                <Badge variant={analysis.overallMatch >= 70 ? "default" : "secondary"}>
                  {analysis.competitivenessBand}
                </Badge>
              </div>
              <Progress value={analysis.overallMatch} className="h-2" />
              <p className="text-2xl font-bold">{analysis.overallMatch}%</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm">{s}</li>
                ))}
              </ul>
            </div>

            {analysis.concerns.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Areas to Address</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.concerns.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">Skills Analysis</h3>
              <p className="text-sm text-muted-foreground">{analysis.skillsAnalysis.explanation}</p>
              {analysis.skillsAnalysis.strongMatches.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-600 mt-2">Strong Matches:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.skillsAnalysis.strongMatches.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysis.skillsAnalysis.missingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-orange-600 mt-2">Missing Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.skillsAnalysis.missingSkills.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-sm">{r}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Next Steps</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.nextSteps.map((n, i) => (
                  <li key={i} className="text-sm">{n}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {tailoredResume && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tailored Resume</CardTitle>
                <CardDescription>Optimized for this specific position</CardDescription>
              </div>
              {tailoredResume.docxBuffer && (
                <Button onClick={handleDownloadResume} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download DOCX
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Job-Specific Score</span>
                <span className="text-sm font-bold">{tailoredResume.jobSpecificScore}%</span>
              </div>
              <Progress value={tailoredResume.jobSpecificScore} className="h-2" />
            </div>

            {tailoredResume.keywordsCovered.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Keywords Covered</h3>
                <div className="flex flex-wrap gap-1">
                  {tailoredResume.keywordsCovered.map((k, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{k}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Tailored Content</h3>
              <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {tailoredResume.tailoredContent}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
            <CardDescription>Personalized for this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-6 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans">{coverLetter}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const wrappedContent = <FeatureGate featureKey="job_match_assistant">{content}</FeatureGate>;

  return embedded ? wrappedContent : <Layout>{wrappedContent}</Layout>;
}

