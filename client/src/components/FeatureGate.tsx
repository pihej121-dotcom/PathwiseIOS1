import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePurchaseFeature, useSubscribe } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Sparkles, ShoppingCart, LogIn, CheckCircle2, DollarSign, TrendingUp, Briefcase, Target, FileText, MessageSquare } from "lucide-react";
import { FEATURE_CATALOG, type FeatureKey } from "@shared/schema";

const FEATURE_DETAILS: Record<FeatureKey, {
  icon: typeof DollarSign;
  tagline: string;
  benefits: string[];
}> = {
  salary_negotiator: {
    icon: DollarSign,
    tagline: "Master the art of negotiation and maximize your earning potential",
    benefits: [
      "AI-generated negotiation scripts tailored to your situation",
      "Market salary data and compensation benchmarks",
      "Step-by-step guidance for every negotiation stage",
      "Proven tactics from industry experts"
    ]
  },
  micro_project_generator: {
    icon: Target,
    tagline: "Build portfolio projects that showcase your skills to employers",
    benefits: [
      "Personalized project ideas based on your skill gaps",
      "Detailed implementation guides and timelines",
      "Industry-relevant projects that employers value",
      "Stand out from other candidates with unique work"
    ]
  },
  career_roadmap_generator: {
    icon: TrendingUp,
    tagline: "Get a personalized career development plan from AI",
    benefits: [
      "30-day, 3-month, and 6-month actionable plans",
      "Customized to your goals and current experience",
      "Skills to learn, projects to build, and milestones to hit",
      "Track your progress and stay motivated"
    ]
  },
  job_match_assistant: {
    icon: Briefcase,
    tagline: "Discover the perfect job opportunities matched to your profile",
    benefits: [
      "AI-powered compatibility scoring for every position",
      "Smart matching based on skills, experience, and goals",
      "Tailored application materials for each opportunity",
      "Real-time alerts for new matching positions"
    ]
  },
  resume_analysis: {
    icon: FileText,
    tagline: "Get professional feedback on your resume in seconds",
    benefits: [
      "Comprehensive RMS scoring with detailed analysis",
      "Specific, actionable suggestions for improvement",
      "Industry best practices and ATS optimization",
      "Compare against successful resumes in your field"
    ]
  },
  interview_prep_assistant: {
    icon: MessageSquare,
    tagline: "Practice interviews and master your answers with AI feedback",
    benefits: [
      "Personalized questions based on the role and company",
      "Real-time feedback on your answers",
      "Common and behavioral question practice",
      "Build confidence before the real interview"
    ]
  }
};

interface FeatureAccessResponse {
  subscriptionTier: string;
  subscriptionStatus: string | null;
  hasActiveSubscription: boolean;
  purchasedFeatures: string[];
  featureAccess: Record<string, boolean>;
}

interface FeatureGateProps {
  featureKey: FeatureKey;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function FeatureGate({ featureKey, children, loadingFallback }: FeatureGateProps) {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  const purchaseFeature = usePurchaseFeature();
  const subscribe = useSubscribe();
  
  const { data: accessData, isLoading } = useQuery<FeatureAccessResponse>({
    queryKey: ["/api/user/feature-access"],
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Check if user is not authenticated
  if (!user && !authLoading) {
    const feature = FEATURE_CATALOG[featureKey];
    const details = FEATURE_DETAILS[featureKey];
    const FeatureIcon = details.icon;

    return (
      <div className="flex items-center justify-center min-h-[500px] p-4" data-testid={`feature-gate-login-${featureKey}`}>
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <FeatureIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">{feature.name}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {details.tagline}
              </p>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              {details.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="w-full h-px bg-border" />
              
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to unlock this feature and start advancing your career
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full max-w-sm"
                  size="lg"
                  data-testid="button-sign-in-gate"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Your Account
                </Button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-primary hover:underline font-medium"
                    data-testid="link-register"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return loadingFallback || (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="feature-gate-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasAccess = accessData?.featureAccess[featureKey];
  const feature = FEATURE_CATALOG[featureKey];

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show paywall/upgrade prompt
  return (
    <div className="relative min-h-[500px]">
      {/* Blurred preview of content */}
      <div className="filter blur-md pointer-events-none select-none opacity-50">
        {children}
      </div>
      
      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4" data-testid={`feature-gate-locked-${featureKey}`}>
        <Card className="max-w-2xl w-full border-2">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold" data-testid="locked-feature-title">
                {feature.name}
              </h2>
              <p className="text-muted-foreground text-lg" data-testid="locked-feature-description">
                {feature.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              {/* Option 1: Buy this feature */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-bold text-xl mb-1">Buy Once</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Single use - purchase again to use more
                    </p>
                    <div className="text-3xl font-bold text-primary mb-4">
                      ${feature.price / 100}
                    </div>
                  </div>
                  <Button
                    onClick={() => purchaseFeature.mutate(featureKey)}
                    disabled={purchaseFeature.isPending || subscribe.isPending}
                    className="w-full"
                    variant="outline"
                    size="lg"
                    data-testid={`button-buy-feature-${featureKey}`}
                  >
                    {purchaseFeature.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      "Buy This Feature"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Option 2: Subscribe to unlimited */}
              <Card className="border-2 border-primary hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-bold text-xl mb-1">Unlimited Access</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Unlimited use + all features
                    </p>
                    <div className="text-3xl font-bold text-primary mb-1">
                      $15<span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      or $120/year
                    </div>
                  </div>
                  <Button
                    onClick={() => subscribe.mutate()}
                    disabled={purchaseFeature.isPending || subscribe.isPending}
                    className="w-full"
                    size="lg"
                    data-testid="button-subscribe-unlimited"
                  >
                    {subscribe.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Start Free Trial
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                All purchases include a 30-day money-back guarantee
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
