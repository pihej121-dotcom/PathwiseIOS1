import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressRing } from "@/components/ProgressRing";
import { TourButton } from "@/components/TourButton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FEATURE_CATALOG } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Send, 
  Route, 
  CheckCircle, 
  Clock, 
  Target,
  Wand2,
  FileText,
  Briefcase,
  Lightbulb,
  Brain,
  ListTodo,
  MessageSquare,
  Upload,
  Loader2,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Star,
  Quote,
  CheckCircle2,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import demoVideo from "@assets/Pathwise_16_9_AspectRatio_2025_1763228723323.mp4";

// Import feature components
import ResumeUpload from "./ResumeUpload";
import ResumeAnalysis from "./ResumeAnalysis";
import CareerRoadmap from "./CareerRoadmap";
import JobAnalysis from "./JobAnalysis";
import MicroProjects from "./MicroProjects";
import { AICopilot } from "./AICopilot";
import Applications from "./Applications";
import { InterviewPrep } from "./InterviewPrep";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// About Us Content Component
function AboutUsContent() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Career Development
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
          Navigate Your Career Path
          <br />
          With Confidence
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your career journey with AI-powered insights, personalized roadmaps, 
          and intelligent job matching designed specifically for students and new graduates.
        </p>

        {/* Demo Video */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-1">
            <video 
              className="w-full h-auto rounded-lg"
              controls
              playsInline
              preload="metadata"
              data-testid="demo-video"
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Primary CTA after video */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8" data-testid="button-get-started-hero">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-try-premium">
              View Plans & Pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Join thousands of students landing their dream jobs
        </p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Everything You Need to Launch Your Career
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Resume Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get instant feedback on your resume with AI-powered scoring and actionable suggestions.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Roadmaps</h3>
            <p className="text-sm text-muted-foreground">
              Create custom career development plans tailored to your goals and timeline.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Job Matching</h3>
            <p className="text-sm text-muted-foreground">
              Discover opportunities that align with your skills using AI-powered matching.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Micro-Projects</h3>
            <p className="text-sm text-muted-foreground">
              Build your portfolio with AI-generated project ideas for your target role.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Application Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Organize and monitor your job applications with built-in progress tracking.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Student-Focused</h3>
            <p className="text-sm text-muted-foreground">
              Designed for institutions to support students throughout their career journey.
            </p>
          </div>
        </div>
      </div>

      {/* Where Our Users Are Placed */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Where Our Users Have Been Placed
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Pathwise users have secured positions at leading companies across industries
        </p>
        
        {/* Scrolling Company Logos */}
        <div className="relative overflow-hidden py-8">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex animate-scroll gap-8 whitespace-nowrap">
            {/* First set */}
            <div className="flex gap-8 items-center">
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Google</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Microsoft</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Amazon</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Apple</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Meta</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">NVIDIA</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Deloitte</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Goldman Sachs</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Tesla</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Pfizer</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Boeing</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">JPMorgan Chase</div>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex gap-8 items-center">
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Google</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Microsoft</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Amazon</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Apple</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Meta</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">NVIDIA</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Deloitte</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Goldman Sachs</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Tesla</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Pfizer</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Boeing</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">JPMorgan Chase</div>
            </div>
          </div>
        </div>

        {/* Second row scrolling opposite direction */}
        <div className="relative overflow-hidden pb-8">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex animate-scroll-reverse gap-8 whitespace-nowrap">
            {/* First set */}
            <div className="flex gap-8 items-center">
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Oracle</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Salesforce</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">PwC</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">EY</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">KPMG</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Lockheed Martin</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Raytheon</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Moderna</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Intel</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">AMD</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Bank of America</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Morgan Stanley</div>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex gap-8 items-center">
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Oracle</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Salesforce</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">PwC</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">EY</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">KPMG</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Lockheed Martin</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Raytheon</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Moderna</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Intel</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">AMD</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Bank of America</div>
              <div className="px-6 py-3 bg-muted/50 rounded-md font-semibold text-sm">Morgan Stanley</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables Preview Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See What You Actually Get
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No guesswork. Here's exactly what Pathwise delivers - real analysis reports, real recommendations, real results.
          </p>
        </div>

        {/* Full Resume Analysis Example */}
        <div className="space-y-8 mb-12">
          <Card className="overflow-hidden border-2">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Complete Resume Analysis Report</CardTitle>
                  <CardDescription>Example: Investment Banking Resume for Morgan Stanley</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Overall Score and Target Context */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-3xl font-bold text-primary">60</p>
                    <p className="text-sm text-muted-foreground">OVERALL MATCH SCORE</p>
                    <p className="text-xs text-muted-foreground mt-1">Nov 13, 2025</p>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">TARGET ROLE</p>
                      <p className="text-sm font-semibold">Investment Banking</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">TARGET INDUSTRY</p>
                      <p className="text-sm font-semibold">Finance</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">TARGET COMPANIES</p>
                      <p className="text-sm font-semibold">Morgan Stanley</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Subsection Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">70</span>
                    </div>
                    <p className="text-xs font-medium">SKILLS</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <Briefcase className="w-4 h-4 text-accent" />
                      <span className="text-2xl font-bold text-accent">55</span>
                    </div>
                    <p className="text-xs font-medium">EXPERIENCE</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">75</span>
                    </div>
                    <p className="text-xs font-medium">EDUCATION</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-2xl font-bold text-accent">50</span>
                    </div>
                    <p className="text-xs font-medium">KEYWORDS</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Improvement Recommendations */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Improvement Recommendations
                </h3>
                
                {/* High Priority Recommendation */}
                <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-xs font-bold">HIGH</div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold">Financial Modeling Expertise</p>
                      <p className="text-xs text-muted-foreground">
                        Essential for performing complex valuations, market analyses, and financial forecasting needed in investment banking.
                      </p>
                      <div className="bg-background/50 rounded-md p-3 space-y-2">
                        <p className="text-xs font-medium">Recommended Resources:</p>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold">Financial Modeling & Valuation Analyst (FMVA) Certification</p>
                            <p className="text-xs text-muted-foreground">Corporate Finance Institute</p>
                            <a href="#" className="text-xs text-primary hover:underline">Free with audit option • View</a>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-accent font-semibold">+15 points</p>
                    </div>
                  </div>
                </div>

                {/* Before/After Bullet Examples */}
                <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold">MEDIUM</div>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-semibold">Quantify Your Impact</p>
                      <p className="text-xs text-muted-foreground">
                        Your accomplishments need specific metrics and business outcomes.
                      </p>
                      
                      <div className="space-y-3">
                        {/* Example 1 */}
                        <div className="bg-background/50 rounded-md p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">BEFORE</div>
                            <p className="text-xs text-muted-foreground italic flex-1">
                              "Managed team of 5 analysts"
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">AFTER</div>
                            <p className="text-xs font-medium flex-1">
                              "Led cross-functional team of 5 analysts to deliver 3 M&A valuations totaling $2.4B, reducing analysis time by 40% through streamlined DCF models"
                            </p>
                          </div>
                        </div>

                        {/* Example 2 */}
                        <div className="bg-background/50 rounded-md p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">BEFORE</div>
                            <p className="text-xs text-muted-foreground italic flex-1">
                              "Performed financial analysis and research"
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">AFTER</div>
                            <p className="text-xs font-medium flex-1">
                              "Conducted comprehensive financial analysis of 12 tech sector companies using comparable company analysis and precedent transactions, informing $850M acquisition decision"
                            </p>
                          </div>
                        </div>

                        {/* Example 3 */}
                        <div className="bg-background/50 rounded-md p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">BEFORE</div>
                            <p className="text-xs text-muted-foreground italic flex-1">
                              "Created Excel models"
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">AFTER</div>
                            <p className="text-xs font-medium flex-1">
                              "Built dynamic 3-statement financial models with sensitivity analysis for 8 healthcare IPOs, achieving 95% accuracy in revenue projections vs. actual Q1 results"
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-accent font-semibold">+12 points</p>
                    </div>
                  </div>
                </div>

                {/* Keyword Gap Analysis */}
                <div className="border border-accent/20 bg-accent/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="px-2 py-0.5 rounded bg-accent/50 text-accent-foreground text-xs font-bold">LOW</div>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-semibold">Missing Keywords for Investment Banking</p>
                      <p className="text-xs text-muted-foreground">
                        Add these industry-standard terms to improve ATS compatibility and demonstrate domain knowledge.
                      </p>
                      
                      <div className="bg-background/50 rounded-md p-3">
                        <p className="text-xs font-medium mb-2">Critical Keywords to Add:</p>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">DCF Modeling</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">LBO Analysis</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Pitch Book Creation</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Comparable Company Analysis</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Precedent Transactions</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Capital Markets</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Equity Research</div>
                          <div className="px-2 py-1 bg-primary/10 rounded text-xs">Bloomberg Terminal</div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3">
                          Where to add: Integrate these naturally into your bullet points when describing your financial analysis and modeling work.
                        </p>
                      </div>
                      
                      <p className="text-xs text-accent font-semibold">+8 points</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Career Roadmap Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Route className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Personalized Career Roadmap</CardTitle>
                  <CardDescription>Custom plan for your goals</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Visual Timeline Example */}
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        1
                      </div>
                      <div className="w-0.5 h-8 bg-primary/30"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs font-semibold">Month 1: Foundation</p>
                      <p className="text-xs text-muted-foreground">Complete React course, build 2 portfolio projects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center text-xs font-bold text-primary-foreground">
                        2
                      </div>
                      <div className="w-0.5 h-8 bg-primary/30"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs font-semibold">Month 3: Specialization</p>
                      <p className="text-xs text-muted-foreground">Master TypeScript, contribute to open source</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs font-semibold">Month 6: Job Ready</p>
                      <p className="text-xs text-muted-foreground">Apply to top companies, ace interviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Your Progress</span>
                  <span className="text-xs text-accent font-semibold">40% Complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Match Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Smart Job Matches</CardTitle>
                  <CardDescription>Opportunities ranked by fit</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Visual Job Match Card */}
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Frontend Developer</p>
                    <p className="text-xs text-muted-foreground">Google • Mountain View, CA</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-primary">92</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">92%</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 pt-1">
                    <div className="px-2 py-0.5 bg-primary/10 rounded text-xs">React</div>
                    <div className="px-2 py-0.5 bg-primary/10 rounded text-xs">TypeScript</div>
                    <div className="px-2 py-0.5 bg-muted rounded text-xs">GraphQL</div>
                  </div>
                </div>
              </div>

              {/* Skills Gap */}
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                <p className="text-xs font-semibold mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-1">
                  <div className="px-2 py-1 bg-accent/10 rounded text-xs flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    GraphQL
                  </div>
                  <div className="px-2 py-1 bg-accent/10 rounded text-xs flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Testing
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Micro-Projects Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Portfolio Project Ideas</CardTitle>
                  <CardDescription>Build what employers want to see</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Visual Project Card Example */}
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Real-Time Chat Application</p>
                    <p className="text-xs text-muted-foreground">Build a WebSocket-based messaging app</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>2-3 weeks</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium mb-1">Skills You'll Demonstrate:</p>
                    <div className="flex flex-wrap gap-1">
                      <div className="px-2 py-0.5 bg-primary/10 rounded text-xs">WebSockets</div>
                      <div className="px-2 py-0.5 bg-primary/10 rounded text-xs">Real-time</div>
                      <div className="px-2 py-0.5 bg-primary/10 rounded text-xs">Node.js</div>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <p className="font-medium mb-1">Why Employers Love It:</p>
                    <p className="text-muted-foreground">Shows async programming & scalable architecture</p>
                  </div>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                <p className="text-xs font-semibold mb-2">Step-by-Step Guide Included</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span>Setup & architecture planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span>Implementation milestones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span>Testing & deployment guide</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Students Are Saying
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "Honestly wasn't expecting much when my career advisor showed me this, but the resume feedback was actually spot-on. Fixed my bullet points and within like 10 days I had callbacks from Amazon and Microsoft. Still can't believe it worked that fast lol"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                DK
              </div>
              <div>
                <p className="text-xs font-semibold">David Kim</p>
                <p className="text-xs text-muted-foreground">Computer Engineering, '24</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "The micro-projects thing is genius. I had zero portfolio work and needed something to talk about in interviews. Did 2 of the suggested projects over winter break and they came up in every single interview. Got an offer from Deloitte!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                AL
              </div>
              <div>
                <p className="text-xs font-semibold">Alex Liu</p>
                <p className="text-xs text-muted-foreground">Information Systems, '25</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "My school gave us access junior year. The career roadmap helped me figure out what certs to get and which internships to prioritize. Just accepted a return offer from Boeing. Thank you Pathwise!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                MR
              </div>
              <div>
                <p className="text-xs font-semibold">Maya Rodriguez</p>
                <p className="text-xs text-muted-foreground">Mechanical Engineering, '24</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "I was applying to everything and getting nowhere. The job match feature helped me focus on roles that actually fit my background. Way less stressful and I ended up at Google doing exactly what I wanted."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                JT
              </div>
              <div>
                <p className="text-xs font-semibold">Jordan Taylor</p>
                <p className="text-xs text-muted-foreground">Data Analytics, '23</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "Tracking all my applications in one place was a lifesaver during recruiting season. No more forgetting to follow up or losing track of deadlines. Plus the interview prep scenarios were actually pretty similar to what I got asked at Goldman."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                SC
              </div>
              <div>
                <p className="text-xs font-semibold">Sophia Chen</p>
                <p className="text-xs text-muted-foreground">Finance, '25</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Quote className="w-6 h-6 text-primary/20 mb-3" />
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              "Career services told us about this and I'm glad they did. The AI suggestions for improving my resume were way more specific than the generic advice I'd been getting. Went from a 62 to 91 score and landed at Tesla."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                RP
              </div>
              <div>
                <p className="text-xs font-semibold">Ryan Patel</p>
                <p className="text-xs text-muted-foreground">Electrical Engineering, '24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Join thousands of successful students
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Launch Your Career?
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Don't leave your career to chance. Get personalized AI-powered guidance, 
                actionable insights, and the tools you need to land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 min-w-[200px]" data-testid="button-start-free-trial">
                    Create Your Account
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="text-lg px-8 min-w-[200px]" data-testid="button-view-pricing">
                    View Plans & Pricing
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Trusted by thousands of students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Setup in under 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>AI-powered career guidance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Contact Us Content Component  
function ContactUsContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description:
          "Please try again later or email us directly at patrick@pathwiseinstitutions.org",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-muted-foreground">
          Have questions or need support? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle>Response Time</CardTitle>
            </div>
            <CardDescription>
              We aim to respond to all inquiries as quickly as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium mb-2">Typically within 24–48 hours</p>
            <p className="text-sm text-muted-foreground mb-4">
              Monday – Friday, 9 AM – 5 PM EST
            </p>
            <p className="text-sm text-muted-foreground">
              For urgent issues, please include "URGENT" in your subject line.
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onContactSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What is this regarding?"
                          {...field}
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your question or issue..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Public Experience Component for non-authenticated users
function PublicExperience() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Public Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="button-auth-menu">
                <User className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/register" data-testid="link-register">
                  <span className="cursor-pointer">Register</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login" data-testid="link-login">
                  <span className="cursor-pointer">Sign In</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* About Us Section */}
        <section id="about" className="mb-16">
          <Card className="mb-8">
            <CardContent className="pt-8">
              <AboutUsContent />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/register">
                  <Button size="lg" data-testid="hero-button-getstarted">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" data-testid="hero-button-login">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Us Section */}
        <section id="contact">
          <ContactUsContent />
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pathwise Institution Edition. Empowering students to navigate their career paths.</p>
          <p className="mt-2 font-medium">Pathwise LLC</p>
        </footer>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCard, setSelectedCard] = useState<string | null>('about');
  const [failedVerification, setFailedVerification] = useState<{sessionId: string, feature: string, error: string} | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to handle card selection
  const handleCardSelect = (cardValue: string) => {
    setSelectedCard(cardValue);
    setActiveTab(cardValue);
  };
  
  // Guard queries with user authentication
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities?limit=4"],
    refetchInterval: 60000,
    staleTime: 3000,
    enabled: !!user,
  });

  const verifyFeaturePurchase = async (sessionId: string, feature: string) => {
    const processedKey = `purchase_verified_${sessionId}`;
    const alreadyProcessed = sessionStorage.getItem(processedKey);
    
    if (alreadyProcessed) {
      window.history.replaceState({}, "", "/dashboard");
      setFailedVerification(null);
      return true;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      sessionStorage.setItem(processedKey, 'true');

      const featureName = data.featureKey ? FEATURE_CATALOG[data.featureKey as keyof typeof FEATURE_CATALOG]?.name : FEATURE_CATALOG[feature as keyof typeof FEATURE_CATALOG]?.name;
      toast({
        title: "Purchase successful!",
        description: `You now have access to ${featureName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/feature-access"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/purchased-features"] });
      window.history.replaceState({}, "", "/dashboard");
      setFailedVerification(null);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  useEffect(() => {
    // Only handle purchase verification for authenticated users
    if (!user) return;
    
    const handlePurchaseReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const purchase = params.get("purchase");
      const feature = params.get("feature");
      const type = params.get("type");
      const sessionId = params.get("session_id");

      if (purchase === "success") {
        if (feature && sessionId) {
          const success = await verifyFeaturePurchase(sessionId, feature);
          if (!success) {
            setFailedVerification({ sessionId, feature, error: "Failed to verify your purchase" });
          }
        }
      } else if (purchase === "cancelled") {
        toast({
          title: "Purchase cancelled",
          description: "Your payment was cancelled. No charges were made.",
          variant: "destructive",
        });
        window.history.replaceState({}, "", "/dashboard");
      }
    };

    handlePurchaseReturn();
  }, [toast, user]);

  const handleRetryVerification = async () => {
    if (!failedVerification) return;
    
    setIsRetrying(true);
    const success = await verifyFeaturePurchase(failedVerification.sessionId, failedVerification.feature);
    
    if (!success) {
      toast({
        title: "Verification failed",
        description: "Still unable to verify your purchase. Please contact support for assistance.",
        variant: "destructive",
      });
    }
    setIsRetrying(false);
  };

  const handleDismissVerificationError = () => {
    window.history.replaceState({}, "", "/dashboard");
    setFailedVerification(null);
  };

  if (isLoading) {
    return (
      <Layout title={`Welcome back, ${user?.firstName}!`} subtitle="Your career command center">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const OverviewContent = () => (
    <>
      <div className="flex justify-end mb-4">
        <TourButton 
          tourId="dashboard-welcome" 
          autoStart={true}
        />
      </div>

      {failedVerification && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Purchase verification failed.</strong> Your payment was successful, but we couldn't record your purchase. Please retry.
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                onClick={handleRetryVerification} 
                disabled={isRetrying}
                size="sm"
                data-testid="button-retry-verification"
              >
                {isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Retry"}
              </Button>
              <Button 
                onClick={handleDismissVerificationError} 
                variant="outline"
                size="sm"
                data-testid="button-dismiss-verification"
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Resume Score</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100" data-testid="rms-score">
                  {(stats as any)?.rmsScore || 0}
                </p>
              </div>
              <ProgressRing progress={(stats as any)?.rmsScore || 0} size={50} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Applications</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100" data-testid="applications-count">
                  {(stats as any)?.applicationsCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Roadmap</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100" data-testid="roadmap-progress">
                  {(stats as any)?.roadmapProgress || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Route className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'upload' ? 'ring-2 ring-cyan-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('upload')} 
          data-testid="card-upload"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold mb-1">Resume Upload</h3>
            <p className="text-xs text-muted-foreground">Upload & manage</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'resume' ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('resume')} 
          data-testid="card-resume"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Resume Analysis</h3>
            <p className="text-xs text-muted-foreground">Analyze & optimize</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'roadmap' ? 'ring-2 ring-green-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('roadmap')} 
          data-testid="card-roadmap"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Route className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Roadmap</h3>
            <p className="text-xs text-muted-foreground">Career planning</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'jobs' ? 'ring-2 ring-purple-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('jobs')} 
          data-testid="card-jobs"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Job Match Assistant</h3>
            <p className="text-xs text-muted-foreground">
             Analyze. Tailor. Apply.
            </p>

          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'projects' ? 'ring-2 ring-orange-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('projects')} 
          data-testid="card-projects"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Projects</h3>
            <p className="text-xs text-muted-foreground">Build portfolio</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'copilot' ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('copilot')} 
          data-testid="card-copilot"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-1">Compensation Insights</h3>
            <p className="text-xs text-muted-foreground"> Salary negotiation coach</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'applications' ? 'ring-2 ring-pink-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('applications')} 
          data-testid="card-applications"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold mb-1">Applications</h3>
            <p className="text-xs text-muted-foreground">Track progress</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'interview' ? 'ring-2 ring-amber-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('interview')} 
          data-testid="card-interview"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Interview Prep</h3>
            <p className="text-xs text-muted-foreground">Practice & prepare</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'about' ? 'ring-2 ring-teal-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('about')} 
          data-testid="card-about"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold mb-1">About Us</h3>
            <p className="text-xs text-muted-foreground">Learn more</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] ${selectedCard === 'contact' ? 'ring-2 ring-rose-500 shadow-lg' : ''}`} 
          onClick={() => handleCardSelect('contact')} 
          data-testid="card-contact"
        >
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold mb-1">Contact Us</h3>
            <p className="text-xs text-muted-foreground">Get in touch</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(activities) && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity. Start using Pathwise to see your progress here!
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );

  // Render the selected feature component below the overview cards
  const renderSelectedFeature = () => {
    // Allow "about" and "contact" for everyone, require login for other features
    const isPublicFeature = selectedCard === 'about' || selectedCard === 'contact';
    
    if (!user && !isPublicFeature) {
      // Feature information mapping
      const featureInfo: Record<string, {
        title: string;
        tagline: string;
        icon: React.ElementType;
        benefits: string[];
      }> = {
        'resume': {
          title: 'Resume Analysis',
          tagline: 'Get professional feedback on your resume in seconds',
          icon: FileText,
          benefits: [
            'Comprehensive RMS scoring with detailed analysis',
            'Specific, actionable suggestions for improvement',
            'Industry best practices and ATS optimization',
            'Compare against successful resumes in your field'
          ]
        },
        'roadmap': {
          title: 'Career Roadmap',
          tagline: 'Get a personalized career development plan from AI',
          icon: Route,
          benefits: [
            '30-day, 3-month, and 6-month actionable plans',
            'Customized to your goals and current experience',
            'Skills to learn, projects to build, and milestones to hit',
            'Track your progress and stay motivated'
          ]
        },
        'jobs': {
          title: 'Job Match Assistant',
          tagline: 'Discover the perfect job opportunities matched to your profile',
          icon: Briefcase,
          benefits: [
            'AI-powered compatibility scoring for every position',
            'Smart matching based on skills, experience, and goals',
            'Tailored application materials for each opportunity',
            'Real-time alerts for new matching positions'
          ]
        },
        'projects': {
          title: 'Micro-Projects',
          tagline: 'Build portfolio projects that showcase your skills to employers',
          icon: Lightbulb,
          benefits: [
            'Personalized project ideas based on your skill gaps',
            'Detailed implementation guides and timelines',
            'Industry-relevant projects that employers value',
            'Stand out from other candidates with unique work'
          ]
        },
        'copilot': {
          title: 'Compensation Insights',
          tagline: 'Master the art of negotiation and maximize your earning potential',
          icon: Brain,
          benefits: [
            'AI-generated negotiation scripts tailored to your situation',
            'Market salary data and compensation benchmarks',
            'Step-by-step guidance for every negotiation stage',
            'Proven tactics from industry experts'
          ]
        },
        'interview': {
          title: 'Interview Prep',
          tagline: 'Practice interviews and master your answers with AI feedback',
          icon: MessageSquare,
          benefits: [
            'Personalized questions based on the role and company',
            'Real-time feedback on your answers',
            'Common and behavioral question practice',
            'Build confidence before the real interview'
          ]
        },
        'applications': {
          title: 'Application Tracker',
          tagline: 'Organize and monitor your job applications with ease',
          icon: ListTodo,
          benefits: [
            'Track all applications in one centralized dashboard',
            'Set reminders for follow-ups and deadlines',
            'Monitor application status and progress',
            'Analyze your success rate and improve your strategy'
          ]
        },
        'upload': {
          title: 'Resume Upload',
          tagline: 'Securely upload and manage your resume files',
          icon: Upload,
          benefits: [
            'Store multiple resume versions',
            'Easy access to your documents anytime',
            'Secure cloud storage',
            'Seamless integration with analysis tools'
          ]
        }
      };

      const info = featureInfo[selectedCard || ''];
      if (!info) return null;

      const FeatureIcon = info.icon;

      return (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-8 pb-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <FeatureIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{info.title}</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {info.tagline}
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              {info.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="w-full h-px bg-border" />
              
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to unlock this feature and start advancing your career
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" data-testid="button-register-prompt">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" data-testid="button-login-prompt">
                      Log In
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join thousands of students advancing their careers with Pathwise
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (selectedCard) {
      case 'upload':
        return <ResumeUpload />;
      case 'resume':
        return <ResumeAnalysis />;
      case 'roadmap':
        return <CareerRoadmap />;
      case 'jobs':
        return <JobAnalysis />;
      case 'projects':
        return <MicroProjects />;
      case 'copilot':
        return <AICopilot />;
      case 'applications':
        return <Applications />;
      case 'interview':
        return <InterviewPrep />;
      case 'about':
        return <AboutUsContent />;
      case 'contact':
        return <ContactUsContent />;
      default:
        return null;
    }
  };

  return (
    <Layout title={user ? `Welcome back, ${user.firstName}!` : "Welcome to Pathwise!"} subtitle="Your career command center">
      <OverviewContent />
      
      {selectedCard && (
        <div className="mt-8 pt-8 border-t">
          {renderSelectedFeature()}
        </div>
      )}
    </Layout>
  );
}
