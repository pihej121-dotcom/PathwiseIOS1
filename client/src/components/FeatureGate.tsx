import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePurchaseFeature, useSubscribe } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Sparkles, ShoppingCart, LogIn } from "lucide-react";
import { FEATURE_CATALOG, type FeatureKey } from "@shared/schema";

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
    return (
      <div className="flex items-center justify-center min-h-[500px] p-4" data-testid={`feature-gate-login-${featureKey}`}>
        <Card className="max-w-md w-full border-2">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Sign In to Continue</h2>
              <p className="text-muted-foreground">
                Please sign in to access {feature.name} and other powerful career tools.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
              size="lg"
              data-testid="button-sign-in-gate"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Your Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-primary hover:underline"
                data-testid="link-register"
              >
                Sign up for free
              </button>
            </p>
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
