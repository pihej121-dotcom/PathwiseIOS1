import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Building,
  GraduationCap,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface UserAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  institutionId: string;
  userName: string;
  userEmail: string;
}

interface ResumeAnalysisHistoryItem {
  id: string;
  resume_id: string;
  fileName: string;
  rmsScore: number;
  skillsScore?: number;
  experienceScore?: number;
  keywordsScore?: number;
  educationScore?: number;
  certificationsScore?: number;
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

export function UserAnalysisDialog({
  open,
  onOpenChange,
  userId,
  institutionId,
  userName,
  userEmail,
}: UserAnalysisDialogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: historyData = [], isLoading } = useQuery<
    ResumeAnalysisHistoryItem[]
  >({
    queryKey: [`/api/institutions/${institutionId}/users/${userId}/resume-analysis-history`],
    enabled: open,
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const ExpandableContent = ({
    isExpanded,
    children,
  }: {
    isExpanded: boolean;
    children: React.ReactNode;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
      if (ref.current) {
        if (isExpanded) {
          const fullHeight = ref.current.scrollHeight + "px";
          setHeight(fullHeight);
        } else {
          setHeight("0px");
        }
      }
    }, [isExpanded, ref.current]);

    return (
      <div
        ref={ref}
        style={{
          height,
          transition: "height 0.5s ease, opacity 0.4s ease",
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="user-analysis-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{userName}'s Resume Analysis History</span>
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{userEmail}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] rounded-xl" />
              ))}
            </div>
          ) : historyData.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Resume Analyses</h3>
                <p className="text-muted-foreground max-w-md">
                  This student hasn't analyzed any resumes yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {historyData.map((analysis) => {
                const isExpanded = expandedId === analysis.id;
                return (
                  <Card
                    key={analysis.id}
                    onClick={() => toggleExpand(analysis.id)}
                    className={cn(
                      "cursor-pointer border border-border/40 bg-white dark:bg-gray-900/80 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300",
                      isExpanded && "ring-2 ring-blue-500/40"
                    )}
                    data-testid={`analysis-card-${analysis.id}`}
                  >
                    <CardHeader className="pb-3 border-b border-border/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base md:text-lg font-semibold flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {analysis.targetRole && (
                                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {analysis.targetRole}
                                </span>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                RMS: {analysis.rmsScore || 0}
                              </Badge>
                            </div>
                            <span className="text-muted-foreground text-sm flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {analysis.targetIndustry || "Not specified"}
                              {analysis.targetCompanies?.length
                                ? ` • ${analysis.targetCompanies.slice(0, 2).join(", ")}`
                                : ""}
                            </span>
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {analysis.fileName} • {format(new Date(analysis.createdAt), "PPP")}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    <ExpandableContent isExpanded={isExpanded}>
                      <CardContent className="p-5 space-y-6">
                        {analysis.overallInsights && (
                          <div className="space-y-4">
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

                            {analysis.overallInsights.summary && (
                              <p className="italic text-sm text-muted-foreground border-t border-border/20 pt-2 leading-relaxed">
                                "{analysis.overallInsights.summary}"
                              </p>
                            )}
                          </div>
                        )}

                        {analysis.sectionAnalysis && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-blue-600 mb-1">
                              Section Insights
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-auto">
                              {Object.entries(analysis.sectionAnalysis).map(
                                ([section, details], idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-xl border border-border/30 bg-muted/20 p-4 hover:bg-muted/30 transition-colors duration-200 h-auto"
                                  >
                                    <div className="flex justify-between items-center mb-1 flex-wrap">
                                      <p className="text-base font-semibold text-foreground">
                                        {section.charAt(0).toUpperCase() +
                                          section.slice(1)}
                                      </p>
                                      {details?.score !== undefined && (
                                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                          Score: {details.score}
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-2 space-y-3">
                                      {details?.strengths?.length ? (
                                        <div className="break-words">
                                          <p className="text-sm font-semibold text-green-600 mb-1">
                                            Strengths
                                          </p>
                                          <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                                            {details.strengths.map((s, i) => (
                                              <li
                                                key={i}
                                                className="pl-1 text-green-700 dark:text-green-400 break-normal"
                                              >
                                                {s}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ) : null}

                                      {details?.gaps?.length ? (
                                        <div className="break-words">
                                          <p className="text-sm font-semibold text-red-600 mb-1">
                                            Gaps
                                          </p>
                                          <ul className="list-disc list-inside text-sm leading-relaxed text-muted-foreground space-y-1 ml-1">
                                            {details.gaps.map((g, i) => (
                                              <li
                                                key={i}
                                                className="pl-1 text-red-700 dark:text-red-400 break-normal"
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
                    </ExpandableContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
