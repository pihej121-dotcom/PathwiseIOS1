import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  AlertTriangle,
  Award,
  Briefcase,
  GraduationCap,
  Hash,
  Target,
  TrendingUp,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ResumeAnalysisHistoryItem {
  id: string;
  fileName: string;
  rmsScore: number;
  skillsScore?: number;
  experienceScore?: number;
  keywordsScore?: number;
  educationScore?: number;
  certificationsScore?: number;
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
  sectionAnalysis?: Record<string, any>;
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

  // Build query string with filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedRole) params.append("targetRole", selectedRole);
    if (selectedIndustry) params.append("targetIndustry", selectedIndustry);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    const queryStr = params.toString();
    return queryStr ? `?${queryStr}` : "";
  }, [selectedRole, selectedIndustry, startDate, endDate]);

  // Fetch history data with server-side filtering
  const { data: historyData = [], isLoading } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history", selectedRole, selectedIndustry, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resume-analysis-history${queryString}`);
      return response.json();
    },
  });

  // Fetch ALL history data (without filters) to populate filter dropdowns
  const { data: allHistoryData = [] } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history"],
  });

  // Extract unique roles and industries from ALL history data for filter dropdowns
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

  // Use filtered data from server (no client-side filtering needed)
  const filteredData = historyData;

  // Clear all filters
  const clearFilters = () => {
    setSelectedRole("");
    setSelectedIndustry("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const hasActiveFilters = selectedRole || selectedIndustry || startDate || endDate;

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white dark:bg-red-600";
      case "medium":
        return "bg-yellow-500 text-white dark:bg-yellow-600";
      case "low":
        return "bg-green-500 text-white dark:bg-green-600";
      default:
        return "bg-gray-500 text-white dark:bg-gray-600";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn(!embedded && "space-y-6")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state - only show if there's genuinely no history AND no filters active
  if (allHistoryData.length === 0 && !hasActiveFilters) {
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
      {/* Filter Controls */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Target className="w-5 h-5" />
            Filter History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Target Role Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-role" className="text-sm font-medium">
                Target Role
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="filter-role" data-testid="select-filter-role" className="min-h-[44px]">
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

            {/* Target Industry Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-industry" className="text-sm font-medium">
                Target Industry
              </Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger id="filter-industry" data-testid="select-filter-industry" className="min-h-[44px]">
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

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal min-h-[44px]",
                      !startDate && "text-muted-foreground"
                    )}
                    data-testid="button-start-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal min-h-[44px]",
                      !endDate && "text-muted-foreground"
                    )}
                    data-testid="button-end-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="min-h-[44px]"
                data-testid="button-clear-filters"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {hasActiveFilters && filteredData.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {allHistoryData.length} analyses
        </div>
      )}

      {/* No Results After Filtering */}
      {filteredData.length === 0 && hasActiveFilters && (
        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              No analysis history matches your current filters. Try adjusting your filter criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters-empty">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Cards Grid */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((analysis) => (
            <Card
              key={analysis.id}
              className="border shadow-sm hover:shadow-md transition-shadow"
              data-testid={`card-analysis-${analysis.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate" title={analysis.fileName}>
                      <FileText className="inline-block w-4 h-4 mr-2 flex-shrink-0" />
                      {analysis.fileName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(analysis.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Overall RMS Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">RMS Score</span>
                    <span
                      className={cn("text-2xl font-bold", getScoreColor(analysis.rmsScore))}
                      data-testid={`text-rms-score-${analysis.id}`}
                    >
                      {analysis.rmsScore}
                    </span>
                  </div>
                  <Progress
                    value={analysis.rmsScore}
                    className="h-2"
                    data-testid={`progress-rms-${analysis.id}`}
                  />
                  <div className="h-1 rounded-full overflow-hidden bg-muted">
                    <div
                      className={cn("h-full transition-all", getScoreBgColor(analysis.rmsScore))}
                      style={{ width: `${analysis.rmsScore}%` }}
                    />
                  </div>
                </div>

                {/* Sub-scores Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {analysis.skillsScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Hash className="w-3 h-3" />
                        <span>Skills</span>
                      </div>
                      <div className={cn("text-lg font-semibold", getScoreColor(analysis.skillsScore))}
                        data-testid={`text-skills-score-${analysis.id}`}>
                        {analysis.skillsScore}
                      </div>
                    </div>
                  )}

                  {analysis.experienceScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="w-3 h-3" />
                        <span>Experience</span>
                      </div>
                      <div className={cn("text-lg font-semibold", getScoreColor(analysis.experienceScore))}
                        data-testid={`text-experience-score-${analysis.id}`}>
                        {analysis.experienceScore}
                      </div>
                    </div>
                  )}

                  {analysis.keywordsScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        <span>Keywords</span>
                      </div>
                      <div className={cn("text-lg font-semibold", getScoreColor(analysis.keywordsScore))}
                        data-testid={`text-keywords-score-${analysis.id}`}>
                        {analysis.keywordsScore}
                      </div>
                    </div>
                  )}

                  {analysis.educationScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <GraduationCap className="w-3 h-3" />
                        <span>Education</span>
                      </div>
                      <div className={cn("text-lg font-semibold", getScoreColor(analysis.educationScore))}
                        data-testid={`text-education-score-${analysis.id}`}>
                        {analysis.educationScore}
                      </div>
                    </div>
                  )}

                  {analysis.certificationsScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="w-3 h-3" />
                        <span>Certifications</span>
                      </div>
                      <div className={cn("text-lg font-semibold", getScoreColor(analysis.certificationsScore))}
                        data-testid={`text-certifications-score-${analysis.id}`}>
                        {analysis.certificationsScore}
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Role, Industry, Companies as Badges */}
                <div className="space-y-2">
                  {analysis.targetRole && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Target className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-role-${analysis.id}`}>
                        {analysis.targetRole}
                      </Badge>
                    </div>
                  )}

                  {analysis.targetIndustry && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-industry-${analysis.id}`}>
                        {analysis.targetIndustry}
                      </Badge>
                    </div>
                  )}

                  {analysis.targetCompanies && analysis.targetCompanies.length > 0 && (
                    <div className="flex items-start gap-2 flex-wrap">
                      <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
                      <div className="flex flex-wrap gap-1">
                        {analysis.targetCompanies.map((company, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                            data-testid={`badge-company-${analysis.id}-${idx}`}
                          >
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable Gaps and Insights */}
                {(analysis.gaps || analysis.overallInsights) && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-none">
                      <AccordionTrigger
                        className="text-sm font-medium hover:no-underline py-2"
                        data-testid={`button-expand-details-${analysis.id}`}
                      >
                        View Gaps & Insights
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        {/* Gaps */}
                        {analysis.gaps && analysis.gaps.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Identified Gaps
                            </h4>
                            <div className="space-y-2">
                              {analysis.gaps.slice(0, 3).map((gap, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-muted/50 rounded-md space-y-1"
                                  data-testid={`gap-item-${analysis.id}-${idx}`}
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      className={cn("text-xs", getPriorityColor(gap.priority))}
                                      data-testid={`badge-priority-${analysis.id}-${idx}`}
                                    >
                                      {gap.priority}
                                    </Badge>
                                    <span className="text-xs font-medium">{gap.category}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{gap.issue}</p>
                                  {gap.impact && (
                                    <p className="text-xs">
                                      <span className="font-medium">Impact:</span> {gap.impact}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {analysis.gaps.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center">
                                  +{analysis.gaps.length - 3} more gaps
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Overall Insights */}
                        {analysis.overallInsights && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Overall Insights</h4>
                            {analysis.overallInsights.summary && (
                              <p className="text-xs text-muted-foreground">
                                {analysis.overallInsights.summary}
                              </p>
                            )}
                            {analysis.overallInsights.strengths &&
                              analysis.overallInsights.strengths.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-green-600 dark:text-green-500">
                                    Strengths:
                                  </p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                    {analysis.overallInsights.strengths.slice(0, 2).map((strength, idx) => (
                                      <li key={idx}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {analysis.overallInsights.improvements &&
                              analysis.overallInsights.improvements.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                                    Areas for Improvement:
                                  </p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                    {analysis.overallInsights.improvements.slice(0, 2).map((improvement, idx) => (
                                      <li key={idx}>{improvement}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
