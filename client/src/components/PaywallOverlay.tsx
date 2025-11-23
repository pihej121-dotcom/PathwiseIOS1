import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePurchaseFeature, useSubscribe } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, ShoppingCart, LogIn } from "lucide-react";
import { FEATURE_CATALOG, type FeatureKey } from "@shared/schema";

interface FeatureAccessResponse {
  subscriptionTier: string;
  subscriptionStatus: string | null;
  hasActiveSubscription: boolean;
  purchasedFeatures: string[];
  featureAccess: Record<string, boolean>;
}

interface PaywallOverlayProps {
  children: React.ReactNode;
  showPaywall?: boolean; // Legacy prop for backwards compatibility
  onUpgrade?: () => void; // Legacy prop for backwards compatibility
  featureKey: FeatureKey; // New prop for hybrid pricing
}

export function PaywallOverlay({ children, showPaywall, onUpgrade, featureKey }: PaywallOverlayProps) {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  const purchaseFeature = usePurchaseFeature();
  const subscribe = useSubscribe();
  
  const { data: accessData, isLoading, error } = useQuery<FeatureAccessResponse>({
    queryKey: ["/api/user/feature-access"],
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Check if user is not authenticated
  if (!user && !authLoading) {
    // Show login prompt instead of the feature
    const feature = FEATURE_CATALOG[featureKey];
    return (
      <div className="relative">
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2">
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
                  <LogIn className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sign In Required</h3>
                <p className="text-sm text-muted-foreground">
                  Please sign in to access {feature.name} and other premium features.
                </p>
              </div>
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
                data-testid="button-sign-in"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || authLoading) {
    return <div className="animate-pulse">{children}</div>;
  }

  // Check if user has access via subscription OR individual purchase
  const hasAccess = accessData?.featureAccess[featureKey];
  const feature = FEATURE_CATALOG[featureKey];

  // Show content if user has access
  if (hasAccess || !featureKey) {
    return <>{children}</>;
  }

  // Legacy fallback - if showPaywall is explicitly false, show content
  if (showPaywall === false) {
    return <>{children}</>;
  }

  // Show paywall/upgrade overlay
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Upgrade overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2">
          <CardContent className="pt-6 pb-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold" data-testid="locked-feature-title">
                Unlock {feature.name}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="locked-feature-description">
                {feature.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Option 1: Buy this feature */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="text-center">
                    <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <h4 className="font-bold text-lg mb-1">Buy Once</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Single use - purchase again to use more
                    </p>
                    <div className="text-2xl font-bold text-primary mb-3">
                      ${feature.price / 100}
                    </div>
                  </div>
                  <Button
                    onClick={() => purchaseFeature.mutate(featureKey)}
                    disabled={purchaseFeature.isPending || subscribe.isPending}
                    className="w-full"
                    variant="outline"
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
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <h4 className="font-bold text-lg mb-1 flex items-center justify-center gap-2">
                      Unlimited Access
                      <Badge className="bg-orange-600 hover:bg-orange-700 text-xs">BLACK FRIDAY</Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Unlimited use + all features
                    </p>
                    <div className="text-2xl font-bold text-primary mb-1">
                      $4.99<span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-through mb-2">
                      Regular price: $15/mo
                    </div>
                  </div>
                  <Button
                    onClick={() => subscribe.mutate()}
                    disabled={purchaseFeature.isPending || subscribe.isPending}
                    className="w-full"
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
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
