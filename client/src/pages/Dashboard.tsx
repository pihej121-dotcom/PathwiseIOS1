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
import demoVideo from "@assets/Pathwise Your Career Powered by AI_1080p_1760659870596.mp4";

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
    <div className="space-y-8">
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
              "The AI resume analysis was a game-changer! I improved my score from 65 to 89 and landed three interviews in two weeks."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                SM
              </div>
              <div>
                <p className="text-xs font-semibold">Sarah Martinez</p>
                <p className="text-xs text-muted-foreground">CS, Class of 2024</p>
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
              "The micro-projects feature helped me build a portfolio from scratch. Employers were really impressed!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                JC
              </div>
              <div>
                <p className="text-xs font-semibold">James Chen</p>
                <p className="text-xs text-muted-foreground">Data Science, '25</p>
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
              "Finally, a tool that understands career development! The roadmap gave me clear direction."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                EP
              </div>
              <div>
                <p className="text-xs font-semibold">Emily Park</p>
                <p className="text-xs text-muted-foreground">Business, '24</p>
              </div>
            </div>
          </div>
        </div>
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
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
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

  // If not authenticated, show public experience
  if (!user) {
    return <PublicExperience />;
  }

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
  }, [toast]);

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

  return (
    <Layout title={`Welcome back, ${user.firstName}!`} subtitle="Your career command center">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-11 mb-6">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="upload" data-testid="tab-upload">Upload</TabsTrigger>
          <TabsTrigger value="resume" data-testid="tab-resume">Resume</TabsTrigger>
          <TabsTrigger value="roadmap" data-testid="tab-roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="jobs" data-testid="tab-jobs">Jobs</TabsTrigger>
          <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
          <TabsTrigger value="copilot" data-testid="tab-copilot">Copilot</TabsTrigger>
          <TabsTrigger value="applications" data-testid="tab-applications">Apps</TabsTrigger>
          <TabsTrigger value="interview" data-testid="tab-interview">Interview</TabsTrigger>
          <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
          <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{<OverviewContent />}</TabsContent>
        <TabsContent value="upload">{selectedCard === 'upload' ? <ResumeUpload /> : <OverviewContent />}</TabsContent>
        <TabsContent value="resume">{selectedCard === 'resume' ? <ResumeAnalysis /> : <OverviewContent />}</TabsContent>
        <TabsContent value="roadmap">{selectedCard === 'roadmap' ? <CareerRoadmap /> : <OverviewContent />}</TabsContent>
        <TabsContent value="jobs">{selectedCard === 'jobs' ? <JobAnalysis /> : <OverviewContent />}</TabsContent>
        <TabsContent value="projects">{selectedCard === 'projects' ? <MicroProjects /> : <OverviewContent />}</TabsContent>
        <TabsContent value="copilot">{selectedCard === 'copilot' ? <AICopilot /> : <OverviewContent />}</TabsContent>
        <TabsContent value="applications">{selectedCard === 'applications' ? <Applications /> : <OverviewContent />}</TabsContent>
        <TabsContent value="interview">{selectedCard === 'interview' ? <InterviewPrep /> : <OverviewContent />}</TabsContent>
        <TabsContent value="about">{selectedCard === 'about' ? <AboutUsContent /> : <OverviewContent />}</TabsContent>
        <TabsContent value="contact">{selectedCard === 'contact' ? <ContactUsContent /> : <OverviewContent />}</TabsContent>
      </Tabs>
    </Layout>
  );
}
