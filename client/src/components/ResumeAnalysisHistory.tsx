import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  FileText,
  Calendar as CalendarIcon,
  X,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ResumeAnalysisHistoryItem {
  id: string;
  fileName: string;
  rmsScore: number;
  gaps?: Array<{
    category: string;
    priority: string;
    issue: string;
    impact: string;
    rationale: string;
    resources?: Array<{ title: string; url: string }>;
  }>;
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
}

export function ResumeAnalysisHistory({ embedded = false }: ResumeAnalysisHistoryProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedRole) params.append("targetRole", selectedRole);
    if (selectedIndustry) params.append("targetIndustry", selectedIndustry);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [selectedRole, selectedIndustry, startDate, endDate]);

  const { data: historyData = [], isLoading } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: [
      "/api/resume-analysis-history",
      selectedRole,
      selectedIndustry,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resume-analysis-history${queryString}`);
      return response.json();
    },
  });

  const { data: allHistoryData = [] } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history"],
    enabled: !embedded,
  });

  const { uniqueRoles, uniqueIndustries } = useMemo(() => {
    const roles = new Set<string>();
    const industries = new Set<string>();
    allHistoryData.forEach((item) => {
      if (item.targetRole) roles.add(item.targetRole);
      if (item.targetIndustry) industries.add(item.targetIndustry);
    });
    return {
      uniqueRoles: Array.from(roles).sort(),
      uniqueIndustries: Array.from(industries).sort(),
    };
  }, [allHistoryData]);

  const hasActiveFilters = selectedRole || selectedIndustry || startDate || endDate;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const clearFilters = () => {
    setSelectedRole("");
    setSelectedIndustry("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (isLoading) {
    return (
      <div className={cn(!embedded && "space-y-6")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const noData =
    (!historyData || historyData.length === 0) &&
    (!hasActiveFilters) &&
    (!(!embedded && allHistoryData.length > 0));

  if (noData) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Analysis History Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Start analyzing your resume to see your progress over time. Your analysis history will
            appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(!embedded && "space-y-6")}>
      {!embedded && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Target className="w-5 h-5" />
              Filter History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All industries</SelectItem>
                    {uniqueIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {historyData.length > 0 && (
        <div
          className={cn(
            embedded
              ? "grid grid-cols-1 gap-6"
              : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 p-4"
          )}
        >
          {historyData.map((analysis) => (
            <Card
              key={analysis.id}
              className="border shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/90 dark:bg-gray-900/70 backdrop-blur-md"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl font-semibold flex flex-col gap-1">
                  <span>{analysis.targetRole || "Unspecified Role"}</span>
                  <span className="text-muted-foreground text-sm">
                    {analysis.targetIndustry || "Industry"}{" "}
                    {analysis.targetCompanies?.length ? (
                      <>
                        •{" "}
                        {analysis.targetCompanies
                          .slice(0, 2)
                          .join(", ")}
                      </>
                    ) : null}
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(analysis.createdAt), "MMMM do, yyyy")}
                </p>
              </CardHeader>

              <CardContent className="space-y-5 p-6 min-h-[420px] flex flex-col justify-between">
                {(analysis.overallInsights || analysis.sectionAnalysis) ? (
                  <>
                    {/* --- Overall Insights --- */}
                    {analysis.overallInsights && (
                      <div className="space-y-4">
                        {analysis.overallInsights.strengths?.length > 0 && (
                          <div>
                            <p className="text-base font-semibold text-green-600 dark:text-green-400">
                              💪 Strengths
                            </p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {analysis.overallInsights.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.overallInsights.improvements?.length > 0 && (
                          <div>
                            <p className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
                              ⚡ Areas for Improvement
                            </p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {analysis.overallInsights.improvements.map((i, j) => (
                                <li key={j}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.overallInsights.summary && (
                          <p className="italic text-sm text-muted-foreground border-t border-muted-foreground/10 pt-3">
                            “{analysis.overallInsights.summary}”
                          </p>
                        )}
                      </div>
                    )}

                    {/* --- Section Analysis --- */}
                    {analysis.sectionAnalysis && (
                      <div className="space-y-3">
                        <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                          🧩 Section Insights
                        </p>
                        {Object.entries(analysis.sectionAnalysis).map(
                          ([section, details], idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-muted/40 rounded-lg border border-muted-foreground/10"
                            >
                              <p className="font-medium">{section}</p>
                              {details?.score && (
                                <p className="text-sm text-muted-foreground">
                                  Score: {details.score}
                                </p>
                              )}
                              {details?.strengths?.length > 0 && (
                                <ul className="list-disc list-inside text-xs text-green-600 mt-1">
                                  {details.strengths.slice(0, 2).map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              )}
                              {details?.gaps?.length > 0 && (
                                <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                                  {details.gaps.slice(0, 2).map((g, i) => (
                                    <li key={i}>{g}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No detailed insights available for this analysis.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
