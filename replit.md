# Overview

Pathwise Institution Edition is a comprehensive career development platform designed for educational institutions. It helps students analyze resumes, create personalized career roadmaps, find job matches, and track application progress. The platform is a full-stack web application leveraging AI for intelligent career guidance and resume analysis, with capabilities to deploy as a native iOS app. Its business vision is to provide a unified, AI-powered solution for student career development, addressing market needs for personalized and effective career preparation.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

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