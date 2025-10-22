import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Brain, 
  Target, 
  Zap, 
  TrendingUp,
  Lightbulb,
  Trophy
} from "lucide-react";

interface LoadingExperienceProps {
  isLoading: boolean;
  operation?: string;
}

const careerTips = [
  { icon: Lightbulb, text: "Networking is key - 70% of jobs are found through connections", color: "text-yellow-500" },
  { icon: Target, text: "Tailor your resume for each job - generic resumes get 50% fewer responses", color: "text-blue-500" },
  { icon: TrendingUp, text: "Learning new skills increases your salary potential by 20%", color: "text-green-500" },
  { icon: Brain, text: "Soft skills matter - communication is the #1 skill employers seek", color: "text-purple-500" },
  { icon: Sparkles, text: "Your LinkedIn headline is read 5x more than your summary", color: "text-cyan-500" },
  { icon: Trophy, text: "Quality over quantity - 5 tailored applications beat 50 generic ones", color: "text-orange-500" },
  { icon: Zap, text: "Follow up within 24 hours of applying to increase response rates", color: "text-pink-500" },
  { icon: Target, text: "Use the STAR method (Situation, Task, Action, Result) for interviews", color: "text-indigo-500" },
  { icon: TrendingUp, text: "Companies with employee referrals hire 55% faster", color: "text-emerald-500" },
  { icon: Brain, text: "Research shows asking questions in interviews increases offer rates by 30%", color: "text-violet-500" },
];

const operationMessages: Record<string, string[]> = {
  resume: [
    "Analyzing your resume...",
    "Identifying key skills...",
    "Checking formatting...",
    "Comparing with job requirements...",
    "Generating recommendations..."
  ],
  roadmap: [
    "Creating your personalized roadmap...",
    "Identifying skill gaps...",
    "Planning learning milestones...",
    "Building project suggestions...",
    "Finalizing your path..."
  ],
  projects: [
    "Generating project ideas...",
    "Creating detailed steps...",
    "Finding relevant resources...",
    "Tailoring to your goals...",
    "Almost ready..."
  ],
  jobs: [
    "Analyzing job matches...",
    "Calculating compatibility scores...",
    "Finding best opportunities...",
    "Preparing insights...",
    "Finalizing matches..."
  ],
  interview: [
    "Generating interview questions...",
    "Creating practice scenarios...",
    "Building answer frameworks...",
    "Finding preparation resources...",
    "Almost done..."
  ],
  default: [
    "Processing your request...",
    "Analyzing data...",
    "Generating insights...",
    "Preparing results...",
    "Almost there..."
  ]
};

export function LoadingExperience({ isLoading, operation = "default" }: LoadingExperienceProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = operationMessages[operation] || operationMessages.default;

  // Progress animation
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setMessageIndex(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  // Rotate messages
  useEffect(() => {
    if (!isLoading) return;
    
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [isLoading, messages.length]);

  // Rotate tips
  useEffect(() => {
    if (!isLoading) return;

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % careerTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, [isLoading]);

  if (!isLoading) return null;

  const TipIcon = careerTips[currentTip].icon;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="loading-experience-overlay">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <Sparkles className="w-12 h-12 text-primary relative" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="loading-message">
            {messages[messageIndex]}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" data-testid="loading-progress" />
            <p className="text-sm text-muted-foreground text-center" data-testid="progress-percentage">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Career Tip */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TipIcon className={`w-6 h-6 ${careerTips[currentTip].color} flex-shrink-0 mt-1`} />
                <div>
                  <p className="text-sm font-medium mb-1">Career Tip:</p>
                  <p className="text-sm text-muted-foreground" data-testid="career-tip-text">
                    {careerTips[currentTip].text}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            This usually takes 10-30 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
