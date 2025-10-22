# Overview

Pathwise Institution Edition is a comprehensive career development platform designed for educational institutions. It helps students analyze resumes, create personalized career roadmaps, find job matches, and track application progress. The platform is a full-stack web application leveraging AI for intelligent career guidance and resume analysis, with capabilities to deploy as a native iOS app. Its business vision is to provide a unified, AI-powered solution for student career development, addressing market needs for personalized and effective career preparation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI/UX**: shadcn/ui components (built on Radix UI) for accessibility, styled with Tailwind CSS for theming and dark mode.
- **State Management**: TanStack React Query for server state.
- **Routing**: Wouter for client-side routing.
- **Forms**: React Hook Form with Zod validation.
- **UI/UX Decisions**: All features are embedded within a single-page, tabbed dashboard experience to eliminate navigation friction and provide instant content switching. A professional landing page serves as the entry point for unauthenticated users. User settings and profile management are handled via a dialog with form validation.

## Backend Architecture
- **Runtime**: Node.js with Express.js (TypeScript).
- **API**: RESTful API endpoints with JSON responses.
- **Authentication**: JWT-based sessions with bcrypt hashing, single session per user, and custom middleware for protected routes.
- **AI Integration**: Server-side processing using OpenAI GPT-5 for resume analysis, career guidance, roadmap generation, and job matching insights.
- **Micro-Projects Feature**: AI-generates portfolio-ready micro-projects tailored to specific career roles, including deliverables, resource links, and skills gained.

## Database Design
- **Database**: PostgreSQL (Neon serverless).
- **ORM**: Drizzle ORM for type-safe operations.
- **Schema**: Comprehensive schema for users, sessions, resumes, roadmaps, job matches, applications, and activities, including `resume_analysis_history` for tracking.
- **Migrations**: Drizzle Kit.

## File Storage
- **Primary**: AWS S3 with pre-signed URLs.
- **PDF Processing**: pdf-parse for text extraction, with AWS Textract as a fallback.
- **Upload Interface**: Uppy.js.

## Authentication & Authorization
- **Registration**: Invite-only or domain allowlist with email verification.
- **Roles**: Student and admin with distinct permission levels.
- **Sessions**: Secure session management with token refresh.
- **Optional**: SSO (OIDC/SAML) and LTI 1.3 integration.

## Security Features
- **Password Security**: bcrypt hashing.
- **Session Management**: Single active session with token expiration.
- **File Security**: Pre-signed URLs for S3.
- **Input Validation**: Zod schemas.

## Monetization
- **Resume Analysis Paywall**: Restricts sub-score details and improvement recommendations for free users, requiring a Pro subscription ($10/month) via Stripe checkout. Landing page displays three-tier subscription plans (Institutional, Free, Pro).

## Mobile Integration
- **iOS Native App**: Capacitor iOS wrapper (`com.pathwise.app`) for native deployment, supporting all web features.

# External Dependencies

## Core Services
- **Database**: Neon PostgreSQL.
- **File Storage**: AWS S3.
- **AI Processing**: OpenAI API (GPT-5).
- **Email**: Resend (transactional, magic links).

## Optional Integrations
- **OCR Fallback**: AWS Textract.
- **Job/Opportunity Data**:
    - Adzuna API (job search).
    - CoreSignal API (internships).
    - GitHub SimplifyJobs (tech internships).
    - VolunteerConnector (volunteer opportunities).
- **Authentication**: OIDC/SAML providers for SSO.
- **LMS Integration**: LTI 1.3.

## Development Tools
- **Build System**: Vite.
- **Deployment**: Replit Autoscale.
- **Component Library**: Radix UI (primitives).
- **Icons**: Lucide React.
- **Styling**: Tailwind CSS.