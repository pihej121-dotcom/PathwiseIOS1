import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressRing } from "@/components/ProgressRing";
import { TourButton } from "@/components/TourButton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { FEATURE_CATALOG } from "@shared/schema";
import { 
  Send, 
  Route, 
  CheckCircle, 
  Clock, 
  Target,
  Wand2,
  FileText,
  Briefcase,
  Lightbulb,
  Brain,
  ListTodo,
  MessageSquare,
  Upload,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

// Import feature components
import ResumeUpload from "./ResumeUpload";
import ResumeAnalysis from "./ResumeAnalysis";
import CareerRoadmap from "./CareerRoadmap";
import JobAnalysis from "./JobAnalysis";
import MicroProjects from "./MicroProjects";
import { AICopilot } from "./AICopilot";
import Applications from "./Applications";
import { InterviewPrep } from "./InterviewPrep";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [failedVerification, setFailedVerification] = useState<{sessionId: string, feature: string, error: string} | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities?limit=4"],
    refetchInterval: 60000,
    staleTime: 3000,
  });

  const verifyFeaturePurchase = async (sessionId: string, feature: string) => {
    const processedKey = `purchase_verified_${sessionId}`;
    const alreadyProcessed = sessionStorage.getItem(processedKey);
    
    if (alreadyProcessed) {
      window.history.replaceState({}, "", "/dashboard");
      setFailedVerification(null);
      return true;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      sessionStorage.setItem(processedKey, 'true');

      const featureName = data.featureKey ? FEATURE_CATALOG[data.featureKey as keyof typeof FEATURE_CATALOG]?.name : FEATURE_CATALOG[feature as keyof typeof FEATURE_CATALOG]?.name;
      toast({
        title: "Purchase successful!",
        description: `You now have access to ${featureName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/feature-access"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/purchased-features"] });
      window.history.replaceState({}, "", "/dashboard");
      setFailedVerification(null);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  useEffect(() => {
    const handlePurchaseReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const purchase = params.get("purchase");
      const feature = params.get("feature");
      const type = params.get("type");
      const sessionId = params.get("session_id");

      if (purchase === "success") {
        // Only handle feature purchases here - subscriptions go through /checkout/success
        if (feature && sessionId) {
          const success = await verifyFeaturePurchase(sessionId, feature);
          if (!success) {
            setFailedVerification({ sessionId, feature, error: "Failed to verify your purchase" });
          }
        }
      } else if (purchase === "cancelled") {
        toast({
          title: "Purchase cancelled",
          description: "Your payment was cancelled. No charges were made.",
          variant: "destructive",
        });
        window.history.replaceState({}, "", "/dashboard");
      }
    };

    handlePurchaseReturn();
  }, [toast]);

  const handleRetryVerification = async () => {
    if (!failedVerification) return;
    
    setIsRetrying(true);
    const success = await verifyFeaturePurchase(failedVerification.sessionId, failedVerification.feature);
    
    if (!success) {
      toast({
        title: "Verification failed",
        description: "Still unable to verify your purchase. Please contact support for assistance.",
        variant: "destructive",
      });
    }
    setIsRetrying(false);
  };

  const handleDismissVerificationError = () => {
    window.history.replaceState({}, "", "/dashboard");
    setFailedVerification(null);
  };

  if (isLoading) {
    return (
      <Layout title={`Welcome back, ${user?.firstName}!`} subtitle="Your career command center">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const OverviewContent = () => (
    <>
      <div className="flex justify-end mb-4">
        <TourButton 
          tourId="dashboard-welcome" 
          autoStart={true}
        />
      </div>

      {failedVerification && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Purchase verification failed.</strong> Your payment was successful, but we couldn't record your purchase. Please retry.
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                onClick={handleRetryVerification} 
                disabled={isRetrying}
                size="sm"
                data-testid="button-retry-verification"
              >
                {isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Retry"}
              </Button>
              <Button 
                onClick={handleDismissVerificationError} 
                variant="outline"
                size="sm"
                data-testid="button-dismiss-verification"
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Resume Score</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100" data-testid="rms-score">
                  {(stats as any)?.rmsScore || 0}
                </p>
              </div>
              <ProgressRing progress={(stats as any)?.rmsScore || 0} size={50} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Applications</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100" data-testid="applications-count">
                  {(stats as any)?.applicationsCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Roadmap</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100" data-testid="roadmap-progress">
                  {(stats as any)?.roadmapProgress || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Route className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'upload' ? 'ring-2 ring-cyan-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('upload')} 
          data-testid="card-upload"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold mb-1">Resume Upload</h3>
            <p className="text-xs text-muted-foreground">Upload & manage</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'resume' ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('resume')} 
          data-testid="card-resume"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Resume Analysis</h3>
            <p className="text-xs text-muted-foreground">Analyze & optimize</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'roadmap' ? 'ring-2 ring-green-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('roadmap')} 
          data-testid="card-roadmap"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Route className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Roadmap</h3>
            <p className="text-xs text-muted-foreground">Career planning</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'jobs' ? 'ring-2 ring-purple-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('jobs')} 
          data-testid="card-jobs"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Job Match Assistant</h3>
            <p className="text-xs text-muted-foreground">
             Analyze. Tailor. Apply.
            </p>

          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'projects' ? 'ring-2 ring-orange-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('projects')} 
          data-testid="card-projects"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Projects</h3>
            <p className="text-xs text-muted-foreground">Build portfolio</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'copilot' ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('copilot')} 
          data-testid="card-copilot"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-1">Compensation Insights</h3>
            <p className="text-xs text-muted-foreground"> Salary negotiation coach</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'applications' ? 'ring-2 ring-pink-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('applications')} 
          data-testid="card-applications"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold mb-1">Applications</h3>
            <p className="text-xs text-muted-foreground">Track progress</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'interview' ? 'ring-2 ring-amber-500 shadow-lg' : ''}`} 
          onClick={() => setSelectedCard('interview')} 
          data-testid="card-interview"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Interview Prep</h3>
            <p className="text-xs text-muted-foreground">Practice & prepare</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(activities as any[]).slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              {(activities as any[]).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats as any)?.aiInsights?.topRecommendations ? (
                (stats as any).aiInsights.topRecommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      <Target className="inline w-4 h-4 mr-1" />
                      {rec.category}
                    </p>
                    <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {rec.priority.toUpperCase()} (+{rec.impact} pts)
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm mb-2">
                    {(stats as any)?.rmsScore >= 70 
                      ? `Excellent score! Keep applying to opportunities.`
                      : (stats as any)?.rmsScore >= 50 
                      ? `Good progress! Adding skills could boost your score.` 
                      : `Upload your resume to get personalized recommendations.`
                    }
                  </p>
                  {(stats as any)?.rmsScore === 0 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedCard('resume')}
                    >
                      Upload Resume
                    </Button>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setSelectedCard('copilot')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Ask AI Copilot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Card Content - Keep all mounted to preserve state */}
      <div className="mt-6">
        <div className={selectedCard === 'upload' ? 'block' : 'hidden'}>
          <ResumeUpload embedded={true} />
        </div>
        <div className={selectedCard === 'resume' ? 'block' : 'hidden'}>
          <ResumeAnalysis embedded={true} />
        </div>
        <div className={selectedCard === 'roadmap' ? 'block' : 'hidden'}>
          <CareerRoadmap embedded={true} />
        </div>
        <div className={selectedCard === 'jobs' ? 'block' : 'hidden'}>
          <JobAnalysis embedded={true} />
        </div>
        <div className={selectedCard === 'projects' ? 'block' : 'hidden'}>
          <MicroProjects embedded={true} />
        </div>
        <div className={selectedCard === 'copilot' ? 'block' : 'hidden'}>
          <AICopilot embedded={true} />
        </div>
        <div className={selectedCard === 'applications' ? 'block' : 'hidden'}>
          <Applications embedded={true} />
        </div>
        <div className={selectedCard === 'interview' ? 'block' : 'hidden'}>
          <InterviewPrep embedded={true} />
        </div>
      </div>
    </>
  );

  return (
    <Layout 
      title={`Welcome back, ${user?.firstName}!`} 
      subtitle="Your career command center"
    >
      <OverviewContent />
    </Layout>
  );
}
