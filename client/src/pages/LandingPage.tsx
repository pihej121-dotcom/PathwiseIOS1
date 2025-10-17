import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { 
  GraduationCap, 
  TrendingUp, 
  Target, 
  FileText, 
  Briefcase, 
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Star,
  Quote
} from "lucide-react";
import demoVideo from "@assets/Pathwise Your Career Powered by AI_1080p_1760659870596.mp4";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Navigation Bar */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/contact">
              <Button variant="ghost" className="hidden sm:inline-flex" data-testid="nav-button-contact">
                Contact Us
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="text-sm sm:text-base px-3 sm:px-4" data-testid="nav-button-register">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button className="text-sm sm:text-base px-3 sm:px-4" data-testid="nav-button-login">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Development
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Navigate Your Career Path
            <br />
            With Confidence
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your career journey with AI-powered insights, personalized roadmaps, 
            and intelligent job matching designed specifically for students and new graduates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="hero-button-getstarted">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="hero-button-login">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Demo Video */}
          <div className="pt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-1">
              <video 
                className="w-full h-auto rounded-xl"
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

          {/* Subscription Plan - Modern Design */}
          <div className="pt-20 max-w-5xl mx-auto">
            <div className="relative">
              {/* Background Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-3xl blur-3xl opacity-50"></div>
              
              <div className="relative bg-gradient-to-br from-background via-background to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    🎉 14 Days Free Trial
                  </div>
                </div>

                {/* Header */}
                <div className="text-center mb-10 pt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent/80 text-primary-foreground mb-6 shadow-lg">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Start Your Path</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$15</span>
                    <span className="text-xl text-muted-foreground font-medium">/month</span>
                  </div>
                  <p className="text-lg text-muted-foreground">Full access to all premium features</p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Resume Analysis with AI</p>
                      <p className="text-sm text-muted-foreground">Instant feedback & scoring</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Career Roadmaps</p>
                      <p className="text-sm text-muted-foreground">Custom development plans</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Job Matching & Tracking</p>
                      <p className="text-sm text-muted-foreground">AI-powered opportunities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Portfolio Micro-Projects</p>
                      <p className="text-sm text-muted-foreground">Build real-world experience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all sm:col-span-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Beyond Jobs Opportunities</p>
                      <p className="text-sm text-muted-foreground">Internships & volunteering</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link href="/register">
                    <Button 
                      size="lg" 
                      className="text-lg px-12 py-7 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105" 
                      data-testid="pricing-button-getstarted"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to Launch Your Career
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From resume optimization to job matching, we provide comprehensive tools 
            to help you stand out and succeed.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-resume">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Resume Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant feedback on your resume with AI-powered scoring and 
                  actionable improvement suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-roadmap">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Roadmaps</h3>
                <p className="text-muted-foreground">
                  Create custom career development plans tailored to your goals, 
                  skills, and timeline.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-jobs">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
                <p className="text-muted-foreground">
                  Discover opportunities that align with your skills and career 
                  aspirations using AI.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-projects">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Micro-Projects</h3>
                <p className="text-muted-foreground">
                  Build your portfolio with AI-generated project ideas designed 
                  for your target role.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-tracking">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
                <p className="text-muted-foreground">
                  Organize and monitor your job applications with built-in 
                  progress tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105" data-testid="feature-card-education">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student-Focused</h3>
                <p className="text-muted-foreground">
                  Designed for educational institutions to support students 
                  throughout their career journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How Pathwise Works
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-muted-foreground">
                  Start by uploading your resume. Our AI instantly analyzes it, 
                  providing a detailed score and identifying areas for improvement.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Your Roadmap</h3>
                <p className="text-muted-foreground">
                  Create a personalized career development plan with milestones, 
                  skill-building activities, and timeline tracking.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Find Perfect Matches</h3>
                <p className="text-muted-foreground">
                  Discover jobs, internships, and opportunities that align with your 
                  skills and career goals through AI-powered matching.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track & Succeed</h3>
                <p className="text-muted-foreground">
                  Monitor your applications, complete portfolio projects, and 
                  watch your career progress in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Students Are Saying
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Real feedback from students who transformed their career journey with Pathwise.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-1">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The AI resume analysis was a game-changer! I improved my score from 65 to 89 
                  and landed three interviews in two weeks. The feedback was so specific and actionable."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    SM
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah Martinez</p>
                    <p className="text-xs text-muted-foreground">Computer Science, Class of 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-2">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The micro-projects feature helped me build a portfolio from scratch. I completed 
                  three projects in a month, and employers were really impressed with my work during interviews."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    JC
                  </div>
                  <div>
                    <p className="font-semibold text-sm">James Chen</p>
                    <p className="text-xs text-muted-foreground">Data Science, Class of 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-3">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Finally, a tool that actually understands career development! The personalized roadmap 
                  gave me clear direction, and I'm now on track to reach my goal of becoming a product manager."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    EP
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Emily Park</p>
                    <p className="text-xs text-muted-foreground">Business Administration, Class of 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 4 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-4">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The job matching algorithm is incredibly accurate. Every opportunity it suggested 
                  aligned perfectly with my skills and interests. I accepted an offer from one of them!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    MR
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Marcus Robinson</p>
                    <p className="text-xs text-muted-foreground">Mechanical Engineering, Class of 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 5 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-5">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I love the application tracking feature! It kept me organized through dozens of applications. 
                  No more spreadsheets – everything I need is in one place."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    AK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Aisha Kumar</p>
                    <p className="text-xs text-muted-foreground">Marketing, Class of 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 6 */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all" data-testid="testimonial-card-6">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As an international student, navigating the US job market was overwhelming. Pathwise 
                  gave me the confidence and tools I needed. Highly recommend to every student!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    DL
                  </div>
                  <div>
                    <p className="font-semibold text-sm">David Liu</p>
                    <p className="text-xs text-muted-foreground">Information Systems, Class of 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Your Career Journey?
              </h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of students who are taking control of their career 
                development with Pathwise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 py-6 group"
                    data-testid="cta-button-signup"
                  >
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6 bg-background/10 hover:bg-background/20 border-primary-foreground/20"
                    data-testid="cta-button-login"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Students Choose Pathwise
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations based on advanced AI analysis 
                  of your skills and goals.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Comprehensive Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Everything you need in one place: resume analysis, roadmaps, 
                  job matching, and application tracking.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Portfolio Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Generate role-specific micro-projects to build your portfolio 
                  and stand out to employers.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Real Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Access real job postings, internships, and volunteer opportunities 
                  matched to your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Institutional Support</h3>
                <p className="text-sm text-muted-foreground">
                  Backed by your educational institution with dedicated support 
                  and resources.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your career development with achievement badges and 
                  activity dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Pathwise Institution Edition. 
                Empowering students to navigate their career paths.
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Pathwise LLC
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
