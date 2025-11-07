import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePurchaseFeature() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (featureKey: string) => {
      const response = await apiRequest("POST", `/api/stripe/purchase-feature`, { featureKey });
      const data = await response.json();
      window.location.href = data.url;
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to initiate purchase",
        variant: "destructive",
      });
    },
  });
}

export function useSubscribe() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/stripe/create-checkout-session`, {});
      const data = await response.json();
      window.location.href = data.url;
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to start subscription",
        variant: "destructive",
      });
    },
  });
}
