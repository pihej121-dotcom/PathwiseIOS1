import { useAuth } from "@/hooks/use-auth";
import { DropdownNav } from "./DropdownNav";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Achievement } from "@shared/schema";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: dashboardStats } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
    refetchInterval: 30000,
  });

  const [lastAchievementCount, setLastAchievementCount] = useState(0);

  useEffect(() => {
    if (achievements && achievements.length > lastAchievementCount) {
      const newAchievement = achievements[0]; // Most recent
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `${newAchievement.title}: ${newAchievement.description}`
      });
      setLastAchievementCount(achievements.length);
    }
  }, [achievements, lastAchievementCount, toast]);
  
  return (
    <div className="min-h-screen bg-background">
      <DropdownNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <header className="bg-card border-b border-border px-6 py-4 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-foreground"
                  data-testid="page-title"
                >
                  {title ?? `Welcome back, ${user?.firstName || "Guest"}!`}
                </h2>
                {subtitle && (
                  <p
                    className="text-muted-foreground"
                    data-testid="page-subtitle"
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* Streak Counter */}
                <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-full">
                  <span className="text-orange-500">🔥</span>
                  <span
                    className="text-sm font-medium"
                    data-testid="streak-counter"
                  >
                    {dashboardStats?.streak || 0} day streak
                  </span>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="py-6">{children}</div>
      </main>
    </div>
  );
}
