# Overview

Pathwise Institution Edition is a comprehensive career development platform designed for educational institutions. It helps students analyze resumes, create personalized career roadmaps, find job matches, and track application progress. The platform is a full-stack web application leveraging AI for intelligent career guidance and resume analysis, with capabilities to deploy as a native iOS app. Its business vision is to provide a unified, AI-powered solution for student career development, addressing market needs for personalized and effective career preparation.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Resume Upload and Analysis Workflow Redesign (November 2025)
- **Complete separation of resume upload from analysis execution** for clearer user experience
- **Resume Upload page** (`/resume-upload`):
  - **Simplified upload workflow**: Just upload resumes (PDF or plain text) without analysis parameters
  - Removed target role, industry, and companies inputs from upload form
  - Resume list management (view all uploaded resumes with active resume indicator)
  - Now embedded in Dashboard as a card for quick access
  - Upload completes immediately without triggering AI analysis
- **Resume Analysis page** (`/resume`):
  - **Two-step analysis process**: Display existing analysis OR trigger new analysis
  - Shows target context (role, industry, companies) for analyzed resumes
  - Dedicated form to set analysis parameters and trigger AI analysis (upcoming)
  - Automatically displays active resume's analysis results
  - Helpful empty state with link to upload page when no resume exists
  - Also embedded in Dashboard as a separate card
- **Dashboard Integration**:
  - Added "Resume Upload" card (cyan color scheme with Upload icon)
  - Renamed existing "Resume" card to "Resume Analysis" for clarity
  - Both features accessible as embedded views within Dashboard
  - Interview Prep card color changed to amber to avoid color conflicts
- **User workflow**: Upload resume → Switch to Analysis → Set targets → Run analysis → View results
- **Benefits**: Decoupled upload from analysis, users can upload multiple resumes and analyze them separately with different target parameters

## Job Analysis Persistence & Enhanced UI (November 2025)
- **Complete job analysis history tracking** with database persistence
- New database tables:
  - `job_analyses`: Stores full analysis results with match scores, skills analysis, and experience analysis
  - `cover_letters`: Stores generated cover letters linked to job analyses
  - Updated `tailored_resumes`: Added `job_analysis_id` foreign key for linking
- **Enhanced Skills Analysis UI**:
  - Now displays partial matches separately from strong matches and missing skills
  - Visual distinction with color-coded badges (green for strong, yellow for partial, red for missing)
- **Complete Experience Analysis section**:
  - Shows relevant experience items that match job requirements
  - Displays experience gaps that need to be addressed
  - Provides detailed explanations for both
- **Full data linkage**: Each job analysis generates an `analysisId` that connects to all associated tailored resumes and cover letters
- Backend API endpoints for retrieval:
  - `/api/jobs/analyses`: Get user's job analysis history
  - `/api/jobs/tailored-resumes`: Get tailored resume history
  - `/api/jobs/cover-letters`: Get cover letter history
- **Company name normalization**: Fixed extraction to properly handle both string and object formats from job scrapers

## Job Analysis Feature Migration (November 2025)
- **Replaced job search/browse workflow** with streamlined job analysis feature
- Users can now paste job posting URLs or manually enter job details (title, company, description, qualifications)
- New `/jobs` route displays Job Analysis page instead of job search
- Added three core AI-powered features for any job posting:
  1. **Match Analysis**: Get detailed compatibility assessment between resume and job posting
  2. **Resume Tailoring**: Generate job-specific optimized resume with downloadable DOCX
  3. **Cover Letter Generation**: AI-generated personalized cover letter
- Backend endpoints:
  - `/api/jobs/extract-from-url`: Basic job detail extraction from URLs
  - `/api/jobs/analyze-match`: AI match analysis and persistence
  - `/api/jobs/generate-cover-letter`: Cover letter generation with job analysis linking
  - `/api/jobs/tailor-resume`: Resume tailoring with job analysis linking
- Simplified UX: Single page with tabs for URL paste vs manual entry
- Kept existing job search infrastructure (JobsService, BeyondJobsService) for backward compatibility

## UI Cleanup and Simplification (October 2025)
- Removed "Download Resume" button from AI Copilot Tailored Resumes modal for cleaner UX
- Removed job search results count display (e.g., "350 jobs found") while keeping pagination navigation

## Admin Dashboard Redesign (October 2025)
- Redesigned institution admin dashboard with minimalistic single-page layout (removed Overview/Invitations tabs)
- Navigation components now display institution name instead of admin personal name
- Reorganized dashboard: Added Single/Bulk Invitation cards, moved AI Group Insights to main view
- Updated Total Accounts display to show "used/licensed" format (e.g., "3/50 students")
- Streamlined Student Management table (removed Last Activity and Verified columns)
- Added Pending Invitations section with cancel invitation functionality
- Restored resend verification emails for unverified users
- All mutations properly invalidate queries for real-time seat count updates

## Super Admin Dashboard Simplification (October 2025)
- Simplified super admin dashboard to single-page interface (removed tabs)
- Direct admin account creation with auto-generated passwords (no invitation tokens)
- Integrated Resend connector for sending welcome emails with login credentials
- Added institution delete functionality (soft delete with cascade)
- Admin onboarding flow: Create institution → Auto-create admin account → Send credentials via email
- Dashboard displays: institution name, admin email, license seats, expiration date, active users
- Super admins can now add and remove institutions from a single view

## Multi-Tenant Institution Support (October 2025)
- Added `institution_admin` and `super_admin` roles to user schema for institutional license management
- Created super admin dashboard at `/admin/dashboard` for institution onboarding
- Implemented institution onboarding API with Resend email welcome messages
- Added role-based routing: super_admin → `/admin/dashboard`, institution_admin → `/institution/dashboard`, student → `/dashboard`
- Bootstrap script (`scripts/bootstrapSuperAdmin.ts`) for creating super admin via environment variables
- Institution admin dashboard placeholder at `/institution/dashboard` (full features pending)

## Configuration Requirements
- **Resend Integration**: Now using Replit's Resend connector (connection-based, auto-managed API keys)
- **Super Admin Bootstrap**: Set `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, and `BOOTSTRAP_SUPERADMIN_SECRET` environment variables, then run `tsx scripts/bootstrapSuperAdmin.ts`

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
- **Registration**: Invite-only with email-based invitation tokens (7-day expiration).
- **Roles**: Multi-tier role system:
  - `super_admin`: Pathwise internal team for institution onboarding and license management
  - `institution_admin`: Manages institution users, sends student invitations, monitors license usage
  - `admin`: Legacy role for backward compatibility
  - `student`: End-users accessing career development features
- **Bootstrap**: Super admin users are created via environment variables (`SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, `BOOTSTRAP_SUPERADMIN_SECRET`)
- **Sessions**: Secure session management with JWT tokens and bcrypt password hashing.
- **Optional**: SSO (OIDC/SAML) and LTI 1.3 integration.

## Security Features
- **Password Security**: bcrypt hashing.
- **Session Management**: Single active session with token expiration.
- **File Security**: Pre-signed URLs for S3.
- **Input Validation**: Zod schemas.

## Monetization & Licensing
- **Multi-Tenant SaaS Model**: Institutional licensing with seat-based pricing
- **License Management**: Super admins configure licenses with start/end dates and student seat limits
- **Institution Onboarding**: Automated invitation flow where super admins create institutions and send email invitations to institution admins via Resend
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