import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import type { Resume } from "@shared/schema";

interface ResumeHistoryChartProps {
  resumes: Resume[];
  activeResumeId?: string;
  onSelectResume?: (resumeId: string) => void; // 👈 added
}

interface ChartDataPoint {
  id: string;
  date: string;
  displayDate: string;
  fileName: string;
  rmsScore: number;
  skillsScore: number;
  experienceScore: number;
  keywordsScore: number;
  educationScore: number;
  certificationsScore: number;
  isActive: boolean;
}

export function ResumeHistoryChart({
  resumes,
  activeResumeId,
  onSelectResume,
}: ResumeHistoryChartProps) {
  const [showSectionScores, setShowSectionScores] = useState(false);

  // Transform resume data for the chart
  const chartData: ChartDataPoint[] = resumes
    .filter((resume) => resume.rmsScore !== null)
    .map((resume) => ({
      id: resume.id, // 👈 needed for click detection
      date: new Date(resume.createdAt).toISOString(),
      displayDate: format(new Date(resume.createdAt), "MMM d, h:mm a"),
      fileName: resume.fileName,
      rmsScore: resume.rmsScore || 0,
      skillsScore: resume.skillsScore || 0,
      experienceScore: resume.experienceScore || 0,
      keywordsScore: resume.keywordsScore || 0,
      educationScore: resume.educationScore || 0,
      certificationsScore: resume.certificationsScore || 0,
      isActive: resume.id === activeResumeId,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- Empty State ---
  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardHeader className="text-center pb-8">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Resume Progress Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-base mb-1">
              Upload and analyze a resume to see your progress over time
            </p>
            <p className="text-sm">
              Track improvements across different resume versions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Derived Stats ---
  const latestScore = chartData[chartData.length - 1]?.rmsScore || 0;
  const previousScore =
    chartData.length > 1
      ? chartData[chartData.length - 2]?.rmsScore || 0
      : latestScore;
  const scoreChange = latestScore - previousScore;

  // --- Tooltip ---
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 rounded-2xl p-5 shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                {data.fileName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.displayDate}
              </p>
            </div>
            {data.isActive && (
              <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-3 py-1 animate-pulse">
                ✨ Current
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-200/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Overall Score
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {data.rmsScore}/100
                </span>
              </div>
            </div>

            {showSectionScores && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Skills", data.skillsScore, "#8B5CF6"],
                  ["Experience", data.experienceScore, "#10B981"],
                  ["Keywords", data.keywordsScore, "#F59E0B"],
                  ["Education", data.educationScore, "#EF4444"],
                  ["Certifications", data.certificationsScore, "#06B6D4"],
                ].map(([label, score, color], i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/70 to-gray-50 dark:from-gray-800/20 dark:to-gray-900/40 rounded-xl p-3 border border-border/20"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: color as string }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-lg font-bold"
                        style={{ color: color as string }}
                      >
                        {score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // --- Custom Dots ---
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill="url(#dotGradient)" stroke="#fff" strokeWidth={3} />
        {payload.isActive && (
          <circle
            cx={cx}
            cy={cy}
            r={16}
            fill="none"
            stroke="url(#activeGradient)"
            strokeWidth={3}
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: "4s" }}
          />
        )}
      </g>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/80 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/50 border-0 shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-3 sm:gap-4 text-xl">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg animate-pulse flex-shrink-0">
              <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-xl sm:text-2xl font-bold">
                Resume Progress Analytics
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal mt-1">
                Track your resume improvements over time
              </p>
            </div>
          </CardTitle>

          {/* Toggle Button */}
          <Button
            variant={showSectionScores ? "default" : "outline"}
            size="lg"
            onClick={() => setShowSectionScores(!showSectionScores)}
            className={`w-full sm:w-auto ${
              showSectionScores
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl border-0"
                : "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
            }`}
          >
            {showSectionScores ? (
              <>
                <TrendingDown className="h-5 w-5 mr-2" />
                Hide Details
              </>
            ) : (
              <>
                <BarChart3 className="h-5 w-5 mr-2" />
                Show Details
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-900/80 dark:to-gray-800/50 rounded-2xl p-8 shadow-inner border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onClick={(state) => {
                  // 👇 New: Click → send resumeId
                  if (!state?.activeLabel || !state?.activePayload?.length) return;
                  const clickedPoint = state.activePayload[0]?.payload;
                  if (clickedPoint && onSelectResume) onSelectResume(clickedPoint.id);
                }}
              >
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="30%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="70%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="dotGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 13, fill: "#6B7280" }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 13, fill: "#6B7280" }}
                  label={{
                    value: "Score",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#6B7280" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={80}
                  stroke="#10B981"
                  strokeDasharray="5 5"
                  strokeOpacity={0.6}
                  label={{
                    value: "Target: 80",
                    position: "topRight",
                    fill: "#10B981",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rmsScore"
                  stroke="url(#dotGradient)"
                  strokeWidth={4}
                  fill="url(#mainGradient)"
                  dot={<CustomDot />}
                  activeDot={{ r: 0 }}
                />
                {showSectionScores && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="skillsScore"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", r: 6 }}
                      name="Skills"
                      strokeDasharray="6 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="experienceScore"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", r: 6 }}
                      name="Experience"
                      strokeDasharray="6 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="keywordsScore"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: "#F59E0B", r: 6 }}
                      name="Keywords"
                      strokeDasharray="6 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="educationScore"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", r: 6 }}
                      name="Education"
                      strokeDasharray="6 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="certificationsScore"
                      stroke="#06B6D4"
                      strokeWidth={3}
                      dot={{ fill: "#06B6D4", r: 6 }}
                      name="Certifications"
                      strokeDasharray="6 3"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



