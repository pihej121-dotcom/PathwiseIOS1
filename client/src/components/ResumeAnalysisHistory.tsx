import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  FileText,
  History,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ResumeAnalysisHistoryItem {
  id: string;
  resume_id: string;
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
  selectedResumeId?: string;
}

export function ResumeAnalysisHistory({
  embedded = false,
  selectedResumeId,
}: ResumeAnalysisHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filteredId, setFilteredId] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState<string | "all">("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string | "all">("all");

  useEffect(() => {
    if (selectedResumeId) {
      setFilteredId(selectedResumeId);
      setExpandedId(selectedResumeId);
    }
  }, [selectedResumeId]);

  const { data: historyData = [], isLoading } = useQuery<
    ResumeAnalysisHistoryItem[]
  >({
    queryKey: ["/api/resume-analysis-history"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resume-analysis-history`);
      return response.json();
    },
  });

  // --- Extract unique filters from data ---
  const availableRoles = useMemo(() => {
    const roles = historyData
      .map((h) => h.targetRole)
      .filter(Boolean) as string[];
    return Array.from(new Set(roles));
  }, [historyData]);

  const availableIndustries = useMemo(() => {
    const industries = historyData
      .map((h) => h.targetIndustry)
      .filter(Boolean) as string[];
    return Array.from(new Set(industries));
  }, [historyData]);

  // --- Apply filtering logic ---
  const filteredData = useMemo(() => {
    let data = historyData;
    if (filteredId) data = data.filter((item) => item.resume_id === filteredId);
    if (selectedRole !== "all")
      data = data.filter((item) => item.targetRole === selectedRole);
    if (selectedIndustry !== "all")
      data = data.filter((item) => item.targetIndustry === selectedIndustry);
    return data;
  }, [historyData, filteredId, selectedRole, selectedIndustry]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  // --- Empty state ---
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

  // --- Main render ---
  return (
    <div className={cn("space-y-6")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Past Resume Analyses
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">
              Filter by:
            </span>
          </div>

          {/* Role Filter */}
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Industry Filter */}
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {availableIndustries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards */}
      <div
        className={cn(
          embedded
            ? "grid grid-cols-1 gap-6"
            : "grid grid-cols-1 md:grid-cols-2 gap-8"
        )}
      >
        {filteredData.map((analysis) => {
          const isExpanded = expandedId === analysis.id;
          return (
            <Card
              key={analysis.id}
              onClick={() => toggleExpand(analysis.id)}
              className={cn(
                "cursor-pointer border border-border/40 bg-white dark:bg-gray-900/80 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300",
                isExpanded && "ring-2 ring-blue-500/40"
              )}
            >
              <CardHeader className="pb-3 border-b border-border/20">
                <div className="flex justify-between items-center">
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
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(analysis.createdAt), "PPP")}
                </p>
              </CardHeader>

              {/* Expandable Content */}
              <div
                className={cn(
                  "transition-all overflow-hidden duration-500 ease-in-out",
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="p-5 space-y-6">
                  {/* Overall Insights */}
                  {analysis.overallInsights && (
                    <div className="space-y-4">
                      {/* Strengths */}
                      {analysis.overallInsights.strengths?.length ? (
                        <div>
                          <p className="text-sm font-semibold text-green-600 mb-1">
                            Strengths
                          </p>
                          <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                            {analysis.overallInsights.strengths.map((s, i) => (
                              <li
                                key={i}
                                className="pl-1 text-green-700 dark:text-green-400"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {/* Improvements */}
                      {analysis.overallInsights.improvements?.length ? (
                        <div>
                          <p className="text-sm font-semibold text-yellow-600 mb-1">
                            Gaps
                          </p>
                          <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                            {analysis.overallInsights.improvements.map((i, j) => (
                              <li
                                key={j}
                                className="pl-1 text-yellow-700 dark:text-yellow-400"
                              >
                                {i}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {/* Summary */}
                      {analysis.overallInsights.summary && (
                        <p className="italic text-sm text-muted-foreground border-t border-border/20 pt-2 leading-relaxed">
                          “{analysis.overallInsights.summary}”
                        </p>
                      )}
                    </div>
                  )}

                  {/* Section Analysis */}
                  {analysis.sectionAnalysis && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-blue-600 mb-1">
                        Section Insights
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(analysis.sectionAnalysis).map(
                          ([section, details], idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border/30 bg-muted/20 p-4 hover:bg-muted/30 transition-colors duration-200"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-base font-semibold text-foreground">
                                  {section.charAt(0).toUpperCase() +
                                    section.slice(1)}
                                </p>
                                {details?.score !== undefined && (
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Score: {details.score}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-2 mt-2">
                                {/* Strengths */}
                                {details?.strengths?.length ? (
                                  <div>
                                    <p className="text-sm font-semibold text-green-600 mb-1">
                                      Strengths
                                    </p>
                                    <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                                      {details.strengths.map((s, i) => (
                                        <li
                                          key={i}
                                          className="pl-1 text-green-700 dark:text-green-400"
                                        >
                                          {s}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}

                                {/* Gaps */}
                                {details?.gaps?.length ? (
                                  <div>
                                    <p className="text-sm font-semibold text-red-600 mb-1">
                                      Gaps
                                    </p>
                                    <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                                      {details.gaps.map((g, i) => (
                                        <li
                                          key={i}
                                          className="pl-1 text-red-700 dark:text-red-400"
                                        >
                                          {g}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


