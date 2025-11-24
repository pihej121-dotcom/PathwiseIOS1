import Shepherd from "shepherd.js";

export type TourStep = {
  id: string;
  title?: string;
  text: string;
  attachTo?: {
    element: string;
    on: string;
  };
  buttons?: Array<{
    text: string;
    action?: () => void;
    classes?: string;
  }>;
};

export type TourConfig = {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
};

// Common button configurations
const buttons = {
  back: {
    text: "Back",
    action: function (this: any) {
      this.back();
    },
  },
  next: {
    text: "Next",
    action: function (this: any) {
      this.next();
    },
  },
  finish: {
    text: "Finish",
    action: function (this: any) {
      this.complete();
    },
  },
  skip: {
    text: "Skip Tour",
    classes: "shepherd-button-secondary",
    action: function (this: any) {
      this.cancel();
    },
  },
};

// Dashboard Welcome Tour (FREE)
export const dashboardTour: TourConfig = {
  id: "dashboard-welcome",
  title: "Welcome to Your Career Dashboard",
  description: "Let's take a quick tour of your career development hub",
  steps: [
    {
      id: "welcome",
      title: "Welcome to Pathwise! 👋",
      text: "Your all-in-one career development platform. Let's explore the powerful tools at your fingertips!",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "resume-upload",
      title: "Resume Upload",
      text: "Start here! Upload and manage your resumes. This is the foundation for all AI-powered features on the platform.",
      attachTo: {
        element: "[data-testid='card-upload']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "resume-analysis",
      title: "Resume Analysis",
      text: "Get instant AI-powered feedback on your resume with detailed scoring and actionable improvement recommendations.",
      attachTo: {
        element: "[data-testid='card-resume']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "career-roadmap",
      title: "Career Roadmap",
      text: "Generate personalized career development plans with 30-day, 3-month, and 6-month actionable milestones tailored to your goals.",
      attachTo: {
        element: "[data-testid='card-roadmap']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "job-match",
      title: "Job Match Assistant",
      text: "Analyze job postings, get compatibility scores, tailor your resume, and generate custom cover letters—all powered by AI.",
      attachTo: {
        element: "[data-testid='card-jobs']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "projects",
      title: "Portfolio Projects",
      text: "Build your portfolio with AI-generated micro-projects designed to close skills gaps and showcase your abilities to employers.",
      attachTo: {
        element: "[data-testid='card-projects']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "compensation",
      title: "Compensation Insights",
      text: "Get personalized salary negotiation strategies based on your resume, target role, and market data. Negotiate with confidence!",
      attachTo: {
        element: "[data-testid='card-copilot']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "applications",
      title: "Application Tracker",
      text: "Organize and track all your job applications in one place. Monitor status, add notes, and stay on top of your job search.",
      attachTo: {
        element: "[data-testid='card-applications']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "interview-prep",
      title: "Interview Prep",
      text: "Practice with AI-generated interview questions tailored to your applications. Get tips, resources, and ace your interviews!",
      attachTo: {
        element: "[data-testid='card-interview']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Resume Analysis Tour (FREE)
export const resumeAnalysisTour: TourConfig = {
  id: "resume-analysis",
  title: "Resume Analysis Guide",
  description: "Learn how to analyze and improve your resume with AI",
  steps: [
    {
      id: "overall-score",
      title: "Your Resume Score",
      text: "This is your overall Resume Match Score. It reflects how well your resume aligns with your target role. Upload a resume and set your target to see your score!",
      attachTo: {
        element: "[data-testid='overall-score']",
        on: "bottom",
      },
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "target-role-btn",
      title: "Set Target Parameters",
      text: "Click here to set or update your target role, industry, and companies. This helps our AI analyze your resume against specific job requirements.",
      attachTo: {
        element: "[data-testid='button-show-target-form']",
        on: "left",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "category-scores",
      title: "Category Breakdown",
      text: "Review detailed scores across different categories like Skills, Experience, Education, and Keywords. Each category shows specific strengths and areas for improvement.",
      attachTo: {
        element: "[data-testid='card-skills']",
        on: "right",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "section-details",
      title: "Detailed Recommendations",
      text: "Click any category to see specific feedback, identified gaps, and actionable improvement recommendations with helpful resources.",
      attachTo: {
        element: "[data-testid='section-details']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Salary Negotiator Tour (PAID)
export const salaryNegotiatorTour: TourConfig = {
  id: "salary-negotiator",
  title: "AI Salary Negotiation Guide",
  description: "Learn how to get personalized salary negotiation strategies",
  steps: [
    {
      id: "negotiator-intro",
      title: "AI Salary Negotiator",
      text: "Get data-driven salary negotiation strategies based on your resume, experience, and target role. Our AI analyzes your qualifications to help you negotiate with confidence!",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "salary-form",
      title: "Enter Your Details",
      text: "Fill in your current salary (optional), target salary, job role, location, and years of experience. The AI will use this along with your resume to create a personalized strategy.",
      attachTo: {
        element: "[data-testid='salary-form']",
        on: "right",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "generate-strategy",
      title: "Generate Strategy",
      text: "Click the generate button to receive a comprehensive negotiation strategy including: market data, talking points, leverage areas, and negotiation tactics tailored to your situation.",
      attachTo: {
        element: "[data-testid='button-generate-salary-strategy']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Career Roadmap Tour (PAID)
export const careerRoadmapTour: TourConfig = {
  id: "career-roadmap",
  title: "Career Roadmap Guide",
  description: "Learn how to use your personalized career development plan",
  steps: [
    {
      id: "roadmap-intro",
      title: "Your Personalized Roadmap",
      text: "Career Roadmaps break down your career goals into actionable 30-day, 3-month, and 6-month plans. Each plan includes specific tasks, resources, and milestones.",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "generate-roadmap",
      title: "Generate Your Roadmap",
      text: "Click here to generate a personalized roadmap based on your resume analysis and target role. Our AI creates a custom plan tailored to your needs.",
      attachTo: {
        element: "[data-testid='generate-roadmap-empty']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "phase-tabs",
      title: "Roadmap Phases",
      text: "Navigate between 30-day, 3-month, and 6-month phases. Each phase builds on the previous one with increasingly advanced goals.",
      attachTo: {
        element: "[data-testid='phase-30']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "tasks-checklist",
      title: "Tasks & Progress",
      text: "Check off tasks as you complete them. Each task includes specific actions, resources, and deadlines to keep you on track.",
      attachTo: {
        element: "[data-testid='roadmap-tasks-list']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Job Analysis Tour (PAID)
export const jobAnalysisTour: TourConfig = {
  id: "job-analysis",
  title: "Job Analysis Assistant Guide",
  description: "Analyze jobs and tailor your application materials",
  steps: [
    {
      id: "analysis-intro",
      title: "Job Analysis Assistant",
      text: "Paste a job URL or enter job details manually to get AI-powered match analysis, resume tailoring, and cover letter generation. All in one place!",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "job-details",
      title: "Enter Job Details",
      text: "Fill in the job title, company, and description. You can paste a URL to auto-extract details, or enter them manually for complete control.",
      attachTo: {
        element: "[data-testid='input-job-title']",
        on: "right",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "analyze-button",
      title: "Get Match Analysis",
      text: "Click here to get a detailed compatibility analysis between your resume and the job. See skills match, experience alignment, and improvement suggestions.",
      attachTo: {
        element: "[data-testid='button-analyze']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "tailor-resume",
      title: "Tailor Your Resume",
      text: "Generate a job-specific resume optimized for this position. Our AI highlights relevant experience and skills that match the job requirements.",
      attachTo: {
        element: "[data-testid='button-tailor-resume']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "cover-letter",
      title: "Generate Cover Letter",
      text: "Create a personalized cover letter that emphasizes your relevant qualifications and explains why you're a great fit for this specific role.",
      attachTo: {
        element: "[data-testid='button-generate-cover-letter']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Micro-Projects Tour (PAID)
export const microProjectsTour: TourConfig = {
  id: "micro-projects",
  title: "Micro-Projects Guide",
  description: "Build portfolio projects to close skills gaps",
  steps: [
    {
      id: "projects-intro",
      title: "Build Your Portfolio",
      text: "Micro-Projects are small, focused projects designed to close skills gaps and create portfolio-worthy work. Each project takes 1-2 weeks to complete.",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "generate-form",
      title: "Generate Projects",
      text: "Enter your target role, select how many projects you want, and choose a difficulty level. Our AI will generate personalized projects tailored to your career goals.",
      attachTo: {
        element: "[data-testid='input-target-role']",
        on: "right",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "generate-button",
      title: "Create Projects",
      text: "Click here to generate projects based on your inputs. Each project includes detailed instructions, resources, and skills you'll gain.",
      attachTo: {
        element: "[data-testid='button-generate-projects']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "project-list",
      title: "Your Projects",
      text: "View all your generated projects here. Each card shows the title, description, difficulty level, estimated hours, skills gained, and helpful resources.",
      attachTo: {
        element: "[data-testid='projects-section-title']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Applications Tracker Tour (PAID)
export const applicationsTour: TourConfig = {
  id: "applications-tracker",
  title: "Application Tracking Guide",
  description: "Organize and track your job applications",
  steps: [
    {
      id: "tracker-intro",
      title: "Application Tracker",
      text: "Keep all your job applications organized in one place. Track status, add notes, and monitor your job search progress with detailed stats.",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "application-stats",
      title: "Track Your Stats",
      text: "See your total applications, how many are at each stage (Applied, Interviewed, Offered, Rejected). Use these stats to understand your job search performance.",
      attachTo: {
        element: "[data-testid='total-applications']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "add-application",
      title: "Add New Applications",
      text: "Click here to add a new job application. Track the company, position, date applied, and add any relevant notes.",
      attachTo: {
        element: "[data-testid='button-add-application']",
        on: "left",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "status-filter",
      title: "Filter by Status",
      text: "Use this dropdown to filter applications by status. Focus on active applications or review your rejected ones to learn and improve.",
      attachTo: {
        element: "[data-testid='status-filter']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Interview Prep Tour (PAID)
export const interviewPrepTour: TourConfig = {
  id: "interview-prep",
  title: "Interview Prep Assistant Guide",
  description: "Practice with AI-generated interview questions",
  steps: [
    {
      id: "prep-intro",
      title: "Interview Prep Assistant",
      text: "Practice interviews with AI-generated questions tailored to your job applications. Get question-specific tips and curated resources to ace your interviews!",
      buttons: [buttons.skip, buttons.next],
    },
    {
      id: "select-application",
      title: "Choose Your Application",
      text: "Select a job application from your tracker. The AI will generate interview questions based on that specific role and company.",
      attachTo: {
        element: "[data-testid='select-application']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "question-category",
      title: "Filter by Category",
      text: "Focus on specific question types: Technical, Behavioral, or Role-Specific. Practice the areas you need most help with.",
      attachTo: {
        element: "[data-testid='select-question-category']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "generate-questions",
      title: "Generate Questions",
      text: "Click here to generate interview questions. Each question includes helpful tips to structure your answer and resources to learn more.",
      attachTo: {
        element: "[data-testid='button-generate-questions']",
        on: "top",
      },
      buttons: [buttons.back, buttons.skip, buttons.next],
    },
    {
      id: "resources-tab",
      title: "Learning Resources",
      text: "Switch to the Resources tab to access curated interview prep materials, including guides, videos, and practice platforms.",
      attachTo: {
        element: "[data-testid='tab-resources']",
        on: "bottom",
      },
      buttons: [buttons.back, buttons.skip, buttons.finish],
    },
  ],
};

// Export all tours
export const tours: Record<string, TourConfig> = {
  "dashboard-welcome": dashboardTour,
  "resume-analysis": resumeAnalysisTour,
  "salary-negotiator": salaryNegotiatorTour,
  "career-roadmap": careerRoadmapTour,
  "job-analysis": jobAnalysisTour,
  "micro-projects": microProjectsTour,
  "applications-tracker": applicationsTour,
  "interview-prep": interviewPrepTour,
};
