import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export type FeatureKey = 
  | "salary_negotiator"
  | "micro_project_generator" 
  | "career_roadmap_generator"
  | "job_match_assistant"
  | "resume_analysis"
  | "interview_prep_assistant";

interface FeatureAccessResponse {
  subscriptionTier: string;
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
  purchasedFeatures: string[];
  featureAccess: Record<string, boolean>;
}

export function useFeatureAccess() {
  const { user } = useAuth();

  const { data: featureAccessData } = useQuery<FeatureAccessResponse>({
    queryKey: ["/api/user/feature-access"],
    enabled: !!user,
  });

  const hasFeatureAccess = (featureKey: FeatureKey): boolean => {
    if (!featureAccessData) return false;
    
    // Check if user has active subscription (paid or institutional)
    if (featureAccessData.hasActiveSubscription) {
      return true;
    }

    // Otherwise, check if user has purchased this specific feature
    return featureAccessData.featureAccess[featureKey] || false;
  };

  const hasPurchased = (featureKey: FeatureKey): boolean => {
    if (!featureAccessData) return false;
    return featureAccessData.purchasedFeatures.includes(featureKey);
  };

  return {
    hasFeatureAccess,
    hasPurchased,
    purchasedFeatures: featureAccessData?.purchasedFeatures || [],
    hasActiveSubscription: featureAccessData?.hasActiveSubscription || false,
    isInstitutional: user?.subscriptionTier === "institutional",
  };
}
