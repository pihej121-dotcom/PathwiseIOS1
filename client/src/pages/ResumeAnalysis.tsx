import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressRing } from "@/components/ProgressRing";
import { PaywallOverlay } from "@/components/PaywallOverlay";
import { TourButton } from "@/components/TourButton";
import { apiRequest, queryClient as globalQueryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Book,
  Award,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Hash,
  Upload,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { ResumeHistoryChart } from "@/components/ResumeHistoryChart";
import { ResumeAnalysisHistory } from "@/components/ResumeAnalysisHistory";
import type { Resume } from "@shared/schema";

export default function ResumeAnalysis({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>();
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [targetCompanies, setTargetCompanies] = useState("");

  // Check if user has free tier
  const isFreeUser = user?.subscriptionTier === "free";

  // Handle upgrade to Pro
  const handleUpgrade = async () => {
    try {
      const response = await apiRequest("POST", "/api/stripe/create-checkout-session", {});
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const { data: resumes = [], isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: activeResume = null } = useQuery<Resume | null>({
    queryKey: ["/api/resumes/active"],
  });

  const reanalyzeMutation = useMutation({
    mutationFn: async ({
      resumeId,
      targetRole,
      targetIndustry,
      targetCompanies,
    }: {
      resumeId: string;
      targetRole: string;
      targetIndustry?: string;
      targetCompanies?: string;
    }) => {
      const res = await apiRequest("POST", `/api/resumes/${resumeId}/analyze`, {
        targetRole,
        targetIndustry,
        targetCompanies,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resume-analysis-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Analysis Updated!",
        description: "Your resume has been re-analyzed with the new target criteria.",
      });
      setShowTargetForm(false);
      setTargetRole("");
      setTargetIndustry("");
      setTargetCompanies("");
    },
    onError: (error: any) => {
      toast({
        title: "Re-analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReanalyze = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeResume) {
      toast({
        title: "No resume found",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      return;
    }

    if (!targetRole.trim()) {
      toast({
        title: "Target role required",
        description: "Please enter a target role to re-analyze your resume.",
        variant: "destructive",
      });
      return;
    }

    reanalyzeMutation.mutate({
      resumeId: activeResume.id,
      targetRole: targetRole.trim(),
      targetIndustry: targetIndustry.trim() || undefined,
      targetCompanies: targetCompanies.trim() || undefined,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const loadingContent = (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-muted rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return embedded ? loadingContent : (
      <Layout title="Resume Analysis" subtitle="AI-powered resume insights and recommendations">
        {loadingContent}
      </Layout>
    );
  }

  const content = (
    <>
      <div className="flex justify-end mb-4">
        <TourButton 
          tourId="resume-analysis"
        />
      </div>
      <div className="space-y-6">
        {/* No Resume Message */}
        {!activeResume && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <Upload className="h-4 h-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              No resume uploaded yet.{" "}
              <Link href="/resume-upload">
                <a className="font-medium underline hover:text-blue-900 dark:hover:text-blue-100" data-testid="link-upload-resume">
                  Upload your resume
                </a>
              </Link>
              {" "}to see AI-powered insights and analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Target Analysis Form */}
        {activeResume && (
          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Generate Analysis for Target Role
                </div>
                {!showTargetForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowTargetForm(true);
                      setTargetRole((activeResume as any)?.targetRole || "");
                      setTargetIndustry((activeResume as any)?.targetIndustry || "");
                      setTargetCompanies((activeResume as any)?.targetCompanies || "");
                    }}
                    data-testid="button-show-target-form"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update Target Criteria
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            {showTargetForm && (
              <CardContent>
                <form onSubmit={handleReanalyze} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-role">Target Role *</Label>
                      <Input
                        id="target-role"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        required
                        data-testid="input-target-role"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-industry">Target Field/Industry</Label>
                      <Input
                        id="target-industry"
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        placeholder="e.g., Technology, Finance"
                        data-testid="input-target-industry"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-companies">Target Companies</Label>
                      <Input
                        id="target-companies"
                        value={targetCompanies}
                        onChange={(e) => setTargetCompanies(e.target.value)}
                        placeholder="e.g., Google, Amazon, Meta"
                        data-testid="input-target-companies"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!targetRole.trim() || reanalyzeMutation.isPending}
                      data-testid="button-reanalyze"
                    >
                      {reanalyzeMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Analysis
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTargetForm(false);
                        setTargetRole("");
                        setTargetIndustry("");
                        setTargetCompanies("");
                      }}
                      data-testid="button-cancel-target-form"
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your target career role, field, and companies to get a personalized analysis of how well your resume matches.
                  </p>
                </form>
              </CardContent>
            )}
          </Card>
        )}

        {/* Active Resume Analysis */}
        {activeResume && (
          <>
            {/* Overall Score */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-semibold" data-testid="overall-score">
                      {(activeResume as any)?.rmsScore || 0}
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">Overall Match Score</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {(activeResume as any)?.createdAt ? format(new Date((activeResume as any).createdAt), "MMM d, yyyy") : 'Unknown'}
                    </p>
                  </div>
                  <ProgressRing progress={(activeResume as any)?.rmsScore || 0} size={64} />
                </div>
              </CardContent>
            </Card>

            {/* Target Analysis Context */}
            {((activeResume as any)?.targetRole || (activeResume as any)?.targetIndustry || (activeResume as any)?.targetCompanies) && (
              <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Analysis Target Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(activeResume as any)?.targetRole && (
                      <div className="space-y-1" data-testid="target-role-display">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Role</p>
                        <p className="text-sm font-medium">{(activeResume as any).targetRole}</p>
                      </div>
                    )}
                    {(activeResume as any)?.targetIndustry && (
                      <div className="space-y-1" data-testid="target-industry-display">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Industry</p>
                        <p className="text-sm font-medium">{(activeResume as any).targetIndustry}</p>
                      </div>
                    )}
                    {(activeResume as any)?.targetCompanies && (
                      <div className="space-y-1" data-testid="target-companies-display">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Companies</p>
                        <p className="text-sm font-medium">{(activeResume as any).targetCompanies}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Your resume was analyzed against these target criteria to provide personalized insights.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Category Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card 
                className={`cursor-pointer border-none shadow-sm hover:shadow-md transition-all ${selectedSection === 'skills' ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
                onClick={() => setSelectedSection(selectedSection === 'skills' ? null : 'skills')}
                data-testid="card-skills"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Skills</p>
                      <p className={`text-xl sm:text-2xl font-semibold ${getScoreColor((activeResume as any)?.skillsScore || 0)}`}>
                        {(activeResume as any)?.skillsScore || 0}
                      </p>
                    </div>
                    <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getScoreBgColor((activeResume as any)?.skillsScore || 0)}`}>
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <Progress value={(activeResume as any)?.skillsScore || 0} className="h-1.5" />
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer border-none shadow-sm hover:shadow-md transition-all ${selectedSection === 'experience' ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
                onClick={() => setSelectedSection(selectedSection === 'experience' ? null : 'experience')}
                data-testid="card-experience"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Experience</p>
                      <p className={`text-xl sm:text-2xl font-semibold ${getScoreColor((activeResume as any)?.experienceScore || 0)}`}>
                        {(activeResume as any)?.experienceScore || 0}
                      </p>
                    </div>
                    <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getScoreBgColor((activeResume as any)?.experienceScore || 0)}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <Progress value={(activeResume as any)?.experienceScore || 0} className="h-1.5" />
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer border-none shadow-sm hover:shadow-md transition-all ${selectedSection === 'education' ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
                onClick={() => setSelectedSection(selectedSection === 'education' ? null : 'education')}
                data-testid="card-education"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Education</p>
                      <p className={`text-xl sm:text-2xl font-semibold ${getScoreColor((activeResume as any)?.educationScore || 0)}`}>
                        {(activeResume as any)?.educationScore || 0}
                      </p>
                    </div>
                    <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getScoreBgColor((activeResume as any)?.educationScore || 0)}`}>
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <Progress value={(activeResume as any)?.educationScore || 0} className="h-1.5" />
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer border-none shadow-sm hover:shadow-md transition-all ${selectedSection === 'keywords' ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
                onClick={() => setSelectedSection(selectedSection === 'keywords' ? null : 'keywords')}
                data-testid="card-keywords"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Keywords</p>
                      <p className={`text-xl sm:text-2xl font-semibold ${getScoreColor((activeResume as any)?.keywordsScore || 0)}`}>
                        {(activeResume as any)?.keywordsScore || 0}
                      </p>
                    </div>
                    <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getScoreBgColor((activeResume as any)?.keywordsScore || 0)}`}>
                      <Hash className="w-4 h-4" />
                    </div>
                  </div>
                  <Progress value={(activeResume as any)?.keywordsScore || 0} className="h-1.5" />
                </CardContent>
              </Card>
            </div>

            {/* Section Details */}
            {selectedSection && (activeResume as any)?.sectionAnalysis?.[selectedSection] && (
              <PaywallOverlay featureKey="resume_analysis">
                <Card className="mt-6 border-none shadow-sm" data-testid="section-details">
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2 capitalize">
                      {selectedSection === 'skills' && <Target className="w-4 h-4" />}
                      {selectedSection === 'experience' && <Briefcase className="w-4 h-4" />}
                      {selectedSection === 'education' && <GraduationCap className="w-4 h-4" />}
                      {selectedSection === 'keywords' && <Hash className="w-4 h-4" />}
                      {selectedSection} Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Analysis</p>
                      <p className="text-base" data-testid="section-explanation">
                        {(activeResume as any).sectionAnalysis[selectedSection].explanation}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Strengths</h4>
                        </div>
                        <ul className="space-y-2" data-testid="section-strengths">
                          {(activeResume as any).sectionAnalysis[selectedSection].strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <h4 className="font-semibold">Gaps</h4>
                        </div>
                        <ul className="space-y-2" data-testid="section-gaps">
                          {(activeResume as any).sectionAnalysis[selectedSection].gaps.map((gap: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold">How to Improve</h4>
                      </div>
                      <ul className="space-y-2" data-testid="section-improvements">
                        {(activeResume as any).sectionAnalysis[selectedSection].improvements.map((improvement: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">→</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </PaywallOverlay>
            )}

            {/* Improvement Recommendations */}
            {(activeResume as any)?.gaps && Array.isArray((activeResume as any)?.gaps) && (activeResume as any)?.gaps.length > 0 && (
              <PaywallOverlay featureKey="resume_analysis">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Improvement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {((activeResume as any)?.gaps || []).map((gap: any, index: number) => (
                        <div 
                          key={index}
                          className="p-4 border border-border rounded-lg"
                          data-testid={`gap-${index}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={getPriorityColor(gap.priority)}>
                                  {gap.priority.toUpperCase()}
                                </Badge>
                                <span className="font-medium">{gap.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {gap.rationale}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-green-600">
                                +{gap.impact} points
                              </span>
                            </div>
                          </div>

                          {gap.resources && gap.resources.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Recommended Resources:</p>
                              <div className="space-y-2">
                                {gap.resources.map((resource: any, resIndex: number) => (
                                  <div 
                                    key={resIndex}
                                    className="flex items-center justify-between p-2 bg-muted/30 rounded"
                                  >
                                    <div>
                                      <p className="text-sm font-medium">{resource.title}</p>
                                      <p className="text-xs text-muted-foreground">{resource.provider}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {resource.cost && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                          {resource.cost}
                                        </span>
                                      )}
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => window.open(resource.url, '_blank')}
                                        data-testid={`resource-link-${index}-${resIndex}`}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </PaywallOverlay>
            )}

          </>
        )}

        {/* Resume History */}
        {(resumes as any[]) && (resumes as any[]).length > 0 && (
          <ResumeHistoryChart 
            resumes={resumes as any[]}
            activeResumeId={(activeResume as any)?.id}
            onSelectResume={(id) => setSelectedResumeId(id)} // 👈 Add this line
          />
        )}

        {/* Resume Analysis History */}
        <div className="mt-8">
          <ResumeAnalysisHistory 
            embedded={true}
            selectedResumeId={selectedResumeId} // 👈 Add this line
          />
        </div>
      </div>
    </>
  );

  return embedded ? content : (
    <Layout title="Resume Analysis" subtitle="AI-powered resume insights and recommendations">
      {content}
    </Layout>
  );
}
