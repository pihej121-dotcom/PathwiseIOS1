import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { FileText, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ResumeAnalysisHistoryItem {
  id: string;
  resume_id: string; // 👈 add this line
  fileName: string;
  overallInsights?: {
    strengths?: string[];
    improvements?: string[];
    summary?: string;
  };
  
  sectionAnalysis?: Record<
    string,
    {
      score?: number;
      strengths?: string[];
      gaps?: string[];
    }
  >;
  targetRole?: string;
  targetIndustry?: string;
  targetCompanies?: string[];
  createdAt: string;
}

interface ResumeAnalysisHistoryProps {
  embedded?: boolean;
  selectedResumeId?: string; // 👈 for chart-driven filtering
}

export function ResumeAnalysisHistory({
  embedded = false,
  selectedResumeId,
}: ResumeAnalysisHistoryProps) {
  const [filteredId, setFilteredId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedResumeId) setFilteredId(selectedResumeId);
  }, [selectedResumeId]);

  const { data: historyData = [], isLoading } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resume-analysis-history`);
      return response.json();
    },
  });

  const filteredData = useMemo(() => {
    if (!filteredId) return historyData;
    return historyData.filter((item) => item.resume_id === filteredId);
  }, [historyData, filteredId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!filteredData.length) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Past Resume Analyses</h3>
          <p className="text-muted-foreground max-w-md">
            Start analyzing resumes to track your growth over time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6")}>
      <div className="flex items-center gap-3 mb-4">
        <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-foreground">
          Past Resume Analyses
        </h2>
      </div>

      <div
        className={cn(
          embedded ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-8"
        )}
      >
        {filteredData.map((analysis) => (
          <Card
            key={analysis.id}
            className="border border-border/40 bg-white dark:bg-gray-900/80 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base md:text-lg font-semibold flex flex-col">
                {analysis.targetRole && (
                  <span className="text-blue-600 dark:text-blue-400">
                    {analysis.targetRole}
                  </span>
                )}
                <span className="text-muted-foreground text-sm">
                  {analysis.targetIndustry}{" "}
                  {analysis.targetCompanies?.length
                    ? `• ${analysis.targetCompanies.slice(0, 2).join(", ")}`
                    : ""}
                </span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(analysis.createdAt), "PPP")}
              </p>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Overall Insights */}
              {analysis.overallInsights && (
                <div className="space-y-3">
                  {analysis.overallInsights.strengths?.length ? (
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">
                        Strengths
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {analysis.overallInsights.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {analysis.overallInsights.improvements?.length ? (
                    <div>
                      <p className="text-sm font-medium text-yellow-600 mb-1">
                        Improvements
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {analysis.overallInsights.improvements.map((i, j) => (
                          <li key={j}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {analysis.overallInsights.summary && (
                    <p className="italic text-sm text-muted-foreground border-t border-border/20 pt-2">
                      “{analysis.overallInsights.summary}”
                    </p>
                  )}
                </div>
              )}

              {/* Section Analysis */}
              {analysis.sectionAnalysis && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600">
                    Section Insights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(analysis.sectionAnalysis).map(
                      ([section, details], idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border/30 bg-muted/30 p-3"
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                          </p>
                          {details?.score && (
                            <p className="text-xs text-muted-foreground mb-1">
                              Score: {details.score}
                            </p>
                          )}
                          {details?.strengths?.length ? (
                            <ul className="text-xs text-green-600 list-disc list-inside">
                              {details.strengths.slice(0, 2).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          ) : null}
                          {details?.gaps?.length ? (
                            <ul className="text-xs text-red-600 list-disc list-inside mt-1">
                              {details.gaps.slice(0, 2).map((g, i) => (
                                <li key={i}>{g}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

