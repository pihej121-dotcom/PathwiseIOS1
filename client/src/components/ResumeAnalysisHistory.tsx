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

  // --- Build query string safely ---
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedRole) params.append("targetRole", selectedRole);
    if (selectedIndustry) params.append("targetIndustry", selectedIndustry);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [selectedRole, selectedIndustry, startDate, endDate]);

  // --- Fetch filtered / full data ---
  const { data: historyData = [], isLoading } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history", selectedRole, selectedIndustry, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resume-analysis-history${queryString}`);
      return response.json();
    },
  });

  // --- Fetch all for dropdowns only when not embedded ---
  const { data: allHistoryData = [] } = useQuery<ResumeAnalysisHistoryItem[]>({
    queryKey: ["/api/resume-analysis-history"],
    enabled: !embedded,
  });

  // --- Extract filter options ---
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

  // --- Utility functions ---
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // --- Handle filter clearing ---
  const clearFilters = () => {
    setSelectedRole("");
    setSelectedIndustry("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // --- Loading skeleton ---
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

  // --- Correct empty-state logic ---
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
            Start analyzing your resume to see your progress over time. Your analysis history will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- Render UI ---
  return (
    <div className={cn(!embedded && "space-y-6")}>
      {/* Filter Controls (hide in embedded mode) */}
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
              {/* Role Filter */}
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry Filter */}
              <div className="space-y-2">
                <Label>Target Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All industries</SelectItem>
                    {uniqueIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
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

              {/* End Date */}
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

      {/* Analysis Cards */}
      {historyData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyData.map((analysis) => (
            <Card key={analysis.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {analysis.fileName}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{format(new Date(analysis.createdAt), "PPP")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">RMS Score</p>
                  <p className={cn("text-2xl font-bold", getScoreColor(analysis.rmsScore))}>
                    {analysis.rmsScore}
                  </p>
                  <Progress value={analysis.rmsScore} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysis.targetRole && <Badge variant="secondary">{analysis.targetRole}</Badge>}
                  {analysis.targetIndustry && <Badge variant="secondary">{analysis.targetIndustry}</Badge>}
                  {analysis.targetCompanies?.map((c, i) => (
                    <Badge key={i} variant="outline">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

