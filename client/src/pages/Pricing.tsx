import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Sparkles, Lock, Crown } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FEATURE_CATALOG, SUBSCRIPTION_PRODUCT } from "@shared/schema";

interface FeatureAccessResponse {
  subscriptionTier: string;
  subscriptionStatus: string | null;
  hasActiveSubscription: boolean;
  purchasedFeatures: string[];
  featureAccess: Record<string, boolean>;
}

export default function Pricing() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Get feature access status
  const { data: accessData, isLoading } = useQuery<FeatureAccessResponse>({
    queryKey: ["/api/user/feature-access"],
  });

  // Check for success/cancelled query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get("purchase");
    const feature = params.get("feature");

    if (purchase === "success" && feature) {
      toast({
        title: "Purchase successful!",
        description: `You now have access to ${FEATURE_CATALOG[feature as keyof typeof FEATURE_CATALOG]?.name}`,
      });
      // Clear the query params
      window.history.replaceState({}, "", "/pricing");
      queryClient.invalidateQueries({ queryKey: ["/api/user/feature-access"] });
    } else if (purchase === "cancelled") {
      toast({
        title: "Purchase cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive",
      });
      // Clear the query params
      window.history.replaceState({}, "", "/pricing");
    }
  }, [toast]);

  // Purchase feature mutation
  const purchaseFeature = useMutation({
    mutationFn: async (featureKey: string) => {
      const response = await apiRequest("POST", `/api/stripe/purchase-feature`, { featureKey });
      return response;
    },
    onSuccess: (data: { url: string }) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to initiate purchase",
        variant: "destructive",
      });
      setIsProcessing(null);
    },
  });

  // Subscribe mutation
  const subscribe = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/stripe/create-checkout-session`, {});
      return response;
    },
    onSuccess: (data: { url: string }) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to start subscription",
        variant: "destructive",
      });
      setIsProcessing(null);
    },
  });

  const handlePurchase = (featureKey: string) => {
    setIsProcessing(featureKey);
    purchaseFeature.mutate(featureKey);
  };

  const handleSubscribe = () => {
    setIsProcessing("subscription");
    subscribe.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4" data-testid="pricing-loading">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = accessData?.hasActiveSubscription || false;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl" data-testid="pricing-page">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="pricing-title">
          Flexible Pricing for Your Career Growth
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="pricing-subtitle">
          Choose individual features as you need them, or unlock everything with Pathwise Unlimited
        </p>
      </div>

      {/* Subscription Card - Prominent */}
      {!hasActiveSubscription && (
        <Card className="mb-12 border-2 border-primary shadow-lg" data-testid="subscription-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl" data-testid="subscription-title">
                    {SUBSCRIPTION_PRODUCT.name}
                  </CardTitle>
                  <Badge variant="default" className="ml-2" data-testid="badge-best-value">
                    Best Value
                  </Badge>
                </div>
                <CardDescription className="text-base" data-testid="subscription-description">
                  {SUBSCRIPTION_PRODUCT.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" data-testid="subscription-price">
                  ${SUBSCRIPTION_PRODUCT.monthlyPrice / 100}
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground" data-testid="subscription-yearly">
                  or ${SUBSCRIPTION_PRODUCT.yearlyPrice / 100}/year
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited access to all AI tools</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Beta access to new features</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Priority support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing !== null}
              className="w-full"
              size="lg"
              data-testid="button-subscribe"
            >
              {isProcessing === "subscription" ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start 14-Day Free Trial
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {hasActiveSubscription && (
        <Card className="mb-12 border-2 border-green-500 shadow-lg" data-testid="subscription-active-card">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-500/5">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl" data-testid="subscription-active-title">
                You have Pathwise Unlimited
              </CardTitle>
              <Badge variant="default" className="ml-2 bg-green-600" data-testid="badge-active">
                Active
              </Badge>
            </div>
            <CardDescription data-testid="subscription-active-description">
              You have unlimited access to all features below
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Individual Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6" data-testid="features-title">
          Individual Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(FEATURE_CATALOG).map(([key, feature]) => {
            const hasAccess = accessData?.featureAccess[key] || false;
            const isPurchased = accessData?.purchasedFeatures.includes(key) || false;

            return (
              <Card key={key} className={hasAccess ? "border-green-500" : ""} data-testid={`feature-card-${key}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg" data-testid={`feature-title-${key}`}>
                      {feature.name}
                    </CardTitle>
                    {hasAccess && (
                      <Badge variant="default" className="bg-green-600" data-testid={`badge-unlocked-${key}`}>
                        <Check className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <CardDescription data-testid={`feature-description-${key}`}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3">
                  <div className="text-2xl font-bold w-full" data-testid={`feature-price-${key}`}>
                    ${feature.price / 100}
                    <span className="text-sm text-muted-foreground"> one-time</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(key)}
                    disabled={hasAccess || isProcessing !== null}
                    className="w-full"
                    variant={hasAccess ? "outline" : "default"}
                    data-testid={`button-purchase-${key}`}
                  >
                    {hasAccess ? (
                      isPurchased ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Purchased
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Included in Subscription
                        </>
                      )
                    ) : isProcessing === key ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Purchase
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      {!hasActiveSubscription && (
        <Card className="bg-muted" data-testid="footer-cta">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-bold mb-2" data-testid="footer-cta-title">
              Not sure which to choose?
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="footer-cta-description">
              Start with a free account and purchase features as you need them. You can always upgrade to unlimited access later.
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="outline" data-testid="button-go-dashboard">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
