var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  achievementsRelations: () => achievementsRelations,
  activities: () => activities,
  activitiesRelations: () => activitiesRelations,
  applicationStatusEnum: () => applicationStatusEnum,
  applications: () => applications,
  applicationsRelations: () => applicationsRelations,
  atomicRoadmapSchema: () => atomicRoadmapSchema,
  atomicTaskSchema: () => atomicTaskSchema,
  emailVerifications: () => emailVerifications,
  forgotPasswordSchema: () => forgotPasswordSchema,
  getCompetitivenessBand: () => getCompetitivenessBand,
  insertApplicationSchema: () => insertApplicationSchema,
  insertEmailVerificationSchema: () => insertEmailVerificationSchema,
  insertInstitutionSchema: () => insertInstitutionSchema,
  insertInvitationSchema: () => insertInvitationSchema,
  insertJobMatchSchema: () => insertJobMatchSchema,
  insertLicenseSchema: () => insertLicenseSchema,
  insertMicroProjectSchema: () => insertMicroProjectSchema,
  insertOpportunitySchema: () => insertOpportunitySchema,
  insertPasswordResetTokenSchema: () => insertPasswordResetTokenSchema,
  insertPortfolioArtifactSchema: () => insertPortfolioArtifactSchema,
  insertProjectCompletionSchema: () => insertProjectCompletionSchema,
  insertPromoCodeSchema: () => insertPromoCodeSchema,
  insertResumeSchema: () => insertResumeSchema,
  insertRoadmapSchema: () => insertRoadmapSchema,
  insertRoadmapSubsectionSchema: () => insertRoadmapSubsectionSchema,
  insertSavedOpportunitySchema: () => insertSavedOpportunitySchema,
  insertSkillGapAnalysisSchema: () => insertSkillGapAnalysisSchema,
  insertTourCompletionSchema: () => insertTourCompletionSchema,
  insertUserSchema: () => insertUserSchema,
  institutions: () => institutions,
  institutionsRelations: () => institutionsRelations,
  invitations: () => invitations,
  invitationsRelations: () => invitationsRelations,
  inviteStatusEnum: () => inviteStatusEnum,
  inviteUserSchema: () => inviteUserSchema,
  jobMatchAnalysisSchema: () => jobMatchAnalysisSchema,
  jobMatches: () => jobMatches,
  jobMatchesRelations: () => jobMatchesRelations,
  licenseTypeEnum: () => licenseTypeEnum,
  licenses: () => licenses,
  licensesRelations: () => licensesRelations,
  loginSchema: () => loginSchema,
  microProjects: () => microProjects,
  opportunities: () => opportunities,
  opportunitiesRelations: () => opportunitiesRelations,
  opportunityTypeEnum: () => opportunityTypeEnum,
  passwordResetTokens: () => passwordResetTokens,
  portfolioArtifacts: () => portfolioArtifacts,
  priorityEnum: () => priorityEnum,
  projectCompletions: () => projectCompletions,
  promoCodes: () => promoCodes,
  registerSchema: () => registerSchema,
  resetPasswordSchema: () => resetPasswordSchema,
  resources: () => resources,
  resumes: () => resumes,
  resumesRelations: () => resumesRelations,
  roadmapPhaseEnum: () => roadmapPhaseEnum,
  roadmapSubsectionSchema: () => roadmapSubsectionSchema,
  roadmapSubsections: () => roadmapSubsections,
  roadmapSubsectionsRelations: () => roadmapSubsectionsRelations,
  roadmaps: () => roadmaps,
  roadmapsRelations: () => roadmapsRelations,
  roleEnum: () => roleEnum,
  savedOpportunities: () => savedOpportunities,
  savedOpportunitiesRelations: () => savedOpportunitiesRelations,
  sessions: () => sessions,
  sessionsRelations: () => sessionsRelations,
  skillGapAnalyses: () => skillGapAnalyses,
  subscriptionStatusEnum: () => subscriptionStatusEnum,
  subscriptionTierEnum: () => subscriptionTierEnum,
  tailoredResumes: () => tailoredResumes,
  tailoredResumesRelations: () => tailoredResumesRelations,
  tourCompletions: () => tourCompletions,
  tourCompletionsRelations: () => tourCompletionsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  verifyEmailSchema: () => verifyEmailSchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
function getCompetitivenessBand(score) {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Weak";
  return "Poor";
}
var roleEnum, applicationStatusEnum, roadmapPhaseEnum, priorityEnum, licenseTypeEnum, inviteStatusEnum, opportunityTypeEnum, subscriptionTierEnum, subscriptionStatusEnum, institutions, licenses, invitations, emailVerifications, passwordResetTokens, users, sessions, promoCodes, resumes, roadmaps, roadmapSubsections, jobMatches, tailoredResumes, applications, achievements, activities, resources, skillGapAnalyses, microProjects, projectCompletions, portfolioArtifacts, opportunities, savedOpportunities, tourCompletions, institutionsRelations, licensesRelations, invitationsRelations, usersRelations, sessionsRelations, resumesRelations, roadmapsRelations, roadmapSubsectionsRelations, jobMatchesRelations, tailoredResumesRelations, applicationsRelations, achievementsRelations, opportunitiesRelations, savedOpportunitiesRelations, tourCompletionsRelations, activitiesRelations, atomicTaskSchema, roadmapSubsectionSchema, atomicRoadmapSchema, insertInstitutionSchema, insertLicenseSchema, insertInvitationSchema, insertEmailVerificationSchema, insertPasswordResetTokenSchema, insertUserSchema, insertPromoCodeSchema, insertResumeSchema, insertRoadmapSchema, insertRoadmapSubsectionSchema, insertJobMatchSchema, insertApplicationSchema, insertSkillGapAnalysisSchema, insertMicroProjectSchema, insertProjectCompletionSchema, insertPortfolioArtifactSchema, loginSchema, registerSchema, inviteUserSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema, jobMatchAnalysisSchema, insertOpportunitySchema, insertSavedOpportunitySchema, insertTourCompletionSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    roleEnum = pgEnum("role", ["student", "admin", "super_admin"]);
    applicationStatusEnum = pgEnum("application_status", ["applied", "interviewed", "rejected", "offered"]);
    roadmapPhaseEnum = pgEnum("roadmap_phase", ["30_days", "3_months", "6_months"]);
    priorityEnum = pgEnum("priority", ["high", "medium", "low"]);
    licenseTypeEnum = pgEnum("license_type", ["per_student", "site"]);
    inviteStatusEnum = pgEnum("invite_status", ["pending", "claimed", "expired"]);
    opportunityTypeEnum = pgEnum("opportunity_type", ["volunteer", "internship", "hackathon", "competition", "apprenticeship", "externship"]);
    subscriptionTierEnum = pgEnum("subscription_tier", ["free", "paid", "institutional"]);
    subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "past_due", "trialing", "incomplete"]);
    institutions = pgTable("institutions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      domain: text("domain").unique(),
      // For domain allowlist
      contactEmail: text("contact_email").notNull(),
      contactName: text("contact_name").notNull(),
      logoUrl: text("logo_url"),
      primaryColor: text("primary_color"),
      secondaryColor: text("secondary_color"),
      customBranding: jsonb("custom_branding"),
      allowedDomains: text("allowed_domains").array(),
      // Multiple email domains
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    licenses = pgTable("licenses", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      institutionId: varchar("institution_id").notNull().references(() => institutions.id, { onDelete: "cascade" }),
      licenseType: licenseTypeEnum("license_type").notNull(),
      licensedSeats: integer("licensed_seats"),
      // null for site licenses
      usedSeats: integer("used_seats").notNull().default(0),
      startDate: timestamp("start_date").notNull(),
      endDate: timestamp("end_date").notNull(),
      brandingEnabled: boolean("branding_enabled").notNull().default(false),
      supportLevel: text("support_level").default("standard"),
      // standard, premium, enterprise
      isActive: boolean("is_active").notNull().default(true),
      metadata: jsonb("metadata"),
      // Additional license metadata
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    invitations = pgTable("invitations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      institutionId: varchar("institution_id").notNull().references(() => institutions.id, { onDelete: "cascade" }),
      email: text("email").notNull(),
      role: roleEnum("role").notNull().default("student"),
      invitedBy: varchar("invited_by").notNull().references(() => users.id),
      token: text("token").notNull().unique(),
      status: inviteStatusEnum("status").notNull().default("pending"),
      claimedBy: varchar("claimed_by").references(() => users.id),
      expiresAt: timestamp("expires_at").notNull(),
      claimedAt: timestamp("claimed_at"),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    emailVerifications = pgTable("email_verifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull(),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      isUsed: boolean("is_used").notNull().default(false),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    passwordResetTokens = pgTable("password_reset_tokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      isUsed: boolean("is_used").notNull().default(false),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      institutionId: varchar("institution_id").references(() => institutions.id, { onDelete: "cascade" }),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      role: roleEnum("role").notNull().default("student"),
      isVerified: boolean("is_verified").notNull().default(false),
      isActive: boolean("is_active").notNull().default(true),
      lastActiveAt: timestamp("last_active_at"),
      school: text("school"),
      major: text("major"),
      gradYear: integer("grad_year"),
      targetRole: text("target_role"),
      industries: text("industries").array(),
      targetCompanies: text("target_companies").array(),
      location: text("location"),
      remoteOk: boolean("remote_ok").default(false),
      // Subscription fields
      subscriptionTier: subscriptionTierEnum("subscription_tier").notNull().default("free"),
      subscriptionStatus: subscriptionStatusEnum("subscription_status"),
      stripeCustomerId: text("stripe_customer_id"),
      stripeSubscriptionId: text("stripe_subscription_id"),
      subscriptionEndsAt: timestamp("subscription_ends_at"),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    sessions = pgTable("sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    promoCodes = pgTable("promo_codes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      code: text("code").notNull().unique(),
      type: text("type").notNull().default("free_paid_tier"),
      // Type of benefit: "free_paid_tier" or "percentage_discount"
      discountPercentage: integer("discount_percentage"),
      // For percentage_discount type (e.g., 50 for 50% off)
      maxUses: integer("max_uses"),
      // null for unlimited
      currentUses: integer("current_uses").notNull().default(0),
      expiresAt: timestamp("expires_at"),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    resumes = pgTable("resumes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      fileName: text("file_name").notNull(),
      filePath: text("file_path").notNull(),
      extractedText: text("extracted_text"),
      rmsScore: integer("rms_score"),
      skillsScore: integer("skills_score"),
      experienceScore: integer("experience_score"),
      keywordsScore: integer("keywords_score"),
      educationScore: integer("education_score"),
      certificationsScore: integer("certifications_score"),
      gaps: jsonb("gaps"),
      // Array of gap objects with priority, impact, rationale, resources
      overallInsights: jsonb("overall_insights"),
      // Overall analysis insights
      sectionAnalysis: jsonb("section_analysis"),
      // Detailed section-by-section analysis
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    roadmaps = pgTable("roadmaps", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      phase: roadmapPhaseEnum("phase").notNull(),
      title: text("title").notNull(),
      description: text("description"),
      actions: jsonb("actions"),
      // Array of action objects
      subsections: jsonb("subsections"),
      // Array of subsection objects with completion tracking
      progress: integer("progress").default(0),
      // 0-100
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    roadmapSubsections = pgTable("roadmap_subsections", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      roadmapId: varchar("roadmap_id").notNull().references(() => roadmaps.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      subsectionIndex: integer("subsection_index").notNull(),
      title: text("title").notNull(),
      description: text("description"),
      tasks: jsonb("tasks"),
      // Array of task objects
      isCompleted: boolean("is_completed").default(false),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    jobMatches = pgTable("job_matches", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      externalJobId: text("external_job_id").notNull(),
      title: text("title").notNull(),
      company: text("company").notNull(),
      location: text("location"),
      description: text("description"),
      requirements: text("requirements"),
      salary: text("salary"),
      compatibilityScore: integer("compatibility_score"),
      // 0-100
      matchReasons: text("match_reasons").array(),
      skillsGaps: text("skills_gaps").array(),
      resourceLinks: jsonb("resource_links"),
      // Array of resource objects
      source: text("source").default("adzuna"),
      // adzuna, coresignal, usajobs
      isBookmarked: boolean("is_bookmarked").default(false),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    tailoredResumes = pgTable("tailored_resumes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      baseResumeId: varchar("base_resume_id").notNull().references(() => resumes.id),
      jobMatchId: varchar("job_match_id").notNull().references(() => jobMatches.id),
      tailoredContent: text("tailored_content").notNull(),
      diffJson: jsonb("diff_json"),
      // Source map of all edits
      jobSpecificScore: integer("job_specific_score"),
      // 0-100
      keywordsCovered: text("keywords_covered").array(),
      remainingGaps: jsonb("remaining_gaps"),
      docxPath: text("docx_path"),
      pdfPath: text("pdf_path"),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    applications = pgTable("applications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      jobMatchId: varchar("job_match_id").references(() => jobMatches.id),
      tailoredResumeId: varchar("tailored_resume_id").references(() => tailoredResumes.id),
      company: text("company").notNull(),
      position: text("position").notNull(),
      status: applicationStatusEnum("status").notNull().default("applied"),
      appliedDate: timestamp("applied_date").notNull().default(sql`now()`),
      responseDate: timestamp("response_date"),
      notes: text("notes"),
      attachments: text("attachments").array(),
      // File paths
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    achievements = pgTable("achievements", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      title: text("title").notNull(),
      description: text("description"),
      icon: text("icon"),
      unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`)
    });
    activities = pgTable("activities", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      type: text("type").notNull(),
      // completed_task, earned_achievement, etc.
      title: text("title").notNull(),
      description: text("description"),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    resources = pgTable("resources", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      provider: text("provider").notNull(),
      url: text("url").notNull(),
      cost: text("cost"),
      skillCategories: text("skill_categories").array(),
      relevanceScore: integer("relevance_score"),
      // 0-100
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    skillGapAnalyses = pgTable("skill_gap_analyses", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      resumeId: varchar("resume_id").references(() => resumes.id),
      jobMatchId: varchar("job_match_id").references(() => jobMatches.id),
      targetRole: text("target_role"),
      targetCompany: text("target_company"),
      missingSkills: text("missing_skills").array().notNull(),
      skillCategories: text("skill_categories").array(),
      // technical, soft, domain-specific
      priorityLevel: text("priority_level").notNull().default("medium"),
      // high, medium, low
      analysisSource: text("analysis_source").notNull(),
      // resume-only, job-match, manual
      createdAt: timestamp("created_at").notNull().default(sql`now()`)
    });
    microProjects = pgTable("micro_projects", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      // Resume-friendly title
      description: text("description").notNull(),
      // 2-3 sentence project summary
      targetRole: text("target_role").notNull(),
      // e.g., "Data Scientist", "Product Manager"
      targetSkill: text("target_skill"),
      // Optional: specific skill this addresses
      skillCategory: text("skill_category"),
      // technical, soft, domain-specific
      difficultyLevel: text("difficulty_level").notNull().default("intermediate"),
      // beginner, intermediate, advanced
      estimatedHours: integer("estimated_hours").notNull().default(20),
      // Hours to complete (typically 10-40 for 1-2 weeks)
      projectType: text("project_type").notNull(),
      // data-analysis, coding, design, writing, research
      // Step-by-step deliverables with embedded resource links
      // Format: [{stepNumber, instruction, resourceLinks: [{title, url, type}]}]
      deliverables: jsonb("deliverables").notNull(),
      // Actionable steps with resource links
      skillsGained: text("skills_gained").array().notNull(),
      // Skills/tools demonstrated (e.g., "Python", "Pandas", "Scikit-learn")
      relevanceToRole: text("relevance_to_role").notNull(),
      // Why this matters for the target role
      // Legacy fields for backward compatibility
      datasetUrl: text("dataset_url"),
      templateUrl: text("template_url"),
      repositoryUrl: text("repository_url"),
      tutorialUrl: text("tutorial_url"),
      instructions: jsonb("instructions"),
      // Deprecated in favor of deliverables
      evaluationCriteria: text("evaluation_criteria").array(),
      // Portfolio integration  
      portfolioTemplate: text("portfolio_template"),
      // How to present the artifact
      exampleArtifacts: text("example_artifacts").array(),
      // Links to example completions
      // Metadata
      tags: text("tags").array(),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    projectCompletions = pgTable("project_completions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      projectId: varchar("project_id").notNull().references(() => microProjects.id, { onDelete: "cascade" }),
      skillGapAnalysisId: varchar("skill_gap_analysis_id").references(() => skillGapAnalyses.id),
      status: text("status").notNull().default("not_started"),
      // not_started, in_progress, completed, submitted
      progressPercentage: integer("progress_percentage").notNull().default(0),
      // 0-100
      timeSpent: integer("time_spent").default(0),
      // in minutes
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      submittedAt: timestamp("submitted_at"),
      // Completion artifacts
      artifactUrls: text("artifact_urls").array(),
      // Links to completed work
      reflectionNotes: text("reflection_notes"),
      // What the student learned
      selfAssessment: integer("self_assessment"),
      // 1-5 rating
      skillImprovement: text("skill_improvement"),
      // How it addressed the skill gap
      nextSteps: text("next_steps"),
      // What to do next
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    portfolioArtifacts = pgTable("portfolio_artifacts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      completionId: varchar("completion_id").notNull().references(() => projectCompletions.id, { onDelete: "cascade" }),
      title: text("title").notNull(),
      description: text("description"),
      artifactType: text("artifact_type").notNull(),
      // code, analysis, design, report, dashboard
      fileUrl: text("file_url"),
      previewUrl: text("preview_url"),
      // Screenshot or preview image
      githubUrl: text("github_url"),
      liveUrl: text("live_url"),
      // Portfolio presentation
      displayOrder: integer("display_order").default(0),
      isPublic: boolean("is_public").notNull().default(false),
      isFeatured: boolean("is_featured").notNull().default(false),
      tags: text("tags").array(),
      technologiesUsed: text("technologies_used").array(),
      skillsDemonstrated: text("skills_demonstrated").array(),
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    opportunities = pgTable("opportunities", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      description: text("description").notNull(),
      organization: text("organization").notNull(),
      type: opportunityTypeEnum("type").notNull(),
      // volunteer, internship, hackathon, competition, apprenticeship, externship
      location: text("location"),
      isRemote: boolean("is_remote").default(false),
      compensation: text("compensation"),
      // 'paid', 'unpaid', 'stipend', 'academic-credit'
      requirements: text("requirements").array(),
      skills: text("skills").array(),
      applicationUrl: text("application_url"),
      contactEmail: text("contact_email"),
      deadline: timestamp("deadline"),
      postedDate: timestamp("posted_date").notNull().default(sql`now()`),
      source: text("source").notNull(),
      // API source identifier
      externalId: text("external_id"),
      // Original ID from source API
      isActive: boolean("is_active").default(true),
      tags: text("tags").array(),
      estimatedHours: integer("estimated_hours"),
      duration: text("duration"),
      // 'semester', 'summer', 'ongoing', 'one-time'
      createdAt: timestamp("created_at").notNull().default(sql`now()`),
      updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
    });
    savedOpportunities = pgTable("saved_opportunities", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      opportunityId: varchar("opportunity_id").notNull().references(() => opportunities.id, { onDelete: "cascade" }),
      savedAt: timestamp("saved_at").notNull().default(sql`now()`),
      notes: text("notes")
    });
    tourCompletions = pgTable("tour_completions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id),
      tourId: text("tour_id").notNull(),
      completedAt: timestamp("completed_at").notNull().default(sql`now()`)
    });
    institutionsRelations = relations(institutions, ({ many, one }) => ({
      licenses: many(licenses),
      users: many(users),
      invitations: many(invitations)
    }));
    licensesRelations = relations(licenses, ({ one }) => ({
      institution: one(institutions, { fields: [licenses.institutionId], references: [institutions.id] })
    }));
    invitationsRelations = relations(invitations, ({ one }) => ({
      institution: one(institutions, { fields: [invitations.institutionId], references: [institutions.id] }),
      invitedByUser: one(users, { fields: [invitations.invitedBy], references: [users.id] }),
      claimedByUser: one(users, { fields: [invitations.claimedBy], references: [users.id] })
    }));
    usersRelations = relations(users, ({ many, one }) => ({
      institution: one(institutions, { fields: [users.institutionId], references: [institutions.id] }),
      sessions: many(sessions),
      resumes: many(resumes),
      roadmaps: many(roadmaps),
      roadmapSubsections: many(roadmapSubsections),
      jobMatches: many(jobMatches),
      applications: many(applications),
      achievements: many(achievements),
      activities: many(activities),
      savedOpportunities: many(savedOpportunities),
      tourCompletions: many(tourCompletions),
      sentInvitations: many(invitations, { relationName: "invitedBy" }),
      claimedInvitations: many(invitations, { relationName: "claimedBy" })
    }));
    sessionsRelations = relations(sessions, ({ one }) => ({
      user: one(users, { fields: [sessions.userId], references: [users.id] })
    }));
    resumesRelations = relations(resumes, ({ one, many }) => ({
      user: one(users, { fields: [resumes.userId], references: [users.id] }),
      tailoredResumes: many(tailoredResumes)
    }));
    roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
      user: one(users, { fields: [roadmaps.userId], references: [users.id] }),
      subsections: many(roadmapSubsections)
    }));
    roadmapSubsectionsRelations = relations(roadmapSubsections, ({ one }) => ({
      roadmap: one(roadmaps, { fields: [roadmapSubsections.roadmapId], references: [roadmaps.id] }),
      user: one(users, { fields: [roadmapSubsections.userId], references: [users.id] })
    }));
    jobMatchesRelations = relations(jobMatches, ({ one, many }) => ({
      user: one(users, { fields: [jobMatches.userId], references: [users.id] }),
      tailoredResumes: many(tailoredResumes),
      applications: many(applications)
    }));
    tailoredResumesRelations = relations(tailoredResumes, ({ one, many }) => ({
      user: one(users, { fields: [tailoredResumes.userId], references: [users.id] }),
      baseResume: one(resumes, { fields: [tailoredResumes.baseResumeId], references: [resumes.id] }),
      jobMatch: one(jobMatches, { fields: [tailoredResumes.jobMatchId], references: [jobMatches.id] }),
      applications: many(applications)
    }));
    applicationsRelations = relations(applications, ({ one }) => ({
      user: one(users, { fields: [applications.userId], references: [users.id] }),
      jobMatch: one(jobMatches, { fields: [applications.jobMatchId], references: [jobMatches.id] }),
      tailoredResume: one(tailoredResumes, { fields: [applications.tailoredResumeId], references: [tailoredResumes.id] })
    }));
    achievementsRelations = relations(achievements, ({ one }) => ({
      user: one(users, { fields: [achievements.userId], references: [users.id] })
    }));
    opportunitiesRelations = relations(opportunities, ({ many }) => ({
      savedByUsers: many(savedOpportunities)
    }));
    savedOpportunitiesRelations = relations(savedOpportunities, ({ one }) => ({
      user: one(users, { fields: [savedOpportunities.userId], references: [users.id] }),
      opportunity: one(opportunities, { fields: [savedOpportunities.opportunityId], references: [opportunities.id] })
    }));
    tourCompletionsRelations = relations(tourCompletions, ({ one }) => ({
      user: one(users, { fields: [tourCompletions.userId], references: [users.id] })
    }));
    activitiesRelations = relations(activities, ({ one }) => ({
      user: one(users, { fields: [activities.userId], references: [users.id] })
    }));
    atomicTaskSchema = z.object({
      id: z.string().uuid().or(z.literal("")).transform((val) => val || crypto.randomUUID()),
      // Auto-generate if missing
      title: z.string().min(5).max(60),
      // Enforce short, actionable titles
      description: z.string().min(10).max(140),
      // Twitter-length descriptions
      estimatedMinutes: z.number().min(20).max(60),
      // Bite-sized time commitment
      priority: z.enum(["high", "medium", "low"]),
      definitionOfDone: z.array(z.string().max(80)).min(3).max(5),
      // Clear completion criteria
      resources: z.array(z.object({
        title: z.string().max(50),
        url: z.string().url()
      })).max(2).default([]),
      // Optional resources, prevent overwhelm
      dependencies: z.array(z.string().uuid()).default([]),
      // Task IDs this depends on
      completed: z.boolean().default(false),
      completedAt: z.coerce.date().nullable().optional()
    }).strict();
    roadmapSubsectionSchema = z.object({
      id: z.string().uuid().or(z.literal("")).transform((val) => val || crypto.randomUUID()),
      // Auto-generate if missing
      title: z.string().min(5).max(80),
      description: z.string().min(10).max(200),
      // Brief subsection overview
      tasks: z.array(atomicTaskSchema).min(3).max(5),
      // 3-5 tasks per subsection
      estimatedHours: z.number().min(1).max(5),
      // Total time for subsection
      priority: z.enum(["high", "medium", "low"])
    }).strict();
    atomicRoadmapSchema = z.object({
      phase: z.enum(["30_days", "3_months", "6_months"]),
      // Align with DB enum
      title: z.string().min(10).max(100),
      description: z.string().min(20).max(300),
      subsections: z.array(roadmapSubsectionSchema).min(4).max(6),
      // 4-6 subsections max
      estimatedWeeks: z.number().min(1).max(12)
    }).strict();
    insertInstitutionSchema = createInsertSchema(institutions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLicenseSchema = createInsertSchema(licenses).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInvitationSchema = createInsertSchema(invitations).omit({
      id: true,
      createdAt: true
    });
    insertEmailVerificationSchema = createInsertSchema(emailVerifications).omit({
      id: true,
      createdAt: true
    });
    insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
      id: true,
      createdAt: true
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      currentUses: true
    });
    insertResumeSchema = createInsertSchema(resumes).omit({
      id: true,
      createdAt: true
    });
    insertRoadmapSchema = createInsertSchema(roadmaps).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertRoadmapSubsectionSchema = createInsertSchema(roadmapSubsections).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertJobMatchSchema = createInsertSchema(jobMatches).omit({
      id: true,
      createdAt: true
    });
    insertApplicationSchema = createInsertSchema(applications).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSkillGapAnalysisSchema = createInsertSchema(skillGapAnalyses).omit({
      id: true,
      createdAt: true
    });
    insertMicroProjectSchema = createInsertSchema(microProjects).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertProjectCompletionSchema = createInsertSchema(projectCompletions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPortfolioArtifactSchema = createInsertSchema(portfolioArtifacts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    });
    registerSchema = insertUserSchema.extend({
      confirmPassword: z.string().min(6),
      invitationToken: z.string().optional(),
      selectedPlan: z.enum(["free", "paid"]).optional()
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
    inviteUserSchema = z.object({
      email: z.string().email(),
      role: z.enum(["student", "admin"]).default("student"),
      institutionId: z.string().min(1)
      // Allow both UUID and demo string IDs
    });
    verifyEmailSchema = z.object({
      token: z.string()
    });
    forgotPasswordSchema = z.object({
      email: z.string().email()
    });
    resetPasswordSchema = z.object({
      token: z.string(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6)
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
    jobMatchAnalysisSchema = z.object({
      overallMatch: z.number().int().min(1).max(100),
      competitivenessBand: z.enum(["Exceptional", "Strong", "Good", "Fair", "Weak", "Poor"]),
      strengths: z.array(z.string()).min(1),
      concerns: z.array(z.string()),
      skillsAnalysis: z.object({
        strongMatches: z.array(z.string()),
        partialMatches: z.array(z.string()),
        missingSkills: z.array(z.string()),
        explanation: z.string().min(50)
      }),
      experienceAnalysis: z.object({
        relevantExperience: z.array(z.string()),
        experienceGaps: z.array(z.string()),
        explanation: z.string().min(50)
      }),
      recommendations: z.array(z.string()).min(1),
      nextSteps: z.array(z.string()).min(1)
    });
    insertOpportunitySchema = createInsertSchema(opportunities).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      postedDate: true
    });
    insertSavedOpportunitySchema = createInsertSchema(savedOpportunities).omit({
      id: true,
      savedAt: true
    });
    insertTourCompletionSchema = createInsertSchema(tourCompletions).omit({
      id: true,
      completedAt: true
    });
  }
});

// server/db.ts
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var Pool, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    ({ Pool } = pkg);
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
      // required for Railway
    });
    db = drizzle(pool);
  }
});

// server/storage.ts
import { eq, desc, and, or, sql as sql2 } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || void 0;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(id, updates) {
        const [user] = await db.update(users).set({ ...updates, updatedAt: sql2`now()` }).where(eq(users.id, id)).returning();
        return user;
      }
      async createSession(userId, token, expiresAt) {
        await db.insert(sessions).values({ userId, token, expiresAt });
      }
      async getSession(token) {
        const [session] = await db.select({ user: users }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(eq(sessions.token, token), sql2`${sessions.expiresAt} > now()`));
        return session || void 0;
      }
      async deleteSession(token) {
        await db.delete(sessions).where(eq(sessions.token, token));
      }
      async deleteUserSessions(userId) {
        await db.delete(sessions).where(eq(sessions.userId, userId));
      }
      async deleteUser(userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
      async createResume(resume) {
        await db.update(resumes).set({ isActive: false }).where(eq(resumes.userId, resume.userId));
        const [newResume] = await db.insert(resumes).values(resume).returning();
        return newResume;
      }
      async getUserResumes(userId) {
        return await db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.createdAt));
      }
      async getActiveResume(userId) {
        const [resume] = await db.select().from(resumes).where(and(eq(resumes.userId, userId), eq(resumes.isActive, true)));
        return resume || void 0;
      }
      async updateResumeAnalysis(id, analysis) {
        const validFields = {
          ...analysis.rmsScore !== void 0 && { rmsScore: analysis.rmsScore },
          ...analysis.skillsScore !== void 0 && { skillsScore: analysis.skillsScore },
          ...analysis.experienceScore !== void 0 && { experienceScore: analysis.experienceScore },
          ...analysis.keywordsScore !== void 0 && { keywordsScore: analysis.keywordsScore },
          ...analysis.educationScore !== void 0 && { educationScore: analysis.educationScore },
          ...analysis.certificationsScore !== void 0 && { certificationsScore: analysis.certificationsScore },
          ...analysis.gaps !== void 0 && { gaps: analysis.gaps },
          ...analysis.overallInsights !== void 0 && { overallInsights: analysis.overallInsights },
          ...analysis.sectionAnalysis !== void 0 && { sectionAnalysis: analysis.sectionAnalysis }
        };
        if (Object.keys(validFields).length === 0) {
          throw new Error("No valid analysis fields to update");
        }
        const [resume] = await db.update(resumes).set(validFields).where(eq(resumes.id, id)).returning();
        return resume;
      }
      async createRoadmap(roadmap) {
        await db.update(roadmaps).set({ isActive: false }).where(and(eq(roadmaps.userId, roadmap.userId), eq(roadmaps.phase, roadmap.phase)));
        const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
        return newRoadmap;
      }
      async getUserRoadmaps(userId) {
        return await db.select().from(roadmaps).where(and(eq(roadmaps.userId, userId), eq(roadmaps.isActive, true))).orderBy(roadmaps.phase);
      }
      async updateRoadmapProgress(id, progress) {
        const [roadmap] = await db.update(roadmaps).set({ progress, updatedAt: sql2`now()` }).where(eq(roadmaps.id, id)).returning();
        return roadmap;
      }
      async updateActionCompletion(roadmapId, actionId, userId, completed) {
        const [currentRoadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, roadmapId));
        if (!currentRoadmap || !currentRoadmap.actions) {
          throw new Error("Roadmap not found or has no actions");
        }
        const updatedActions = currentRoadmap.actions.map((action) => {
          if (action.id === actionId) {
            return { ...action, completed };
          }
          return action;
        });
        const completedCount = updatedActions.filter((action) => action.completed).length;
        const progress = Math.round(completedCount / updatedActions.length * 100);
        const [updatedRoadmap] = await db.update(roadmaps).set({
          actions: updatedActions,
          progress,
          updatedAt: sql2`now()`
        }).where(eq(roadmaps.id, roadmapId)).returning();
        return updatedRoadmap;
      }
      async updateTaskCompletion(roadmapId, taskId, userId, completed) {
        const [currentRoadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, roadmapId));
        if (!currentRoadmap || !currentRoadmap.subsections) {
          throw new Error("Roadmap not found or has no subsections");
        }
        const updatedSubsections = currentRoadmap.subsections.map((subsection) => {
          if (subsection.tasks) {
            subsection.tasks = subsection.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, completed };
              }
              return task;
            });
          }
          return subsection;
        });
        let totalTasks = 0;
        let completedTasks = 0;
        updatedSubsections.forEach((subsection) => {
          if (subsection.tasks) {
            totalTasks += subsection.tasks.length;
            completedTasks += subsection.tasks.filter((task) => task.completed).length;
          }
        });
        const progress = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
        const [updatedRoadmap] = await db.update(roadmaps).set({
          subsections: updatedSubsections,
          progress,
          updatedAt: sql2`now()`
        }).where(eq(roadmaps.id, roadmapId)).returning();
        return updatedRoadmap;
      }
      async getTaskCompletionStatus(roadmapId, userId) {
        const [roadmap] = await db.select().from(roadmaps).where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)));
        if (!roadmap || !roadmap.subsections) {
          return {};
        }
        const completionStatus = {};
        roadmap.subsections.forEach((subsection) => {
          if (subsection.tasks) {
            subsection.tasks.forEach((task) => {
              completionStatus[task.id] = task.completed || false;
            });
          }
        });
        return completionStatus;
      }
      async createJobMatch(jobMatch) {
        const [match] = await db.insert(jobMatches).values(jobMatch).returning();
        return match;
      }
      async getUserJobMatches(userId, limit = 20) {
        return await db.select().from(jobMatches).where(eq(jobMatches.userId, userId)).orderBy(desc(jobMatches.compatibilityScore)).limit(limit);
      }
      async updateJobMatchBookmark(id, isBookmarked) {
        const [jobMatch] = await db.update(jobMatches).set({ isBookmarked }).where(eq(jobMatches.id, id)).returning();
        return jobMatch;
      }
      async createApplication(application) {
        const [app2] = await db.insert(applications).values(application).returning();
        return app2;
      }
      async getUserApplications(userId) {
        return await db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.appliedDate));
      }
      async updateApplicationStatus(id, status, responseDate) {
        const updates = { status, updatedAt: sql2`now()` };
        if (responseDate) updates.responseDate = responseDate;
        const [application] = await db.update(applications).set(updates).where(eq(applications.id, id)).returning();
        return application;
      }
      async createActivity(userId, type, title, description, metadata) {
        const [activity] = await db.insert(activities).values({ userId, type, title, description, metadata }).returning();
        return activity;
      }
      async getUserActivities(userId, limit = 10) {
        return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt)).limit(limit);
      }
      async createAchievement(userId, title, description, icon) {
        const [achievement] = await db.insert(achievements).values({ userId, title, description, icon }).returning();
        return achievement;
      }
      async getUserAchievements(userId) {
        return await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.unlockedAt));
      }
      async createTailoredResume(tailoredResume) {
        const [newTailoredResume] = await db.insert(tailoredResumes).values(tailoredResume).returning();
        return newTailoredResume;
      }
      async getTailoredResumes(userId) {
        return await db.select({
          id: tailoredResumes.id,
          tailoredContent: tailoredResumes.tailoredContent,
          jobSpecificScore: tailoredResumes.jobSpecificScore,
          keywordsCovered: tailoredResumes.keywordsCovered,
          createdAt: tailoredResumes.createdAt,
          jobTitle: jobMatches.title,
          company: jobMatches.company,
          baseResumeFileName: resumes.fileName
        }).from(tailoredResumes).leftJoin(jobMatches, eq(tailoredResumes.jobMatchId, jobMatches.id)).leftJoin(resumes, eq(tailoredResumes.baseResumeId, resumes.id)).where(eq(tailoredResumes.userId, userId)).orderBy(desc(tailoredResumes.createdAt));
      }
      async getResources(skillCategories) {
        if (!skillCategories?.length) {
          return await db.select().from(resources).orderBy(desc(resources.relevanceScore));
        }
        return await db.select().from(resources).where(sql2`${resources.skillCategories} && ${skillCategories}`).orderBy(desc(resources.relevanceScore));
      }
      // Institution & Licensing Methods
      async createInstitution(institution) {
        const [newInstitution] = await db.insert(institutions).values(institution).returning();
        return newInstitution;
      }
      async getInstitution(id) {
        const [institution] = await db.select().from(institutions).where(eq(institutions.id, id));
        return institution || void 0;
      }
      async getInstitutionByDomain(domain) {
        const [institution] = await db.select().from(institutions).where(
          or(
            eq(institutions.domain, domain),
            sql2`${domain} = ANY(${institutions.allowedDomains})`
          )
        );
        return institution || void 0;
      }
      async updateInstitution(id, updates) {
        const [institution] = await db.update(institutions).set({ ...updates, updatedAt: sql2`now()` }).where(eq(institutions.id, id)).returning();
        return institution;
      }
      async createLicense(license) {
        await db.update(licenses).set({ isActive: false, updatedAt: sql2`now()` }).where(eq(licenses.institutionId, license.institutionId));
        const [newLicense] = await db.insert(licenses).values(license).returning();
        return newLicense;
      }
      async getInstitutionLicense(institutionId) {
        const [license] = await db.select().from(licenses).where(and(
          eq(licenses.institutionId, institutionId),
          eq(licenses.isActive, true),
          sql2`${licenses.endDate} > now()`
        )).orderBy(desc(licenses.createdAt));
        return license || void 0;
      }
      async updateLicenseUsage(licenseId, usedSeats) {
        const [license] = await db.update(licenses).set({ usedSeats, updatedAt: sql2`now()` }).where(eq(licenses.id, licenseId)).returning();
        return license;
      }
      async checkSeatAvailability(institutionId) {
        const license = await this.getInstitutionLicense(institutionId);
        if (!license) {
          return { available: false, usedSeats: 0, totalSeats: null };
        }
        if (license.licenseType === "site") {
          return { available: true, usedSeats: license.usedSeats, totalSeats: null };
        }
        const available = license.usedSeats < (license.licensedSeats || 0);
        return {
          available,
          usedSeats: license.usedSeats,
          totalSeats: license.licensedSeats
        };
      }
      async createInvitation(invitation) {
        const [newInvitation] = await db.insert(invitations).values(invitation).returning();
        return newInvitation;
      }
      async getInvitationByToken(token) {
        const [invitation] = await db.select().from(invitations).where(and(
          eq(invitations.token, token),
          eq(invitations.status, "pending"),
          sql2`${invitations.expiresAt} > now()`
        ));
        return invitation || void 0;
      }
      async claimInvitation(token, userId) {
        const [invitation] = await db.update(invitations).set({
          status: "claimed",
          claimedBy: userId,
          claimedAt: sql2`now()`
        }).where(eq(invitations.token, token)).returning();
        return invitation;
      }
      async getInstitutionInvitations(institutionId) {
        return await db.select().from(invitations).where(eq(invitations.institutionId, institutionId)).orderBy(desc(invitations.createdAt));
      }
      async getInvitation(id) {
        const [invitation] = await db.select().from(invitations).where(eq(invitations.id, id));
        return invitation || void 0;
      }
      async cancelInvitation(id) {
        await db.update(invitations).set({ status: "expired" }).where(eq(invitations.id, id));
      }
      async createEmailVerification(verification) {
        const [newVerification] = await db.insert(emailVerifications).values(verification).returning();
        return newVerification;
      }
      async getEmailVerification(token) {
        const [verification] = await db.select().from(emailVerifications).where(and(
          eq(emailVerifications.token, token),
          eq(emailVerifications.isUsed, false),
          sql2`${emailVerifications.expiresAt} > now()`
        ));
        return verification || void 0;
      }
      async markEmailVerificationUsed(token) {
        await db.update(emailVerifications).set({ isUsed: true }).where(eq(emailVerifications.token, token));
      }
      async createPasswordResetToken(resetToken) {
        const [newToken] = await db.insert(passwordResetTokens).values(resetToken).returning();
        return newToken;
      }
      async getPasswordResetToken(token) {
        const [resetToken] = await db.select().from(passwordResetTokens).where(and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.isUsed, false),
          sql2`${passwordResetTokens.expiresAt} > now()`
        ));
        return resetToken || void 0;
      }
      async markPasswordResetTokenAsUsed(token) {
        await db.update(passwordResetTokens).set({ isUsed: true }).where(eq(passwordResetTokens.token, token));
      }
      async deletePasswordResetToken(token) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
      }
      async getPromoCodeByCode(code) {
        const [promoCode] = await db.select().from(promoCodes).where(and(
          eq(promoCodes.code, code),
          eq(promoCodes.isActive, true),
          or(
            sql2`${promoCodes.expiresAt} IS NULL`,
            sql2`${promoCodes.expiresAt} > now()`
          )
        ));
        return promoCode || void 0;
      }
      async incrementPromoCodeUsage(id) {
        await db.update(promoCodes).set({
          currentUses: sql2`${promoCodes.currentUses} + 1`,
          updatedAt: sql2`now()`
        }).where(eq(promoCodes.id, id));
      }
      async activateUser(userId) {
        const [user] = await db.update(users).set({ isActive: true, lastActiveAt: sql2`now()`, updatedAt: sql2`now()` }).where(eq(users.id, userId)).returning();
        return user;
      }
      async deactivateUser(userId) {
        const [user] = await db.update(users).set({ isActive: false, updatedAt: sql2`now()` }).where(eq(users.id, userId)).returning();
        return user;
      }
      async getInstitutionUsers(institutionId, activeOnly = true) {
        const whereConditions = [eq(users.institutionId, institutionId)];
        if (activeOnly) {
          whereConditions.push(eq(users.isActive, true));
        }
        return await db.select().from(users).where(and(...whereConditions)).orderBy(desc(users.createdAt));
      }
      async checkDomainAllowlist(email, institutionId) {
        const domain = email.split("@")[1];
        const institution = await this.getInstitution(institutionId);
        if (!institution) {
          return false;
        }
        if (institution.domain === domain) {
          return true;
        }
        if (institution.allowedDomains && institution.allowedDomains.includes(domain)) {
          return true;
        }
        return false;
      }
      // Additional required methods
      async getResumeById(id) {
        const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
        return resume || void 0;
      }
      async getJobMatchById(id) {
        const [jobMatch] = await db.select().from(jobMatches).where(eq(jobMatches.id, id));
        return jobMatch || void 0;
      }
      // Micro-Internship Marketplace implementations
      async createSkillGapAnalysis(analysis) {
        const [result] = await db.insert(skillGapAnalyses).values(analysis).returning({ id: skillGapAnalyses.id });
        return result.id;
      }
      async getSkillGapAnalysisById(id) {
        const [analysis] = await db.select().from(skillGapAnalyses).where(eq(skillGapAnalyses.id, id));
        return analysis || void 0;
      }
      async getSkillGapAnalysesByUser(userId) {
        return await db.select().from(skillGapAnalyses).where(eq(skillGapAnalyses.userId, userId)).orderBy(desc(skillGapAnalyses.createdAt));
      }
      async createMicroProject(project) {
        const [result] = await db.insert(microProjects).values(project).returning({ id: microProjects.id });
        return result.id;
      }
      async getMicroProjectById(id) {
        const [project] = await db.select().from(microProjects).where(eq(microProjects.id, id));
        return project || void 0;
      }
      async getMicroProjectsBySkills(skills) {
        if (skills.length === 0) return [];
        const conditions = skills.map(
          (skill) => or(
            eq(microProjects.targetSkill, skill),
            eq(microProjects.skillCategory, skill),
            sql2`${skill.toLowerCase()} = ANY(${microProjects.tags})`
          )
        );
        return await db.select().from(microProjects).where(and(
          eq(microProjects.isActive, true),
          or(...conditions)
        )).orderBy(desc(microProjects.createdAt)).limit(10);
      }
      async updateMicroProject(id, updates) {
        const [project] = await db.update(microProjects).set({ ...updates, updatedAt: sql2`now()` }).where(eq(microProjects.id, id)).returning();
        return project;
      }
      async deleteMicroProject(id) {
        await db.delete(microProjects).where(eq(microProjects.id, id));
      }
      async getAllMicroProjects(limit = 50, offset = 0) {
        return await db.select().from(microProjects).where(eq(microProjects.isActive, true)).orderBy(desc(microProjects.createdAt)).limit(limit).offset(offset);
      }
      async createProjectCompletion(completion) {
        const [result] = await db.insert(projectCompletions).values(completion).returning({ id: projectCompletions.id });
        return result.id;
      }
      async getProjectCompletion(userId, projectId) {
        const [completion] = await db.select().from(projectCompletions).where(and(
          eq(projectCompletions.userId, userId),
          eq(projectCompletions.projectId, projectId)
        ));
        return completion || void 0;
      }
      async getProjectCompletionsByUser(userId) {
        return await db.select().from(projectCompletions).where(eq(projectCompletions.userId, userId)).orderBy(desc(projectCompletions.createdAt));
      }
      async updateProjectCompletion(id, updates) {
        await db.update(projectCompletions).set({ ...updates, updatedAt: sql2`now()` }).where(eq(projectCompletions.id, id));
      }
      async createPortfolioArtifact(artifact) {
        const [result] = await db.insert(portfolioArtifacts).values(artifact).returning({ id: portfolioArtifacts.id });
        return result.id;
      }
      async getPortfolioArtifactsByUser(userId) {
        return await db.select().from(portfolioArtifacts).where(eq(portfolioArtifacts.userId, userId)).orderBy(desc(portfolioArtifacts.createdAt));
      }
      async saveOpportunity(userId, opportunityData) {
        let opportunity;
        const existing = await db.select().from(opportunities).where(eq(opportunities.externalId, opportunityData.id)).limit(1);
        if (existing.length > 0) {
          opportunity = existing[0];
        } else {
          const [newOpp] = await db.insert(opportunities).values({
            title: opportunityData.title,
            description: opportunityData.description,
            organization: opportunityData.organization,
            type: opportunityData.type,
            location: opportunityData.location,
            isRemote: opportunityData.remote,
            applicationUrl: opportunityData.url,
            source: opportunityData.source,
            externalId: opportunityData.id,
            duration: opportunityData.duration,
            isActive: true
          }).returning();
          opportunity = newOpp;
        }
        const [saved] = await db.insert(savedOpportunities).values({
          userId,
          opportunityId: opportunity.id
        }).returning();
        return { ...saved, opportunity };
      }
      async getSavedOpportunities(userId) {
        const saved = await db.select({
          id: savedOpportunities.id,
          savedAt: savedOpportunities.savedAt,
          notes: savedOpportunities.notes,
          opportunity: opportunities
        }).from(savedOpportunities).innerJoin(opportunities, eq(savedOpportunities.opportunityId, opportunities.id)).where(eq(savedOpportunities.userId, userId)).orderBy(desc(savedOpportunities.savedAt));
        return saved;
      }
      async getUserCompletedTours(userId) {
        return await db.select().from(tourCompletions).where(eq(tourCompletions.userId, userId)).orderBy(desc(tourCompletions.completedAt));
      }
      async getTourCompletion(userId, tourId) {
        const [completion] = await db.select().from(tourCompletions).where(and(
          eq(tourCompletions.userId, userId),
          eq(tourCompletions.tourId, tourId)
        ));
        return completion || void 0;
      }
      async completeTour(userId, tourId) {
        const [completion] = await db.insert(tourCompletions).values({ userId, tourId }).returning();
        return completion;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/ai.ts
var ai_exports = {};
__export(ai_exports, {
  AIService: () => AIService,
  aiService: () => aiService
});
import OpenAI from "openai";
import { z as z2 } from "zod";
import { randomUUID } from "crypto";
var openai, AIService, aiService;
var init_ai = __esm({
  "server/ai.ts"() {
    "use strict";
    init_schema();
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
    });
    AIService = class {
      async generateText(prompt) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that provides clear and concise responses."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_completion_tokens: 1e3,
            temperature: 0.7
          });
          return response.choices[0].message.content || "";
        } catch (error) {
          console.error("AI text generation failed:", error);
          throw error;
        }
      }
      // Two-pass atomization: refines tasks to ensure they're truly bite-sized
      async atomizeTasks(subsections) {
        try {
          const atomizePrompt = `You are a task atomizer. Your job is to ensure every task is truly atomic and bite-sized.

REVIEW these subsections and split ANY task that:
- Has multiple sentences
- Contains "and", "then", "also", "additionally"  
- Takes longer than 60 minutes
- Has multiple deliverables
- Is vague or complex

ATOMIZATION RULES:
1. Each task = ONE verb + ONE object
2. Completable in 20-60 minutes
3. Single clear outcome
4. Title max 60 chars, description max 140 chars
5. Keep same JSON structure

INPUT SUBSECTIONS:
${JSON.stringify(subsections, null, 2)}

Return JSON in this format: { "subsections": [...] }

ID REQUIREMENTS: 
- Preserve existing task IDs when possible
- Generate new RFC-4122 UUID v4 for new tasks created by splitting
- Maintain dependencies and copy them to all resulting tasks from a split`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            // Using GPT-4o for reliable performance
            messages: [
              {
                role: "system",
                content: "You are a precision task atomizer. Split complex tasks into atomic, trackable actions. Return JSON only."
              },
              {
                role: "user",
                content: atomizePrompt
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 3e3
          });
          const atomizedResult = JSON.parse(response.choices[0].message.content || "{}");
          const { insertRoadmapSubsectionSchema: insertRoadmapSubsectionSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const validatedSubsections = z2.array(insertRoadmapSubsectionSchema2).parse(atomizedResult.subsections || []);
          return validatedSubsections;
        } catch (error) {
          console.error("Task atomization failed:", error);
          return subsections;
        }
      }
      async analyzeJobMatch(resumeText, jobData) {
        try {
          const prompt = `You are an expert career counselor and hiring manager analyzing how well a candidate's resume matches a specific job posting. Provide comprehensive, data-driven insights that quantify why the candidate is or isn't competitive for this role.

CANDIDATE RESUME:
${resumeText}

JOB POSTING:
Title: ${jobData.title}
Company: ${jobData.company?.display_name || "Not specified"}
Description: ${jobData.description || "No description provided"}
Location: ${jobData.location?.display_name || "Not specified"}
Employment Type: ${jobData.contract_type || "Not specified"}

ANALYSIS REQUIREMENTS:
- Be highly specific and reference exact details from both resume and job posting
- Quantify competitiveness with detailed reasoning
- Provide actionable, prioritized recommendations
- Focus on what matters most to hiring managers for this specific role

Respond with a comprehensive JSON object:
{
  "overallMatch": <number 1-100 representing overall competitiveness>,
  "strengths": [
    "<specific strength 1 with quantified impact>",
    "<specific strength 2 with evidence from resume>",
    "<specific strength 3 tied directly to job requirements>"
  ],
  "concerns": [
    "<critical gap 1 with impact assessment>",
    "<moderate concern 2 with context>",
    "<minor issue 3 if applicable>"
  ],
  "skillsAnalysis": {
    "strongMatches": [<exact skills from resume that directly match job requirements>],
    "partialMatches": [<transferable skills with explanation of relevance>],
    "missingSkills": [<critical skills from job posting absent in resume>],
    "explanation": "<200+ word detailed analysis of skills alignment, including: skill match percentage, most important gaps, transferability assessment, and competitive positioning relative to typical candidates>"
  },
  "experienceAnalysis": {
    "relevantExperience": [<specific roles/projects from resume most relevant to this job>],
    "experienceGaps": [<experience requirements from job that candidate lacks>],
    "explanation": "<200+ word detailed analysis including: years of relevant experience vs. requirements, industry alignment, responsibility level match, achievement relevance, and experience quality assessment>"
  },
  "recommendations": [
    "<high-impact recommendation 1 for immediate application improvement>",
    "<medium-impact recommendation 2 for cover letter/interview prep>",
    "<strategic recommendation 3 for long-term positioning>"
  ],
  "nextSteps": [
    "<immediate action 1 (within 24 hours)>",
    "<short-term action 2 (within 1 week)>",
    "<medium-term action 3 (within 1 month)>"
  ]
}

SCORING CRITERIA for overallMatch:
90-100: Exceptional fit - top 10% of candidates, likely to get interviews
80-89: Strong fit - competitive candidate with good interview chances  
70-79: Good fit - meets most requirements, moderate competition
60-69: Fair fit - meets basic requirements, needs strengthening
50-59: Weak fit - significant gaps, requires major improvements
Below 50: Poor fit - not competitive for this specific role

Focus on being brutally honest about competitiveness while providing constructive, actionable guidance.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            // Using GPT-4o for reliable performance
            messages: [
              { role: "system", content: "You are an expert hiring manager. Respond with valid JSON exactly matching the required schema. No additional prose or markdown." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500,
            // Control token usage for cost optimization
            temperature: 0.3,
            // Lower temperature for more consistent analysis
            top_p: 0.9
            // Focus on most relevant outputs
          });
          const rawAnalysis = JSON.parse(response.choices[0].message.content || "{}");
          try {
            const analysisWithBand = {
              ...rawAnalysis,
              competitivenessBand: getCompetitivenessBand(rawAnalysis.overallMatch || 75)
            };
            const validatedAnalysis = jobMatchAnalysisSchema.parse(analysisWithBand);
            return validatedAnalysis;
          } catch (validationError) {
            console.error("AI analysis validation failed:", validationError);
            return this.getFallbackAnalysis();
          }
        } catch (error) {
          console.error("AI job match analysis failed:", error);
          return this.getFallbackAnalysis();
        }
      }
      getFallbackAnalysis() {
        const fallbackScore = 75;
        return {
          overallMatch: fallbackScore,
          competitivenessBand: getCompetitivenessBand(fallbackScore),
          strengths: [
            "Professional background shows relevant experience for the role",
            "Educational qualifications align with industry standards",
            "Demonstrated ability to learn and adapt to new environments"
          ],
          concerns: [
            "Some specific technical skills mentioned in the job posting may need validation",
            "Industry-specific experience depth requires assessment",
            "Certain advanced qualifications may need development"
          ],
          skillsAnalysis: {
            strongMatches: ["Core competencies from your professional background"],
            partialMatches: ["Transferable skills that can be applied to this role"],
            missingSkills: ["Role-specific technical skills that may require development"],
            explanation: "AI analysis is temporarily unavailable, but based on general patterns, your background likely includes transferable skills relevant to this position. A detailed review of specific technical requirements would provide more precise matching insights. Consider highlighting your most relevant experiences and any recent training or certifications that align with the job requirements."
          },
          experienceAnalysis: {
            relevantExperience: ["Professional roles and projects from your background"],
            experienceGaps: ["Specialized experience areas that may need strengthening"],
            explanation: "While detailed AI analysis is unavailable, your professional history likely contains valuable experience relevant to this role. Focus on quantifying your achievements and demonstrating measurable impact in previous positions. Consider how your experience directly addresses the core responsibilities mentioned in the job posting."
          },
          recommendations: [
            "Thoroughly review the job description and tailor your application to highlight the most relevant experiences",
            "Research the company and role to understand their specific needs and priorities",
            "Prepare specific examples that demonstrate your impact and problem-solving abilities"
          ],
          nextSteps: [
            "Within 24 hours: Customize your resume to emphasize the most relevant skills and experiences",
            "Within 1 week: Research the company culture and recent developments to personalize your cover letter",
            "Within 1 month: Consider additional training or certification in key areas identified in the job posting"
          ]
        };
      }
      async analyzeResume(resumeText, targetRole, targetIndustry, targetCompanies) {
        try {
          const prompt = `Analyze this resume for the target role and provide a JSON response with specific scores, detailed section analysis, and gaps.

Resume text:
${resumeText}

Target Role: ${targetRole}
Target Industry: ${targetIndustry || "Not specified"}
Target Companies: ${targetCompanies || "Not specified"}

Provide analysis in this exact JSON format:
{
  "rmsScore": 65,
  "skillsScore": 70,
  "experienceScore": 60,
  "keywordsScore": 55,
  "educationScore": 80,
  "certificationsScore": 40,
  "overallInsights": {
    "scoreExplanation": "Explain the overall score and what it means",
    "strengthsOverview": "Summary of key strengths",
    "weaknessesOverview": "Summary of key weaknesses",
    "keyRecommendations": ["Top recommendation 1", "Top recommendation 2"]
  },
  "sectionAnalysis": {
    "skills": {
      "score": 70,
      "strengths": ["Specific skill 1 they have", "Specific skill 2 they have"],
      "gaps": ["Missing skill 1 for target role", "Missing skill 2 for target role"],
      "explanation": "Detailed explanation of their skills match",
      "improvements": ["How to improve skill area 1", "How to improve skill area 2"]
    },
    "experience": {
      "score": 60,
      "strengths": ["Relevant experience they have", "Another strong point"],
      "gaps": ["Missing experience type", "Years of experience gap"],
      "explanation": "Detailed explanation of their experience match",
      "improvements": ["How to gain experience 1", "How to gain experience 2"]
    },
    "keywords": {
      "score": 55,
      "strengths": ["Keywords they use well", "Industry terms present"],
      "gaps": ["Missing important keywords", "ATS optimization gaps"],
      "explanation": "Analysis of keyword optimization and ATS compatibility",
      "improvements": ["Add keyword X to Y section", "Rephrase Z using industry terms"]
    },
    "education": {
      "score": 80,
      "strengths": ["Relevant degree/certification", "Academic achievement"],
      "gaps": ["Additional certifications needed", "Specialized training"],
      "explanation": "How education aligns with role requirements",
      "improvements": ["Consider certification X", "Take course in Y"]
    },
    "certifications": {
      "score": 40,
      "strengths": ["Current certifications they have"],
      "gaps": ["Important certifications missing"],
      "explanation": "Analysis of certification requirements",
      "improvements": ["Get certified in X", "Renew/update Y certification"]
    }
  },
  "gaps": [
    {
      "category": "Python Programming",
      "priority": "high",
      "impact": 15,
      "rationale": "Python is essential for this role",
      "resources": [
        {
          "title": "Python for Everybody Specialization",
          "provider": "Coursera",
          "url": "",
          "cost": "Free with audit option"
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENT: For the "url" field in resources, ONLY provide REAL, VERIFIED URLs to actual courses/resources. Use these verified URLs:

VERIFIED RESOURCE URLS:
Python:
- "https://www.coursera.org/specializations/python" (Python for Everybody)
- "https://www.udemy.com/course/complete-python-bootcamp/" (Complete Python Bootcamp)
- "https://www.codecademy.com/learn/learn-python-3" (Learn Python 3)

JavaScript/Web Development:
- "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" (JavaScript Algorithms)
- "https://www.coursera.org/learn/html-css-javascript-for-web-developers" (Web Development)
- "https://www.udemy.com/course/the-complete-javascript-course/" (Complete JavaScript)

Data Science/Machine Learning:
- "https://www.coursera.org/professional-certificates/google-data-analytics" (Google Data Analytics)
- "https://www.coursera.org/learn/machine-learning" (Stanford Machine Learning)
- "https://www.kaggle.com/learn" (Kaggle Learn - Free)

Cloud/DevOps:
- "https://aws.amazon.com/training/digital/" (AWS Training)
- "https://docs.microsoft.com/en-us/learn/azure/" (Azure Learning)
- "https://cloud.google.com/training" (Google Cloud Training)

Project Management:
- "https://www.coursera.org/professional-certificates/google-project-management" (Google Project Management)
- "https://www.pmi.org/learning/training-development" (PMI Training)

General Career Skills:
- "https://www.linkedin.com/learning/" (LinkedIn Learning - various topics)
- "https://www.coursera.org/browse" (Coursera Catalog)
- "https://www.edx.org/" (edX Courses)
- "https://www.khanacademy.org/" (Khan Academy - Free)

If the specific skill doesn't match these, use the general platform URLs above. NEVER make up URLs - only use these verified ones.

Be realistic with scores (40-80 range). Focus on identifying actual gaps between the resume and target role requirements.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert career counselor specializing in gap analysis. Your job is to identify specific gaps between a candidate's current resume and their target role requirements. Be honest about missing skills and experience. Provide actionable recommendations with real resources."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" }
          });
          return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
          console.error("Resume analysis error:", error);
          throw new Error("Failed to analyze resume");
        }
      }
      async generateCareerRoadmap(phase, userProfile, resumeAnalysis) {
        console.log(`Generating AI-powered career roadmap for phase: ${phase}`);
        try {
          const phaseInstructions = {
            "30_days": `
Focus on **quick wins and immediate actions**:
- Resume tailoring and LinkedIn optimization
- Apply to target jobs immediately
- Short, fast online courses or tutorials (1\u20132 weeks max)
- Network outreach to 5\u201310 people
- Prepare for upcoming interviews
`,
            "3_months": `
Focus on **medium-term development and momentum**:
- Complete 1\u20132 structured online courses or certifications
- Build a consistent weekly job application + networking system
- Start 1 small side project or portfolio addition
- Conduct 10\u201315 informational interviews
- Develop measurable improvements in interview performance
`,
            "6_months": `
Focus on **long-term strategy and positioning**:
- Complete advanced certifications or bootcamps
- Lead or contribute to a significant project/portfolio
- Deep industry research and thought leadership (blog posts, talks, communities)
- Develop specialized or leadership skills
- Build sustained mentorship relationships in the industry
`
          };
          const prompt = `You are an expert career coach creating a personalized ${phase.replace("_", " ")} career roadmap.

USER PROFILE:
- Target Role: ${userProfile?.targetRole || "Career advancement"}
- Industries: ${userProfile?.industries?.join(", ") || "General"}
- Education: ${userProfile?.major || "Not specified"} at ${userProfile?.school || "Not specified"}
- Experience Level: ${userProfile?.gradYear ? `Graduating ${userProfile.gradYear}` : "Professional"}
- Target Companies: ${userProfile?.targetCompanies?.join(", ") || "Various"}

${resumeAnalysis ? `RESUME ANALYSIS:
- Overall Score: ${resumeAnalysis.rmsScore}/100
- Key Skills Gaps: ${resumeAnalysis.gaps?.slice(0, 5).map((g) => g.category).join(", ") || "None identified"}
- Strengths: ${resumeAnalysis.overallInsights?.strengthsOverview || "Professional background"}
` : ""}

INSTRUCTIONS FOR THIS TIMEFRAME:
${phaseInstructions[phase]}

Return JSON in this structure:
{
  "title": "Personalized title for their career plan",
  "description": "Brief description of what this plan will accomplish",
  "actions": [
    {
      "title": "Specific action step",
      "description": "Detailed description of how to complete this step",
      "rationale": "Why this step is important for their career goals",
      "icon": "\u{1F4C4}",
      "completed": false
    }
  ]
}

Each action must clearly align with the ${phase.replace("_", " ")} horizon. 
Do not just repeat the same actions for all phases.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert career coach who creates personalized, actionable career development plans. Always respond with valid JSON."
              },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 2e3,
            temperature: 0.6
          });
          const rawContent = response.choices[0].message.content;
          if (!rawContent || rawContent.trim() === "") {
            throw new Error("Empty response from OpenAI");
          }
          const aiRoadmap = JSON.parse(rawContent);
          const validateActions = (actions, phase2) => {
            return actions.filter((action) => {
              const text2 = (action.title + " " + action.description).toLowerCase();
              if (phase2 === "30_days") {
                if (text2.includes("certification") || text2.includes("bootcamp") || text2.includes("long-term")) {
                  return false;
                }
              }
              if (phase2 === "3_months") {
                if (text2.includes("multi-year") || text2.includes("advanced bootcamp")) {
                  return false;
                }
              }
              if (phase2 === "6_months") {
                if (text2.includes("resume") || text2.includes("linkedin")) {
                  return false;
                }
              }
              return true;
            });
          };
          const validatedActions = validateActions(aiRoadmap.actions || [], phase);
          const actionsWithIds = validatedActions.map((action) => ({
            ...action,
            id: randomUUID(),
            completed: false
          }));
          return {
            title: aiRoadmap.title || `${phase.replace("_", " ")} Career Plan`,
            description: aiRoadmap.description || `Personalized career development plan`,
            actions: actionsWithIds,
            subsections: []
          };
        } catch (error) {
          console.error("AI roadmap generation failed, using fallback:", error);
          const phaseName = phase.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
          const targetRole = userProfile?.targetRole || "your target role";
          return {
            title: `${phaseName} Plan for ${targetRole}`,
            description: `A structured career plan tailored for advancing toward ${targetRole}`,
            actions: [
              {
                id: randomUUID(),
                title: `Update Resume for ${targetRole} Positions`,
                description: "Tailor your resume to highlight relevant experience and skills for your target role",
                rationale: "A targeted resume significantly increases interview opportunities",
                icon: "\u{1F4C4}",
                completed: false
              },
              {
                id: randomUUID(),
                title: "Optimize LinkedIn Profile",
                description: "Update headline, summary, and skills to attract recruiters in your target industry",
                rationale: "LinkedIn optimization increases visibility by 40%",
                icon: "\u{1F4BC}",
                completed: false
              },
              {
                id: randomUUID(),
                title: `Research ${userProfile?.industries?.[0] || "Target"} Companies`,
                description: "Identify and research 15-20 companies that align with your career goals",
                rationale: "Targeted applications have 3x higher success rates",
                icon: "\u{1F50D}",
                completed: false
              }
            ],
            subsections: []
          };
        }
      }
      async tailorResume(baseResumeText, jobDescription, targetKeywords, userProfile) {
        try {
          const prompt = `Tailor this resume for the job. Focus on keyword optimization.
      
Resume: ${baseResumeText}
Job: ${jobDescription}
Keywords: ${targetKeywords.join(", ")}

Provide JSON:
{
  "tailoredContent": "Updated resume text",
  "jobSpecificScore": 85,
  "keywordsCovered": ["keyword1", "keyword2"],
  "remainingGaps": [{"skill": "Python", "importance": "high", "resources": [{"title": "Course Name", "provider": "Provider Name", "url": "", "cost": "Free"}]}],
  "diffJson": [{"type": "modify", "section": "skills", "original": "old", "new": "new", "reason": "keyword optimization"}]
}

CRITICAL REQUIREMENT: For any resources in remainingGaps, use ONLY these REAL, VERIFIED URLs:
- Python: https://www.coursera.org/specializations/python
- JavaScript: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/
- Data Science: https://www.coursera.org/professional-certificates/google-data-analytics
- AWS: https://aws.amazon.com/training/digital/
- Project Management: https://www.coursera.org/professional-certificates/google-project-management
- General Skills: https://www.linkedin.com/learning/
- Free Resources: https://www.khanacademy.org/
If no specific match, use https://www.coursera.org/browse or https://www.edx.org/`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a professional resume writer." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });
          return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
          console.error("Resume tailoring error:", error);
          throw new Error("Failed to tailor resume");
        }
      }
      async generateCoverLetter(resumeText, jobDescription, company, role) {
        try {
          const prompt = `Write a professional cover letter for this application:
      
Resume: ${resumeText}
Job: ${jobDescription}
Company: ${company}
Role: ${role}

Create a compelling 3-4 paragraph cover letter.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a professional career coach who writes compelling cover letters." },
              { role: "user", content: prompt }
            ]
          });
          return response.choices[0].message.content || "";
        } catch (error) {
          console.error("Cover letter generation error:", error);
          throw new Error("Failed to generate cover letter");
        }
      }
      async optimizeLinkedInProfile(currentProfile, targetRole, targetIndustries) {
        try {
          const prompt = `Optimize this LinkedIn profile for ${targetRole} in ${targetIndustries.join(", ")}:
      
Current: ${currentProfile}

Provide JSON:
{
  "headline": "Optimized headline",
  "about": "Optimized about section",
  "skills": ["skill1", "skill2"],
  "improvements": ["suggestion1", "suggestion2"]
}`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a LinkedIn optimization expert." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });
          return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
          console.error("LinkedIn optimization error:", error);
          throw new Error("Failed to optimize LinkedIn profile");
        }
      }
      async generateCareerInsights({ resumeText, targetRole, experience }) {
        try {
          const prompt = `Provide career insights for this professional:
      
Resume: ${resumeText}
Target Role: ${targetRole}
Experience: ${experience}

Provide JSON with career recommendations and insights.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are an expert career coach." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });
          return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
          console.error("Career insights error:", error);
          throw new Error("Failed to generate career insights");
        }
      }
      async generateSalaryNegotiationStrategy({ currentSalary, targetSalary, jobRole, location, yearsExperience, resumeText }) {
        try {
          const prompt = `Analyze this person's resume and create personalized salary negotiation advice:

RESUME: ${resumeText || "Resume not provided"}

SALARY DETAILS:
- Current: ${currentSalary ? `$${currentSalary.toLocaleString()}` : "Not disclosed"}
- Target: $${targetSalary.toLocaleString()}  
- Role: ${jobRole}
- Location: ${location}
- Experience: ${yearsExperience} years

Create a personalized salary negotiation strategy based on their specific skills, achievements, and experience shown in their resume. Begin with: "Based on your experience as a ${jobRole}, here's my personalized advice for negotiating your salary increase to $${targetSalary.toLocaleString()}..."

Write as natural conversation. Reference specific skills or achievements from their resume. Include market research for their role in ${location}. Give concrete talking points based on their actual background.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a friendly career coach having a conversation. Write your entire response as natural flowing text, like you're talking to someone face-to-face. Use "you" and "your" throughout. Write in complete sentences and paragraphs only. Never use JSON, never use structured data, never use brackets or quotes. Start every response with "Based on your experience as a ${jobRole}, here's my advice for negotiating your salary increase..." and continue with natural conversational advice.`
              },
              { role: "user", content: prompt }
            ],
            max_completion_tokens: 2e3,
            temperature: 0.7,
            top_p: 0.9
          });
          let content = response.choices[0].message.content || "Unable to generate negotiation strategy at this time.";
          if (content.includes("{") || content.includes("[") || content.includes('"') || content.includes('":')) {
            console.log("AI returned structured data, converting to natural language");
            let naturalContent = content;
            if (content.trim().startsWith("{")) {
              try {
                const parsed = JSON.parse(content);
                const values = [];
                const extractAllValues = (obj) => {
                  if (typeof obj === "string" && obj.length > 5) {
                    values.push(obj);
                  } else if (Array.isArray(obj)) {
                    obj.forEach(extractAllValues);
                  } else if (typeof obj === "object" && obj !== null) {
                    Object.values(obj).forEach(extractAllValues);
                  }
                };
                extractAllValues(parsed);
                naturalContent = values.join(" ");
              } catch (e) {
                naturalContent = content.replace(/[{}"\[\],]/g, " ").replace(/[a-z_]+:/gi, " ").replace(/\s+/g, " ");
              }
            }
            naturalContent = naturalContent.replace(/\s+/g, " ").replace(/\.\s*/g, ". ").replace(/([.!?])\s*/g, "$1 ").trim();
            if (!naturalContent.toLowerCase().includes("based on your experience")) {
              naturalContent = `Based on your experience as a ${jobRole}, here's my advice for negotiating your salary increase. ${naturalContent}`;
            }
            content = naturalContent;
          }
          content = content.replace(/^[^a-zA-Z]*/, "").replace(/\s+/g, " ").trim();
          return content;
        } catch (error) {
          console.error("Salary negotiation error:", error);
          throw new Error("Failed to generate salary negotiation strategy");
        }
      }
      async updateResumeFromRoadmap({ resumeText, completedTasks }) {
        try {
          const prompt = `Update this resume based on completed roadmap tasks:
      
Resume: ${resumeText}
Completed Tasks: ${JSON.stringify(completedTasks)}

Provide JSON:
{
  "updatedResumeText": "Updated resume text",
  "changesApplied": ["List of changes"],
  "newSkillsAdded": ["skill1", "skill2"],
  "enhancedSections": ["section1", "section2"]
}`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a professional resume writer." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });
          const content = response.choices[0].message.content;
          if (!content) throw new Error("No response from OpenAI");
          return JSON.parse(content);
        } catch (error) {
          console.error("Resume update error:", error);
          throw new Error("Failed to update resume from roadmap");
        }
      }
      async generateInterviewQuestions(jobTitle, company, category, count = 10) {
        try {
          const prompt = `Generate ${count} ${category} interview questions for a ${jobTitle} position at ${company}.

For each question, provide:
1. The question itself
2. Category: ${category}
3. Difficulty level (beginner/intermediate/advanced)
4. 3-4 answer tips to help the candidate prepare

Categories:
- behavioral: Questions about past experiences, teamwork, leadership, problem-solving
- technical: Role-specific technical questions and coding challenges
- situational: Hypothetical scenarios and problem-solving questions
- company: Company-specific questions about culture, values, and industry knowledge

Format as JSON array:
{
  "questions": [
    {
      "question": "Tell me about a time you had to work with a difficult team member.",
      "category": "${category}",
      "difficulty": "intermediate",
      "tips": [
        "Focus on your actions and problem-solving approach",
        "Show emotional intelligence and professionalism",
        "Highlight the positive outcome or learning",
        "Avoid speaking negatively about others"
      ]
    }
  ]
}

Make questions specific to ${jobTitle} role and ${company} when possible.`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are an expert interview coach and hiring manager." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7
          });
          const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
          const questions = (result.questions || []).map((q, index) => ({
            ...q,
            id: `q-${Date.now()}-${index}`
          }));
          return questions;
        } catch (error) {
          console.error("Interview questions generation error:", error);
          throw new Error("Failed to generate interview questions");
        }
      }
      async generatePrepResources(jobTitle, company, skills = []) {
        try {
          const prompt = `Generate relevant preparation resources for a ${jobTitle} interview at ${company}.

Focus on skills: ${skills.join(", ") || "general interview skills"}

CRITICAL REQUIREMENT:
- Only use the verified resource URLs listed below.
- If no exact match exists, link to the platform's main catalog.
- NEVER invent or hallucinate URLs.

VERIFIED RESOURCE URLS:
- Coursera: https://www.coursera.org/
- Udemy: https://www.udemy.com/
- LinkedIn Learning: https://www.linkedin.com/learning/
- YouTube: https://www.youtube.com/
- LeetCode: https://leetcode.com/
- HackerRank: https://www.hackerrank.com/
- Khan Academy: https://www.khanacademy.org/
- Educative: https://www.educative.io/
- AWS Training: https://aws.amazon.com/training/digital/
- Azure Learning: https://learn.microsoft.com/en-us/training/
- Google Cloud Training: https://cloud.google.com/training

Provide 8\u201312 diverse, high-quality resources in this JSON structure:
{
  "resources": [
    {
      "title": "System Design Interview Prep",
      "type": "course",
      "url": "https://www.educative.io/courses/grokking-the-system-design-interview",
      "description": "Comprehensive system design patterns and interview questions",
      "duration": "8 hours",
      "provider": "Educative",
      "rating": 4.5
    }
  ]
}`;
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a career coach who curates the best learning resources. Always respond with valid JSON only." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
          });
          const result = JSON.parse(response.choices[0].message.content || '{"resources": []}');
          const allowedDomains = [
            "coursera.org",
            "udemy.com",
            "linkedin.com",
            "youtube.com",
            "leetcode.com",
            "hackerrank.com",
            "khanacademy.org",
            "educative.io",
            "aws.amazon.com",
            "cloud.google.com",
            "microsoft.com"
          ];
          const safeResources = (result.resources || []).map((r, index) => {
            const isAllowed = allowedDomains.some((domain) => r.url && r.url.includes(domain));
            return {
              ...r,
              id: `r-${Date.now()}-${index}`,
              url: isAllowed ? r.url : "https://www.coursera.org/"
              // fallback safe URL
            };
          });
          return safeResources;
        } catch (error) {
          console.error("Prep resources generation error:", error);
          throw new Error("Failed to generate preparation resources");
        }
      }
    };
    aiService = new AIService();
  }
});

// server/openai-service.ts
import OpenAI2 from "openai";
var openai2, OpenAIProjectService, openaiProjectService;
var init_openai_service = __esm({
  "server/openai-service.ts"() {
    "use strict";
    openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
    OpenAIProjectService = class {
      // ▼ Flexible category → project type
      getProjectType(category) {
        const normalized = category.toLowerCase().trim();
        const typeMappings = [
          { pattern: /data\s*(science|analysis)|analytics/, type: "data-analysis" },
          { pattern: /web\s*dev|frontend|backend|software|programming|coding/, type: "coding" },
          { pattern: /machine\s*learning|ml|ai|artificial\s*intelligence/, type: "ai-development" },
          { pattern: /nursing|healthcare|medical|patient\s*care|clinical/, type: "clinical-practice" },
          { pattern: /teach|educat|pedagogy|lesson\s*plan|curriculum/, type: "education" },
          { pattern: /business|management|admin|leadership/, type: "business" },
          { pattern: /design|art|creative|ui|ux|graphic/, type: "creative" },
          { pattern: /research|academic|writing|communication/, type: "research" },
          { pattern: /teamwork|collab|presentation|public\s*speaking/, type: "soft-skills" }
        ];
        for (const mapping of typeMappings) {
          if (mapping.pattern.test(normalized)) return mapping.type;
        }
        if (normalized.includes("+") || normalized.includes("and")) {
          const parts = normalized.split(/[+and]/).map((part) => part.trim());
          const types = parts.map((part) => this.getProjectType(part));
          return types.includes("coding") ? "coding" : types[0] || "general";
        }
        if (normalized.length <= 3) return "general";
        if (normalized.endsWith("ing")) return normalized.slice(0, -3);
        return normalized.includes("-") ? normalized : "general-skills";
      }
      // ▼ Robust JSON parsing and normalization with step-by-step instructions
      async generateDetailedProject(request) {
        const prompt = `You are an expert career coach. The user is a ${request.userBackground} who wants to become a ${request.targetRole}. Their resume analysis shows they lack "${request.skillGap}" skills.

Create a step-by-step practice project that will help them build this skill. Each step must include:
- A clear title
- Time estimate
- Description of what to do
- Concrete tasks
- Resources or links to use
- A deliverable to produce

Return JSON only in this schema (do not rename keys):

{
  "title": "string",
  "description": "string", 
  "targetSkill": "string",
  "skillCategory": "string",
  "difficulty": "${request.difficultyLevel}",
  "estimatedHours": number,
  "projectType": "design|development|research|analysis",
  "instructions": {
    "overview": "string",
    "prerequisites": ["string"],
    "detailed_steps": [
      {
        "step": number,
        "title": "string",
        "duration": "string",
        "description": "string",
        "tasks": ["string"],
        "resources": ["string"],
        "deliverable": "string"
      }
    ],
    "success_criteria": ["string"],
    "resources": [
      {
        "title": "string",
        "url": "string",
        "type": "string",
        "description": "string"
      }
    ]
  },
  "deliverables": ["string"],
  "evaluationCriteria": ["string"],
  "exampleArtifacts": ["string"],
  "tags": ["string"]
}`;
        try {
          console.log("Starting OpenAI request for project generation...");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45e3);
          const response = await openai2.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant. Return ONLY valid JSON with no markdown formatting or extra text."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500
          }, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          console.log("OpenAI response received successfully");
          let content = response.choices[0].message.content || "{}";
          console.log("Raw OpenAI response:", content.length > 200 ? `${content.substring(0, 200)}...` : content);
          const jsonStart = content.indexOf("{");
          const jsonEnd = content.lastIndexOf("}");
          if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
            throw new Error("Invalid JSON response - missing boundaries");
          }
          content = content.slice(jsonStart, jsonEnd + 1).replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          if (content.startsWith("json\n")) {
            content = content.substring(5);
          }
          let projectData;
          try {
            projectData = JSON.parse(content);
            if (!projectData.title && projectData.projectTitle) {
              projectData.title = projectData.projectTitle;
            }
            if (!projectData.difficultyLevel && projectData.difficulty) {
              projectData.difficultyLevel = projectData.difficulty;
            }
            if (!projectData.skillCategory && projectData.category) {
              projectData.skillCategory = projectData.category;
            }
            if (!projectData.title || typeof projectData.title !== "string") {
              throw new Error("Missing or invalid title in response");
            }
            if (!projectData.instructions?.detailed_steps) {
              projectData.instructions = {
                overview: projectData.instructions?.overview || `Hands-on project to develop ${request.skillGap} skills.`,
                prerequisites: projectData.instructions?.prerequisites || [],
                detailed_steps: [
                  {
                    step: 1,
                    title: `Research ${request.skillGap}`,
                    duration: "1 hour",
                    description: `Explore ${request.skillGap} requirements for ${request.targetRole}`,
                    tasks: [`Read 2\u20133 articles about ${request.skillGap}`],
                    resources: [],
                    deliverable: `Short notes document`
                  },
                  {
                    step: 2,
                    title: `Practical Application`,
                    duration: "3 hours",
                    description: `Create a small demo applying ${request.skillGap} in context`,
                    tasks: [`Build a small example project`],
                    resources: [],
                    deliverable: `Working demo or prototype`
                  }
                ],
                success_criteria: ["Demonstrates skill application"],
                resources: []
              };
            }
          } catch (parseError) {
            console.error("JSON parse failed:", {
              error: parseError,
              content: content.length > 200 ? `${content.substring(0, 200)}...` : content
            });
            projectData = {
              title: `${request.skillGap} Practice Project`,
              description: `Develop ${request.skillGap} skills through hands-on exercises`,
              targetSkill: request.skillGap,
              difficulty: request.difficultyLevel,
              estimatedHours: 12,
              instructions: {
                overview: `Hands-on project to develop ${request.skillGap} skills.`,
                prerequisites: [],
                detailed_steps: [
                  {
                    step: 1,
                    title: `Research ${request.skillGap}`,
                    duration: "1 hour",
                    description: `Explore ${request.skillGap} requirements for ${request.targetRole}`,
                    tasks: [`Read 2\u20133 articles about ${request.skillGap}`],
                    resources: [],
                    deliverable: `Short notes document`
                  },
                  {
                    step: 2,
                    title: `Practical Application`,
                    duration: "3 hours",
                    description: `Create a small demo applying ${request.skillGap} in context`,
                    tasks: [`Build a small example project`],
                    resources: [],
                    deliverable: `Working demo or prototype`
                  }
                ],
                success_criteria: ["Demonstrates skill application"],
                resources: []
              },
              deliverables: [`Completed ${request.skillGap} project`],
              evaluationCriteria: ["Demonstrates core competencies"],
              tags: [request.skillGap.toLowerCase()]
            };
          }
          return {
            title: projectData.title,
            description: projectData.description,
            targetRole: request.targetRole,
            targetSkill: projectData.targetSkill || request.skillGap,
            skillCategory: projectData.skillCategory || request.skillCategory,
            difficultyLevel: projectData.difficultyLevel || request.difficultyLevel,
            estimatedHours: projectData.estimatedHours || 12,
            projectType: projectData.projectType || this.getProjectType(request.skillCategory),
            instructions: projectData.instructions,
            deliverables: projectData.deliverables || [],
            skillsGained: [],
            relevanceToRole: `Develops ${request.skillGap} skills needed for ${request.targetRole} role`,
            evaluationCriteria: projectData.evaluationCriteria || [],
            exampleArtifacts: projectData.exampleArtifacts || [],
            datasetUrl: null,
            templateUrl: null,
            repositoryUrl: null,
            tutorialUrl: null,
            portfolioTemplate: null,
            tags: projectData.tags || [request.skillGap.toLowerCase()],
            isActive: true
          };
        } catch (error) {
          console.error("Error generating project with OpenAI:", error);
          if (error instanceof Error && error.name === "AbortError") {
            throw new Error("OpenAI request timed out after 45 seconds");
          }
          throw new Error(`Failed to generate AI-powered project: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      async generateMultipleProjects(requests) {
        const projects = await Promise.allSettled(
          requests.map((request) => this.generateDetailedProject(request))
        );
        return projects.filter((result) => result.status === "fulfilled").map((result) => result.value);
      }
      // NEW: Role-based project generation following the exact format from requirements
      async generateProjectsFromRole(request) {
        const projectCount = request.count || 2;
        const prompt = `Help students or early-career professionals strengthen their resumes by completing small, realistic, and targeted projects aligned with their target role: ${request.targetRole}.

Generate ${projectCount} micro-project idea${projectCount > 1 ? "s" : ""} that are:
- Directly relevant to the ${request.targetRole} role's common skills and responsibilities
- Realistic to complete in 1\u20132 weeks (not a full-time job or thesis-level work)
- Producing tangible, showcaseable deliverables (e.g., GitHub repo, slides, case study, prototype, report)
- Resume/portfolio-ready (phrased in a way the user could later add to LinkedIn or a resume)

For each project, provide:

1. **Title**: Clear, resume-friendly title (e.g., "Customer Churn Prediction Using Machine Learning")

2. **Description**: A short 2\u20133 sentence summary of what the project involves and its purpose

3. **Deliverables**: Step-by-step details of what the student should build/do. Each step should be:
   - Actionable (e.g., "Download the Telco Customer Churn dataset from Kaggle", not "do data cleaning")
   - Include links to real resources (datasets, APIs, tutorials, repos, videos) whenever possible
   Format as array of objects with: stepNumber, instruction, resourceLinks: [{title, url, type}]

4. **Skills Gained**: List the key skills, tools, or technologies this project demonstrates (align with job requirements)

5. **Difficulty**: One of: "beginner", "intermediate", or "advanced"

6. **Relevance to Role**: 1\u20132 sentences explaining why this project matters for career goals and how it strengthens resume/portfolio

Requirements:
- Avoid vague project ideas. Be specific and outcome-driven
- Keep projects realistic to complete without major external resources (free datasets, open APIs, FOSS tools)
- Tie projects to real datasets/APIs/scenarios (Kaggle datasets, government open data portals, GitHub repos, etc.)
- Ensure diversity in project types: some technical builds, some analytical/strategic projects, some communication-focused

Return JSON array of projects in this exact schema:
{
  "projects": [
    {
      "title": "string",
      "description": "string (2-3 sentences)",
      "targetRole": "${request.targetRole}",
      "deliverables": [
        {
          "stepNumber": 1,
          "instruction": "Actionable step description",
          "resourceLinks": [
            {"title": "Resource name", "url": "https://...", "type": "dataset|tutorial|api|documentation"}
          ]
        }
      ],
      "skillsGained": ["Skill 1", "Tool 2", "Technology 3"],
      "difficulty": "beginner|intermediate|advanced",
      "estimatedHours": 10-40,
      "relevanceToRole": "Why this matters for the role",
      "projectType": "data-analysis|coding|design|research|business"
    }
  ]
}`;
        try {
          console.log(`Generating ${projectCount} role-based projects for ${request.targetRole}...`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6e4);
          const response = await openai2.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert career coach and project designer. Create realistic, portfolio-ready micro-projects with specific, actionable deliverables and real resource links. Return ONLY valid JSON with no markdown formatting."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 3e3
          }, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          let content = response.choices[0].message.content || "{}";
          const jsonData = JSON.parse(content);
          if (!jsonData.projects || !Array.isArray(jsonData.projects)) {
            throw new Error("Invalid response format: missing projects array");
          }
          console.log(`Successfully generated ${jsonData.projects.length} projects`);
          return jsonData.projects.map((project) => ({
            title: project.title,
            description: project.description,
            targetRole: project.targetRole || request.targetRole,
            targetSkill: null,
            // Optional field, not used in role-based generation
            skillCategory: null,
            // Optional field
            difficultyLevel: project.difficulty || "intermediate",
            estimatedHours: project.estimatedHours || 20,
            projectType: project.projectType || "general",
            deliverables: project.deliverables || [],
            // New structured format with embedded links
            skillsGained: project.skillsGained || [],
            relevanceToRole: project.relevanceToRole || "",
            instructions: null,
            // Deprecated in favor of deliverables
            evaluationCriteria: project.evaluationCriteria || [],
            exampleArtifacts: project.exampleArtifacts || [],
            datasetUrl: null,
            templateUrl: null,
            repositoryUrl: null,
            tutorialUrl: null,
            portfolioTemplate: null,
            tags: [request.targetRole.toLowerCase().replace(/\s+/g, "-"), project.difficulty],
            isActive: true
          }));
        } catch (error) {
          console.error("Error generating role-based projects:", error);
          throw new Error(`Failed to generate projects: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      async enhanceExistingProject(projectTitle, currentInstructions) {
        const prompt = `Enhance the following micro-internship project with more detailed, step-by-step instructions:

Project Title: ${projectTitle}
Current Instructions: ${JSON.stringify(currentInstructions, null, 2)}

Make the instructions more comprehensive by:
1. Adding specific tools and resources to use
2. Including templates and examples
3. Providing step-by-step tasks with time estimates
4. Adding success criteria and evaluation methods
5. Including real-world resources and links

Respond with enhanced instructions JSON in the same format, but with much more detail and actionable guidance.`;
        try {
          const response = await openai2.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert instructional designer who creates detailed, actionable project instructions. Enhance existing project instructions to be comprehensive and immediately actionable."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" }
          });
          return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
          console.error("Error enhancing project instructions:", error);
          return currentInstructions;
        }
      }
    };
    openaiProjectService = new OpenAIProjectService();
  }
});

// server/micro-projects.ts
var micro_projects_exports = {};
__export(micro_projects_exports, {
  MicroProjectsService: () => MicroProjectsService,
  microProjectsService: () => microProjectsService
});
var MicroProjectsService, microProjectsService;
var init_micro_projects = __esm({
  "server/micro-projects.ts"() {
    "use strict";
    init_storage();
    init_ai();
    init_openai_service();
    MicroProjectsService = class {
      realDatasets = /* @__PURE__ */ new Map();
      projectTemplates = /* @__PURE__ */ new Map();
      constructor() {
        this.initializeRealResources();
      }
      initializeRealResources() {
        this.realDatasets.set("data-analysis", [
          {
            title: "NYC Open Data - 311 Service Requests",
            description: "Real NYC 311 service request data for analysis practice",
            url: "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9",
            type: "csv",
            size: "~2GB",
            license: "Public Domain"
          },
          {
            title: "Kaggle - Customer Churn Dataset",
            description: "Telecommunications customer churn data for predictive modeling",
            url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
            type: "csv",
            size: "950KB",
            license: "CC0: Public Domain"
          },
          {
            title: "World Bank Open Data API",
            description: "Economic indicators and development data from World Bank",
            url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392",
            type: "api",
            license: "CC BY 4.0"
          }
        ]);
        this.realDatasets.set("web-development", [
          {
            title: "JSONPlaceholder API",
            description: "Fake REST API for testing and prototyping",
            url: "https://jsonplaceholder.typicode.com/",
            type: "api",
            license: "Open Source"
          },
          {
            title: "Free Code Camp Weather API",
            description: "Real weather data API for front-end projects",
            url: "https://weather-proxy.freecodecamp.rocks/",
            type: "api",
            license: "Public"
          }
        ]);
        this.realDatasets.set("machine-learning", [
          {
            title: "Iris Dataset",
            description: "Classic dataset for classification problems",
            url: "https://archive.ics.uci.edu/ml/datasets/iris",
            type: "csv",
            size: "5KB",
            license: "Public Domain"
          },
          {
            title: "Boston Housing Dataset",
            description: "Housing prices for regression analysis",
            url: "https://www.kaggle.com/datasets/vikrishnan/boston-house-prices",
            type: "csv",
            size: "25KB",
            license: "Public Domain"
          }
        ]);
        this.projectTemplates.set("web-development", [
          {
            title: "React Dashboard Template",
            description: "Modern dashboard with charts and data visualization",
            templateUrl: "https://github.com/creativetimofficial/material-dashboard-react",
            difficulty: "intermediate",
            technologies: ["React", "Material-UI", "Chart.js"]
          },
          {
            title: "Express REST API Starter",
            description: "Clean REST API template with authentication",
            templateUrl: "https://github.com/hagopj13/node-express-boilerplate",
            difficulty: "beginner",
            technologies: ["Node.js", "Express", "MongoDB", "JWT"]
          }
        ]);
        this.projectTemplates.set("data-analysis", [
          {
            title: "Jupyter Data Analysis Template",
            description: "Complete data analysis workflow template",
            templateUrl: "https://github.com/microsoft/Data-Science-For-Beginners/tree/main/4-Data-Science-Lifecycle",
            difficulty: "beginner",
            technologies: ["Python", "Pandas", "Matplotlib", "Jupyter"]
          }
        ]);
      }
      async analyzeSkillGaps(userId, resumeId, jobMatchId, targetRole) {
        try {
          let missingSkills = [];
          let skillCategories = [];
          let analysisSource = "manual";
          if (jobMatchId) {
            const jobMatch = await storage.getJobMatchById(jobMatchId);
            if (jobMatch && jobMatch.skillsGaps) {
              missingSkills = jobMatch.skillsGaps;
              analysisSource = "job-match";
            }
          } else if (resumeId) {
            const resume = await storage.getResumeById(resumeId);
            if (resume && resume.gaps) {
              const gaps = typeof resume.gaps === "string" ? JSON.parse(resume.gaps) : resume.gaps;
              missingSkills = Array.isArray(gaps) ? gaps.map((gap) => gap.skill || gap.area).filter(Boolean) : [];
              analysisSource = "resume-only";
            }
          }
          if (missingSkills.length === 0 && targetRole) {
            missingSkills = await this.generateSkillGapsForRole(targetRole);
            analysisSource = "ai-generated";
          }
          skillCategories = this.categorizeSkills(missingSkills);
          const skillGapData = {
            userId,
            resumeId,
            jobMatchId,
            targetRole,
            missingSkills,
            skillCategories,
            analysisSource,
            priorityLevel: "high"
          };
          const analysisId = await storage.createSkillGapAnalysis(skillGapData);
          return {
            ...skillGapData,
            id: analysisId,
            createdAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error analyzing skill gaps:", error);
          throw error;
        }
      }
      async generateMicroProjectsForSkillGaps(skillGapAnalysisId) {
        try {
          const analysis = await storage.getSkillGapAnalysisById(skillGapAnalysisId);
          if (!analysis) {
            throw new Error("Skill gap analysis not found");
          }
          const projects = [];
          const skillsToAddress = analysis.missingSkills.slice(0, 5);
          for (const skill of skillsToAddress) {
            const skillProjects = await this.generateProjectsForSkill(skill);
            projects.push(...skillProjects);
          }
          const createdProjects = await Promise.all(
            projects.map((project) => this.storeProject(project))
          );
          return createdProjects;
        } catch (error) {
          console.error("Error generating micro-projects:", error);
          throw error;
        }
      }
      async generateSkillGapsForRole(targetRole) {
        try {
          const prompt = `For a ${targetRole} role, what are the 5 most important technical skills that candidates often lack? 
      
      Return only a JSON array of skill names, no additional text.
      Focus on concrete, learnable skills that can be practiced through hands-on projects.
      
      Example format: ["Python", "SQL", "Data Visualization", "API Development", "Version Control"]`;
          const response = await aiService.generateText(prompt);
          try {
            return JSON.parse(response.trim());
          } catch {
            const skills = response.match(/"([^"]+)"/g);
            return skills ? skills.map((s) => s.replace(/"/g, "")) : ["Programming", "Problem Solving"];
          }
        } catch (error) {
          console.error("Error generating skill gaps:", error);
          return ["Programming", "Problem Solving"];
        }
      }
      categorizeSkills(skills) {
        const categories = /* @__PURE__ */ new Set();
        for (const skill of skills) {
          const skillLower = skill.toLowerCase();
          if (skillLower.match(/programming|python|javascript|java|sql|react|node|html|css|git|api|database/)) {
            categories.add("technical");
          } else if (skillLower.match(/data|analysis|visualization|statistics|excel|tableau|pandas/)) {
            categories.add("data-analysis");
          } else if (skillLower.match(/design|ui|ux|figma|photoshop|branding/)) {
            categories.add("design");
          } else if (skillLower.match(/communication|leadership|management|teamwork|presentation/)) {
            categories.add("soft-skills");
          } else {
            categories.add("technical");
          }
        }
        return Array.from(categories);
      }
      async generateProjectsForSkill(skill) {
        try {
          const skillCategory = this.getSkillCategory(skill);
          const datasets = this.realDatasets.get(skillCategory) || [];
          const templates = this.projectTemplates.get(skillCategory) || [];
          const prompt = `Create a micro-project to help someone learn ${skill}. This should be a practical, hands-on project that can be completed in 2-4 hours.

      Project Requirements:
      - Must use real data or resources (not fake/mock data)
      - Should produce a portfolio-ready artifact 
      - Include step-by-step instructions
      - Specify clear deliverables and evaluation criteria
      - Appropriate for someone new to ${skill}

      Available real resources:
      ${datasets.map((d) => `- ${d.title}: ${d.url}`).join("\n")}
      ${templates.map((t) => `- ${t.title}: ${t.templateUrl}`).join("\n")}

      Return a JSON object with this structure:
      {
        "title": "Project title (50 chars max)",
        "description": "What the student will build and learn",
        "instructions": {
          "overview": "Brief project overview",
          "steps": ["Step 1", "Step 2", "Step 3", "..."],
          "resources": ["Resource 1", "Resource 2", "..."]
        },
        "deliverables": ["Deliverable 1", "Deliverable 2", "..."],
        "evaluationCriteria": ["Criterion 1", "Criterion 2", "..."],
        "estimatedHours": 2-4,
        "datasetUrl": "URL to real dataset if applicable",
        "templateUrl": "URL to starter template if applicable"
      }`;
          const response = await aiService.generateText(prompt);
          try {
            const projectData = JSON.parse(response);
            return [{
              title: projectData.title || `${skill} Practice Project`,
              description: projectData.description || `Build practical skills in ${skill}`,
              targetRole: "General",
              targetSkill: skill,
              skillCategory,
              difficultyLevel: "beginner",
              estimatedHours: projectData.estimatedHours || 3,
              projectType: this.getProjectType(skillCategory),
              instructions: projectData.instructions,
              deliverables: projectData.deliverables || ["Completed project", "Reflection writeup"],
              skillsGained: [skill],
              relevanceToRole: `Develops ${skill} skills applicable to multiple roles`,
              evaluationCriteria: projectData.evaluationCriteria || ["Functionality", "Code quality", "Documentation"],
              datasetUrl: projectData.datasetUrl,
              templateUrl: projectData.templateUrl,
              repositoryUrl: templates[0]?.templateUrl,
              tutorialUrl: null,
              portfolioTemplate: null,
              exampleArtifacts: [],
              tags: [skill.toLowerCase().replace(" ", "-"), skillCategory],
              isActive: true
            }];
          } catch (parseError) {
            console.error("Error parsing project JSON:", parseError);
            return this.generateFallbackProject(skill, skillCategory);
          }
        } catch (error) {
          console.error(`Error generating project for ${skill}:`, error);
          return this.generateFallbackProject(skill, "technical");
        }
      }
      generateFallbackProject(skill, category) {
        const datasets = this.realDatasets.get(category) || [];
        const fallbackDataset = datasets[0];
        return [{
          title: `${skill} Hands-On Project`,
          description: `Build practical experience with ${skill} through a real-world project using authentic data and tools.`,
          targetRole: "General",
          targetSkill: skill,
          skillCategory: category,
          difficultyLevel: "beginner",
          estimatedHours: 3,
          projectType: this.getProjectType(category),
          instructions: {
            overview: `Learn ${skill} by working with real data and building something tangible.`,
            steps: [
              "Set up your development environment",
              "Explore the provided dataset/resources",
              "Follow the tutorial to build your solution",
              "Test and document your work",
              "Create a portfolio writeup"
            ],
            resources: fallbackDataset ? [fallbackDataset.url] : []
          },
          deliverables: ["Working solution", "Portfolio documentation", "Code repository"],
          skillsGained: [skill],
          relevanceToRole: `Develops foundational ${skill} skills`,
          evaluationCriteria: ["Completeness", "Functionality", "Documentation quality"],
          datasetUrl: fallbackDataset?.url,
          templateUrl: null,
          repositoryUrl: null,
          tutorialUrl: null,
          portfolioTemplate: null,
          exampleArtifacts: [],
          tags: [skill.toLowerCase().replace(" ", "-"), category],
          isActive: true
        }];
      }
      getSkillCategory(skill) {
        const skillLower = skill.toLowerCase();
        if (skillLower.match(/data|analysis|visualization|statistics|excel|tableau|pandas/)) {
          return "data-analysis";
        } else if (skillLower.match(/react|node|javascript|html|css|web|frontend|backend/)) {
          return "web-development";
        } else if (skillLower.match(/machine learning|ml|ai|tensorflow|python.*analysis/)) {
          return "machine-learning";
        } else {
          return "technical";
        }
      }
      getProjectType(category) {
        switch (category) {
          case "data-analysis":
            return "data-analysis";
          case "web-development":
            return "coding";
          case "machine-learning":
            return "coding";
          case "design":
            return "design";
          default:
            return "coding";
        }
      }
      async storeProject(projectData) {
        const projectId = await storage.createMicroProject(projectData);
        return {
          ...projectData,
          id: projectId,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
      }
      async getRecommendedProjectsForUser(userId) {
        try {
          const activeResume = await storage.getActiveResume(userId);
          if (!activeResume?.gaps) {
            return [];
          }
          const gaps = typeof activeResume.gaps === "string" ? JSON.parse(activeResume.gaps) : activeResume.gaps;
          const improvementAreas = Array.isArray(gaps) ? gaps.map((gap) => gap.category).filter(Boolean) : [];
          if (improvementAreas.length === 0) {
            return [];
          }
          const projects = await storage.getMicroProjectsBySkills(improvementAreas);
          const completions = await storage.getProjectCompletionsByUser(userId);
          const completedProjectIds = new Set(completions.map((c) => c.projectId));
          return projects.filter((p) => !completedProjectIds.has(p.id));
        } catch (error) {
          console.error("Error getting recommended projects:", error);
          return [];
        }
      }
      async startProject(userId, projectId) {
        try {
          await storage.createProjectCompletion({
            userId,
            projectId,
            status: "in_progress",
            progressPercentage: 0,
            startedAt: /* @__PURE__ */ new Date()
          });
          const project = await storage.getMicroProjectById(projectId);
          if (project) {
            await storage.createActivity(
              userId,
              "project_started",
              "Project Started",
              `Started working on: ${project.title}`
            );
          }
        } catch (error) {
          console.error("Error starting project:", error);
          throw error;
        }
      }
      async updateProjectProgress(userId, projectId, progressPercentage, timeSpent) {
        try {
          const completion = await storage.getProjectCompletion(userId, projectId);
          if (!completion) {
            throw new Error("Project completion not found");
          }
          await storage.updateProjectCompletion(completion.id, {
            progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
            timeSpent: timeSpent || completion.timeSpent,
            updatedAt: /* @__PURE__ */ new Date()
          });
          const project = await storage.getMicroProjectById(projectId);
          if (project) {
            if (progressPercentage === 100) {
              await storage.createActivity(
                userId,
                "project_completed",
                "Project Completed",
                `Completed: ${project.title}`
              );
            } else if (progressPercentage >= 50 && (completion.progressPercentage || 0) < 50) {
              await storage.createActivity(
                userId,
                "project_milestone",
                "Project Progress",
                `Reached 50% progress on: ${project.title}`
              );
            }
          }
        } catch (error) {
          console.error("Error updating project progress:", error);
          throw error;
        }
      }
      async completeProject(userId, projectId, artifactUrls, reflectionNotes, selfAssessment) {
        try {
          const completion = await storage.getProjectCompletion(userId, projectId);
          if (!completion) {
            throw new Error("Project completion not found");
          }
          await storage.updateProjectCompletion(completion.id, {
            status: "completed",
            progressPercentage: 100,
            completedAt: /* @__PURE__ */ new Date(),
            artifactUrls,
            reflectionNotes,
            selfAssessment,
            updatedAt: /* @__PURE__ */ new Date()
          });
          if (artifactUrls.length > 0) {
            const project = await storage.getMicroProjectById(projectId);
            if (project) {
              await storage.createPortfolioArtifact({
                userId,
                completionId: completion.id,
                title: `${project.title} - Portfolio`,
                description: project.description,
                artifactType: project.projectType,
                fileUrl: artifactUrls[0],
                skillsDemonstrated: [project.targetSkill],
                tags: project.tags || [],
                isPublic: false,
                isFeatured: false
              });
            }
          }
        } catch (error) {
          console.error("Error completing project:", error);
          throw error;
        }
      }
      // NEW: Generate projects based on target role
      async generateProjectsForRole(targetRole, count = 2) {
        try {
          console.log(`Generating ${count} projects for role: ${targetRole}`);
          const projectsData = await openaiProjectService.generateProjectsFromRole({
            targetRole,
            count
          });
          const storedProjects = await Promise.all(
            projectsData.map(async (projectData) => {
              const projectId = await storage.createMicroProject(projectData);
              return {
                ...projectData,
                id: projectId,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              };
            })
          );
          console.log(`Successfully generated and stored ${storedProjects.length} role-based projects`);
          return storedProjects;
        } catch (error) {
          console.error("Error generating role-based projects:", error);
          throw error;
        }
      }
      // AI-Powered Project Generation Methods (LEGACY - kept for backward compatibility)
      async generateAIPoweredProjects(userId) {
        try {
          const activeResume = await storage.getActiveResume(userId);
          if (!activeResume?.gaps) {
            console.log("No resume analysis found for user:", userId);
            return [];
          }
          const gaps = typeof activeResume.gaps === "string" ? JSON.parse(activeResume.gaps) : activeResume.gaps;
          const improvementAreas = Array.isArray(gaps) ? gaps.map((gap) => gap.category).filter(Boolean) : [];
          console.log("Found resume improvement areas:", improvementAreas);
          if (!improvementAreas || improvementAreas.length === 0) {
            console.log("Improvement areas array is empty for user:", userId);
            return [];
          }
          const userBackground = this.extractUserBackground(activeResume);
          const user = await storage.getUser(userId);
          const targetRole = user?.targetRole || "Product Manager";
          const topSkill = improvementAreas[0];
          const projectRequest = {
            skillGap: topSkill,
            skillCategory: this.getSkillCategory(topSkill),
            userBackground,
            targetRole,
            difficultyLevel: this.getDifficultyForSkill(topSkill)
          };
          console.log("Generating AI-powered project for skill:", topSkill);
          console.log("Project request details:", projectRequest);
          let generatedProject;
          try {
            generatedProject = await openaiProjectService.generateDetailedProject(projectRequest);
          } catch (error) {
            console.log("AI generation failed, using fallback project");
            const fallbackProject = {
              title: `${topSkill} Skills Practice`,
              description: `Learn ${topSkill} through hands-on exercises and real-world scenarios.`,
              targetRole,
              targetSkill: topSkill,
              skillCategory: projectRequest.skillCategory,
              difficultyLevel: projectRequest.difficultyLevel,
              estimatedHours: 10,
              projectType: "practice",
              instructions: [`Complete exercises in ${topSkill}`, "Practice with real scenarios", "Create portfolio deliverables"],
              deliverables: [`${topSkill} project report`, "Portfolio examples"],
              skillsGained: [topSkill],
              relevanceToRole: `Addresses ${topSkill} gap for ${targetRole} role`,
              evaluationCriteria: ["Quality of deliverables", "Skill demonstration"],
              exampleArtifacts: ["Project documentation"],
              datasetUrl: null,
              templateUrl: null,
              repositoryUrl: null,
              tutorialUrl: null,
              portfolioTemplate: null,
              tags: [topSkill.toLowerCase()],
              isActive: true
            };
            const projectId = await storage.createMicroProject(fallbackProject);
            return [{
              ...fallbackProject,
              id: projectId,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }];
          }
          console.log("Successfully generated project:", generatedProject.title);
          const generatedProjects = [generatedProject];
          const storedProjects = await Promise.all(
            generatedProjects.map(async (projectData) => {
              const projectId = await storage.createMicroProject(projectData);
              return {
                ...projectData,
                id: projectId,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              };
            })
          );
          console.log(`Successfully generated ${storedProjects.length} AI-powered projects`);
          return storedProjects;
        } catch (error) {
          console.error("Error generating AI-powered projects:", error);
          return [];
        }
      }
      extractUserBackground(resume) {
        if (!resume || !resume.extractedText) {
          return "Professional with technical background";
        }
        const text2 = resume.extractedText.toLowerCase();
        if (text2.includes("data scientist") || text2.includes("machine learning")) {
          return "Data Scientist";
        } else if (text2.includes("software engineer") || text2.includes("developer")) {
          return "Software Engineer";
        } else if (text2.includes("analyst") || text2.includes("analytics")) {
          return "Data Analyst";
        } else if (text2.includes("researcher")) {
          return "Researcher";
        } else {
          return "Professional with technical background";
        }
      }
      getDifficultyForSkill(skill) {
        const skillLower = skill.toLowerCase();
        if (skillLower.includes("strategy") || skillLower.includes("leadership") || skillLower.includes("go-to-market")) {
          return "advanced";
        }
        if (skillLower.includes("product management") || skillLower.includes("agile") || skillLower.includes("scrum")) {
          return "intermediate";
        }
        return "intermediate";
      }
    };
    microProjectsService = new MicroProjectsService();
  }
});

// server/index.ts
import express2 from "express";
import cookieParser from "cookie-parser";

// server/routes.ts
init_storage();
import { createServer } from "http";
import Stripe from "stripe";

// server/auth.ts
init_storage();
import bcrypt from "bcrypt";
import crypto2 from "crypto";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var SESSION_DURATION = 7 * 24 * 60 * 60 * 1e3;
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateToken() {
  return crypto2.randomBytes(32).toString("hex");
}
async function createSession(userId) {
  await storage.deleteUserSessions(userId);
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  await storage.createSession(userId, token, expiresAt);
  return token;
}
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const session = await storage.getSession(token);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
    const user = session.user;
    if (!user.isVerified) {
      return res.status(401).json({ error: "Email verification required" });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is inactive. Contact your administrator." });
    }
    if (user.institutionId) {
      const license = await storage.getInstitutionLicense(user.institutionId);
      if (!license) {
        return res.status(401).json({ error: "Institution license has expired. Contact your administrator." });
      }
      await storage.updateUser(user.id, { lastActiveAt: /* @__PURE__ */ new Date() });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
function requirePaidFeatures(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const tier = req.user.subscriptionTier;
  if (tier === "paid" || tier === "institutional") {
    return next();
  }
  return res.status(403).json({
    error: "This feature requires a Pro subscription. Upgrade to access Career Roadmaps, Job Matching, Micro-Projects, and more.",
    requiresUpgrade: true
  });
}
async function logout(token) {
  await storage.deleteSession(token);
}

// server/routes.ts
init_ai();

// server/jobs.ts
var JobsService = class {
  coresignalApiKey = process.env.CORESIGNAL_API_KEY || "";
  adzunaAppId = process.env.ADZUNA_APP_ID || "";
  adzunaAppKey = process.env.ADZUNA_APP_KEY || "";
  coresignalBaseUrl = "https://api.coresignal.com/cdapi/v2";
  constructor() {
    if (this.coresignalApiKey) {
      console.log("CoreSignal API credentials loaded successfully");
    } else {
      console.warn("CoreSignal API key not found.");
    }
    if (this.adzunaAppId && this.adzunaAppKey) {
      console.log("Adzuna API credentials loaded successfully (backup)");
    } else {
      console.warn("Adzuna API credentials not found for fallback.");
    }
    console.log("Job matching system initialized with AI-powered skill extraction and compatibility scoring");
  }
  async searchJobs(params, userSkills) {
    let jobs = [];
    let totalCount = 0;
    if (!this.coresignalApiKey) {
      throw new Error("CoreSignal API key is required");
    }
    console.log("Attempting CoreSignal job search (ONLY source)...");
    try {
      const result = await this.searchWithCoreSignal(params);
      console.log(`CoreSignal returned ${result.jobs.length} jobs`);
      jobs = result.jobs;
      totalCount = result.totalCount;
    } catch (error) {
      console.error("CoreSignal API failed:", error.message);
      throw new Error(`CoreSignal API failed: ${error.message}`);
    }
    console.log("Jobs returned without AI scoring - user must click 'AI Match Analysis' for personalized insights");
    return { jobs, totalCount };
  }
  async searchWithCoreSignal(params) {
    const baseUrl = "https://api.coresignal.com";
    const endpoints = [
      `${baseUrl}/cdapi/v2/job_base/search/filter`,
      // CORRECT v2 endpoint
      `${baseUrl}/cdapi/v2/job_base/search/es_dsl`
      // Alternative Elasticsearch DSL endpoint
    ];
    const filterSearchBody = {};
    if (params.query) {
      filterSearchBody.title = params.query;
    }
    if (params.location) {
      filterSearchBody.location = params.location;
    }
    if (params.contractType) {
      filterSearchBody.employment_type = params.contractType;
    }
    filterSearchBody.application_active = true;
    const esSearchBody = {
      "query": {
        "bool": {
          "must": [
            {
              "term": {
                "application_active": true
              }
            }
          ]
        }
      },
      "size": Math.min(params.resultsPerPage || 20, 100),
      "from": ((params.page || 1) - 1) * (params.resultsPerPage || 20)
    };
    if (params.query) {
      esSearchBody.query.bool.must.push({
        "match": {
          "title": params.query
          // Use "title" field as per docs
        }
      });
    }
    if (params.location) {
      esSearchBody.query.bool.must.push({
        "match": {
          "location": params.location
          // Use "location" field as per docs
        }
      });
    }
    console.log("CoreSignal API Key Present:", !!this.coresignalApiKey);
    const endpointBodies = [
      { endpoint: endpoints[0], body: filterSearchBody, type: "filter" },
      { endpoint: endpoints[1], body: esSearchBody, type: "es_dsl" }
    ];
    for (const { endpoint, body, type } of endpointBodies) {
      try {
        console.log(`
=== Trying CoreSignal ${type} endpoint: ${endpoint} ===`);
        console.log(`${type} search body:`, JSON.stringify(body, null, 2));
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "ApiKey": this.coresignalApiKey,
            // CORRECT header name per docs
            "User-Agent": "Pathwise-Jobs/1.0"
          },
          body: JSON.stringify(body)
        });
        console.log(`CoreSignal Response Status: ${response.status} ${response.statusText}`);
        console.log(`CoreSignal Response Headers:`, Object.fromEntries(response.headers.entries()));
        if (response.ok) {
          const data = await response.json();
          console.log(`
*** CoreSignal SUCCESS with endpoint: ${endpoint} ***`);
          console.log("Full Response Keys:", Object.keys(data));
          console.log("Response Structure:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
          const jobIds = Array.isArray(data) ? data : Object.values(data);
          console.log(`CoreSignal returned ${jobIds.length} job IDs`);
          if (jobIds.length > 0) {
            console.log("Sample job IDs:", jobIds.slice(0, 5));
            const jobDetails = [];
            const idsToFetch = jobIds.slice(0, 3);
            console.log(`Fetching ${idsToFetch.length} job details in parallel...`);
            const collectPromises = idsToFetch.map(async (jobId) => {
              try {
                const collectResponse = await fetch(`https://api.coresignal.com/cdapi/v2/job_base/collect/${jobId}`, {
                  method: "GET",
                  headers: {
                    "accept": "application/json",
                    "ApiKey": this.coresignalApiKey
                  }
                });
                if (collectResponse.ok) {
                  const jobData = await collectResponse.json();
                  return { success: true, data: jobData, jobId };
                } else {
                  console.log(`Failed to collect job ${jobId}: ${collectResponse.status}`);
                  return { success: false, jobId, status: collectResponse.status };
                }
              } catch (error) {
                console.log(`Error collecting job ${jobId}:`, error.message);
                return { success: false, jobId, error: error.message };
              }
            });
            const results = await Promise.allSettled(collectPromises);
            results.forEach((result) => {
              if (result.status === "fulfilled" && result.value.success) {
                jobDetails.push(result.value.data);
              }
            });
            console.log(`Successfully collected ${jobDetails.length} job details`);
            const transformedJobs = jobDetails.map((job, index) => {
              return {
                id: job.id?.toString() || `coresignal-${Date.now()}-${index}`,
                title: job.title || "Job Title Not Available",
                company: {
                  display_name: job.company_name || "Company Not Listed"
                },
                location: {
                  display_name: job.location || "Location Not Specified"
                },
                description: job.description || "No description available",
                salary_min: job.salary_min || null,
                salary_max: job.salary_max || null,
                contract_type: job.employment_type || "Not specified",
                created: job.created || (/* @__PURE__ */ new Date()).toISOString(),
                redirect_url: job.url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title || params.query || "")}`,
                source: "CoreSignal API",
                requiredSkills: this.extractSkillsFromDescription(job.description || ""),
                niceToHaveSkills: []
              };
            });
            console.log(`Successfully transformed ${transformedJobs.length} CoreSignal jobs`);
            return {
              jobs: transformedJobs,
              totalCount: jobIds.length
              // Total IDs available
            };
          } else {
            console.log("No jobs found in response - 0 job IDs returned");
            continue;
          }
        } else {
          const errorText = await response.text();
          console.log(`CoreSignal endpoint ${endpoint} failed:`);
          console.log(`Status: ${response.status}`);
          console.log(`Error body:`, errorText);
          continue;
        }
      } catch (error) {
        console.log(`CoreSignal endpoint ${endpoint} threw error:`, error.message);
        console.log(`Error stack:`, error.stack);
        continue;
      }
    }
    throw new Error(`CoreSignal API completely failed. Tried ${endpoints.length} endpoints. Check API key and endpoint URLs.`);
  }
  async searchWithAdzuna(params) {
    const countries = ["gb", "ca", "au", "us"];
    for (const country of countries) {
      try {
        const baseUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search`;
        const searchParams = new URLSearchParams({
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey,
          results_per_page: (params.resultsPerPage || 15).toString(),
          page: (params.page || 1).toString()
        });
        if (params.query) {
          searchParams.append("what", params.query);
        }
        if (params.location) {
          searchParams.append("where", params.location);
        }
        if (params.maxDistance) {
          searchParams.append("distance", params.maxDistance.toString());
        }
        if (params.salaryMin) {
          searchParams.append("salary_min", params.salaryMin.toString());
        }
        if (params.salaryMax) {
          searchParams.append("salary_max", params.salaryMax.toString());
        }
        if (params.contractType) {
          searchParams.append("contract_type", params.contractType);
        }
        console.log(`Trying Adzuna ${country.toUpperCase()}:`, `${baseUrl}?${searchParams}`);
        const response = await fetch(`${baseUrl}?${searchParams}`, {
          headers: {
            "User-Agent": "Pathwise-Job-Matching/1.0",
            "Accept": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(`Adzuna ${country.toUpperCase()} success:`, data?.results?.length || 0, "jobs found");
          if (data.results && data.results.length > 0) {
            const transformedJobs = data.results.map((job) => ({
              id: job.id,
              title: job.title,
              company: { display_name: job.company.display_name || job.company },
              location: { display_name: job.location.display_name || job.location },
              description: job.description,
              salary_min: job.salary_min,
              salary_max: job.salary_max,
              contract_type: job.contract_type,
              created: job.created,
              redirect_url: job.redirect_url,
              // This is the REAL job application URL!
              source: `Adzuna ${country.toUpperCase()}`,
              requiredSkills: this.extractSkillsFromDescription(job.description || ""),
              niceToHaveSkills: []
            }));
            return {
              jobs: transformedJobs,
              totalCount: data.count || transformedJobs.length
            };
          }
        } else {
          console.log(`Adzuna ${country.toUpperCase()} failed:`, response.status);
        }
      } catch (error) {
        console.log(`Adzuna ${country.toUpperCase()} error:`, error.message);
        continue;
      }
    }
    throw new Error("All Adzuna country endpoints failed");
  }
  generateSampleJobs(params) {
    const query = params.query || "Software Engineer";
    const location = params.location || "United States";
    const limit = params.resultsPerPage || 20;
    const sampleJobTemplates = [
      {
        id: "1",
        title: `Senior ${query}`,
        company: { display_name: "TechCorp Inc" },
        location: { display_name: location },
        description: `We are seeking an experienced ${query} to join our innovative team. You will work on cutting-edge projects using the latest technologies. Requirements include strong problem-solving skills, experience with modern development practices, and excellent communication abilities.`,
        salary_min: 8e4,
        salary_max: 12e4,
        contract_type: "permanent",
        created: (/* @__PURE__ */ new Date()).toISOString(),
        redirect_url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`,
        source: "Generated (External APIs Unavailable)",
        requiredSkills: this.getRequiredSkillsForRole(query),
        niceToHaveSkills: this.getNiceToHaveSkillsForRole(query)
      },
      {
        id: "2",
        title: `${query} - Entry Level`,
        company: { display_name: "StartupCo" },
        location: { display_name: location },
        description: `Join our growing team as a ${query}! Perfect opportunity for new graduates or career changers. We offer mentorship, training, and growth opportunities. Looking for candidates with basic knowledge in relevant technologies and eagerness to learn.`,
        salary_min: 6e4,
        salary_max: 85e3,
        contract_type: "permanent",
        created: new Date(Date.now() - 864e5).toISOString(),
        redirect_url: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}`,
        source: "Generated (External APIs Unavailable)",
        requiredSkills: this.getRequiredSkillsForRole(query, "entry"),
        niceToHaveSkills: this.getNiceToHaveSkillsForRole(query, "entry")
      },
      {
        id: "3",
        title: `Lead ${query}`,
        company: { display_name: "Enterprise Solutions LLC" },
        location: { display_name: location },
        description: `Leadership role for an experienced ${query}. You will lead a team of developers, architect solutions, and drive technical decisions. Requires 5+ years of experience, strong leadership skills, and deep technical expertise.`,
        salary_min: 12e4,
        salary_max: 18e4,
        contract_type: "permanent",
        created: new Date(Date.now() - 1728e5).toISOString(),
        redirect_url: `https://www.glassdoor.com/Jobs/${encodeURIComponent(query)}-jobs-SRCH_KO0,${query.length}.htm`,
        source: "Generated (External APIs Unavailable)",
        requiredSkills: this.getRequiredSkillsForRole(query, "senior"),
        niceToHaveSkills: this.getNiceToHaveSkillsForRole(query, "senior")
      }
    ];
    const variations = [];
    for (let i = 0; i < Math.min(limit, 15); i++) {
      const template = sampleJobTemplates[i % sampleJobTemplates.length];
      variations.push({
        ...template,
        id: (i + 1).toString(),
        title: template.title + (i > 2 ? ` (${Math.floor(i / 3) + 1})` : ""),
        company: { display_name: template.company.display_name + (i > 2 ? ` ${Math.floor(i / 3) + 1}` : "") }
      });
    }
    return variations;
  }
  getRequiredSkillsForRole(role, level = "mid") {
    const roleSkills = {
      "data science": {
        entry: ["Python", "SQL", "Statistics", "Excel"],
        mid: ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "Statistics"],
        senior: ["Python", "SQL", "Machine Learning", "Deep Learning", "MLOps", "Cloud Platforms", "Leadership"]
      },
      "software engineer": {
        entry: ["Programming", "Git", "Problem Solving", "Basic Algorithms"],
        mid: ["JavaScript", "React", "Node.js", "Databases", "APIs", "Testing"],
        senior: ["System Design", "Microservices", "Cloud Architecture", "DevOps", "Leadership", "Mentoring"]
      },
      "product manager": {
        entry: ["Communication", "Analytics", "User Research", "Agile"],
        mid: ["Product Strategy", "Data Analysis", "A/B Testing", "Stakeholder Management", "Roadmapping"],
        senior: ["Strategic Planning", "P&L Management", "Team Leadership", "Market Analysis", "Go-to-Market"]
      }
    };
    const normalizedRole = role.toLowerCase();
    for (const [key, levels] of Object.entries(roleSkills)) {
      if (normalizedRole.includes(key)) {
        return levels[level] || levels.mid;
      }
    }
    return level === "entry" ? ["Communication", "Problem Solving", "Teamwork", "Learning Ability"] : level === "senior" ? ["Leadership", "Strategic Thinking", "Project Management", "Communication", "Domain Expertise"] : ["Problem Solving", "Communication", "Technical Skills", "Collaboration"];
  }
  getNiceToHaveSkillsForRole(role, level = "mid") {
    const roleSkills = {
      "data science": {
        entry: ["R", "Tableau", "Power BI", "Jupyter"],
        mid: ["R", "Spark", "Tableau", "Docker", "AWS", "TensorFlow"],
        senior: ["Kubernetes", "Airflow", "Spark", "Advanced Statistics", "Business Strategy"]
      },
      "software engineer": {
        entry: ["HTML/CSS", "Command Line", "IDEs", "Basic Frameworks"],
        mid: ["TypeScript", "Docker", "AWS", "GraphQL", "MongoDB"],
        senior: ["Kubernetes", "Terraform", "System Design", "Architecture Patterns"]
      },
      "product manager": {
        entry: ["SQL", "Figma", "Jira", "Basic Coding"],
        mid: ["SQL", "Python", "Figma", "Customer Interviews", "Metrics"],
        senior: ["Advanced Analytics", "Business Intelligence", "Technical Background"]
      }
    };
    const normalizedRole = role.toLowerCase();
    for (const [key, levels] of Object.entries(roleSkills)) {
      if (normalizedRole.includes(key)) {
        return levels[level] || levels.mid;
      }
    }
    return ["Industry Knowledge", "Certifications", "Additional Languages", "Tools Expertise"];
  }
  calculateCompatibilityScore(job, userSkills, params) {
    let score = 0;
    const weights = {
      requiredSkills: 0.4,
      niceToHaveSkills: 0.2,
      titleMatch: 0.2,
      locationMatch: 0.1,
      experienceMatch: 0.1
    };
    const requiredSkills = job.requiredSkills || this.extractSkillsFromDescription(job.description);
    const requiredMatches = this.countSkillMatches(userSkills, requiredSkills);
    const requiredScore = requiredSkills.length > 0 ? requiredMatches / requiredSkills.length * 100 : 50;
    score += requiredScore * weights.requiredSkills;
    const niceToHaveSkills = job.niceToHaveSkills || [];
    const niceToHaveMatches = this.countSkillMatches(userSkills, niceToHaveSkills);
    const niceToHaveScore = niceToHaveSkills.length > 0 ? niceToHaveMatches / niceToHaveSkills.length * 100 : 0;
    score += niceToHaveScore * weights.niceToHaveSkills;
    const titleScore = this.calculateTitleMatch(job.title, params.query || "");
    score += titleScore * weights.titleMatch;
    const locationScore = this.calculateLocationMatch(job.location?.display_name || "", params.location || "");
    score += locationScore * weights.locationMatch;
    const experienceScore = 75;
    score += experienceScore * weights.experienceMatch;
    return Math.round(Math.min(100, Math.max(0, score)));
  }
  // Get user's resume from storage
  async getUserResume(userId) {
    if (!this.storage) return null;
    try {
      const activeResume = await this.storage.getActiveResume(userId);
      return activeResume?.extractedText || null;
    } catch (error) {
      console.log("Failed to get user resume:", error);
      return null;
    }
  }
  // Calculate AI-powered compatibility score using OpenAI directly
  async calculateAICompatibilityScore(job, userResume, userSkills) {
    try {
      const OpenAI3 = __require("openai");
      const openai3 = new OpenAI3({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `Analyze the compatibility between this candidate and job posting. Provide a realistic compatibility score.

CANDIDATE RESUME:
${userResume.substring(0, 2e3)}...

CANDIDATE SKILLS: ${userSkills.join(", ")}

JOB POSTING:
Title: ${job.title}
Company: ${job.company?.display_name || "Not specified"}
Description: ${job.description?.substring(0, 1e3) || "No description provided"}...

Analyze the match quality and provide a JSON response:
{
  "score": <number between 1-100>,
  "keyStrengths": [<2-3 main strengths that match>],
  "mainConcerns": [<1-2 main gaps or concerns>]
}

Be realistic - most matches are 40-80%, perfect matches (90%+) are rare.`;
      const response = await openai3.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      const score = Math.round(Math.min(100, Math.max(1, result.score || 50)));
      console.log(`AI scored job "${job.title}": ${score}% - Strengths: ${result.keyStrengths?.join(", ") || "None"}`);
      return score;
    } catch (error) {
      console.log("AI scoring failed:", error);
      return this.calculateCompatibilityScore(job, userSkills, {});
    }
  }
  extractSkillsFromDescription(description) {
    const commonSkills = [
      "JavaScript",
      "Python",
      "Java",
      "React",
      "Node.js",
      "SQL",
      "AWS",
      "Docker",
      "TypeScript",
      "Git",
      "HTML",
      "CSS",
      "MongoDB",
      "PostgreSQL",
      "Machine Learning",
      "Data Science",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "R",
      "Tableau",
      "Excel",
      "Leadership",
      "Communication",
      "Project Management",
      "Agile",
      "Scrum"
    ];
    return commonSkills.filter(
      (skill) => description.toLowerCase().includes(skill.toLowerCase())
    );
  }
  countSkillMatches(userSkills, jobSkills) {
    if (!userSkills || !jobSkills) return 0;
    return jobSkills.reduce((matches, jobSkill) => {
      const hasMatch = userSkills.some(
        (userSkill) => userSkill.toLowerCase().includes(jobSkill.toLowerCase()) || jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      );
      return matches + (hasMatch ? 1 : 0);
    }, 0);
  }
  calculateTitleMatch(jobTitle, searchQuery) {
    if (!searchQuery) return 50;
    const jobTitleLower = jobTitle.toLowerCase();
    const queryLower = searchQuery.toLowerCase();
    if (jobTitleLower.includes(queryLower)) return 100;
    if (queryLower.includes(jobTitleLower)) return 90;
    const jobWords = jobTitleLower.split(/\s+/);
    const queryWords = queryLower.split(/\s+/);
    const commonWords = jobWords.filter((word) => queryWords.includes(word));
    return Math.min(100, commonWords.length / Math.max(jobWords.length, queryWords.length) * 100);
  }
  calculateLocationMatch(jobLocation, searchLocation) {
    if (!searchLocation) return 50;
    const jobLocationLower = jobLocation.toLowerCase();
    const searchLocationLower = searchLocation.toLowerCase();
    if (jobLocationLower.includes(searchLocationLower) || searchLocationLower.includes(jobLocationLower)) {
      return 100;
    }
    if (jobLocationLower.includes("remote") || searchLocationLower.includes("remote")) {
      return 90;
    }
    return 30;
  }
  async getJobDetails(jobId) {
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/us/details/${jobId}`;
      const searchParams = new URLSearchParams({
        app_id: this.adzunaAppId,
        app_key: this.adzunaAppKey
      });
      const response = await fetch(`${url}?${searchParams}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Adzuna API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Job details error:", error);
      throw new Error("Failed to get job details");
    }
  }
  async getSalaryStats(params) {
    try {
      const baseUrl = "https://api.adzuna.com/v1/api/jobs/us/salary";
      const searchParams = new URLSearchParams({
        app_id: this.adzunaAppId,
        app_key: this.adzunaAppKey
      });
      if (params.title) {
        searchParams.append("what", params.title);
      }
      if (params.location) {
        searchParams.append("where", params.location);
      }
      const response = await fetch(`${baseUrl}?${searchParams}`);
      if (!response.ok) {
        throw new Error(`Adzuna API error: ${response.status}`);
      }
      const data = await response.json();
      return {
        min: data.min || 0,
        max: data.max || 0,
        median: data.median || 0
      };
    } catch (error) {
      console.error("Salary stats error:", error);
      return null;
    }
  }
  // Placeholder for future CoreSignal integration
  async searchCoreSignalJobs(params) {
    console.log("CoreSignal integration not yet implemented");
    return [];
  }
  // Placeholder for future USAJobs integration
  async searchUSAJobs(params) {
    console.log("USAJobs integration not yet implemented");
    return [];
  }
  // AI-powered skill extraction using OpenAI
  async extractSkillsFromResume(resumeText) {
    try {
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai(), ai_exports));
      const prompt = `Extract the technical and professional skills from this resume text. Return only a JSON array of skills, no additional text.
      
      Focus on:
      - Programming languages and frameworks
      - Tools and technologies 
      - Professional skills and certifications
      - Domain expertise
      
      Resume text:
      ${resumeText}
      
      Return format: ["skill1", "skill2", "skill3"]`;
      const response = await aiService2.generateText(prompt);
      try {
        const skills = JSON.parse(response.trim());
        return Array.isArray(skills) ? skills : [];
      } catch {
        const skillMatches = response.match(/"([^"]+)"/g);
        return skillMatches ? skillMatches.map((s) => s.replace(/"/g, "")) : [];
      }
    } catch (error) {
      console.error("Error extracting skills:", error);
      return [];
    }
  }
};
var jobsService = new JobsService();

// server/beyond-jobs.ts
var BeyondJobsService = class {
  coresignalApiKey = process.env.CORESIGNAL_API_KEY || "";
  constructor() {
    console.log("Beyond Jobs service initialized with working sources:");
    console.log("- GitHub SimplifyJobs (Internships) \u2705");
    console.log("- VolunteerConnector (Volunteer) \u2705");
    if (this.coresignalApiKey) console.log("- CoreSignal (Internships) \u2705");
    else console.log("- CoreSignal \u274C (API key missing - using GitHub only for internships)");
  }
  async searchOpportunities(params) {
    const opportunities2 = [];
    const limit = params.limit || 5;
    const sources = [];
    if (!params.type || params.type === "all" || params.type === "internship") {
      sources.push(this.fetchGitHubInternships());
      if (this.coresignalApiKey) {
        sources.push(this.fetchCoreSignalInternships(params));
      }
    }
    if (!params.type || params.type === "all" || params.type === "volunteer") {
      sources.push(this.fetchVolunteerConnector(params));
    }
    const results = await Promise.allSettled(sources);
    results.forEach((r) => {
      if (r.status === "fulfilled") opportunities2.push(...r.value);
      else console.error("Source failed:", r.reason);
    });
    console.log(`Total opportunities fetched: ${opportunities2.length}`);
    let filtered = opportunities2.sort(() => 0.5 - Math.random());
    if (params.type && params.type !== "all") {
      filtered = filtered.filter((o) => o.type === params.type);
    }
    if (params.remote !== void 0) {
      filtered = filtered.filter((o) => o.remote === params.remote);
    }
    if (params.location) {
      const normalize = (loc) => loc.toLowerCase().replace(/\bnyc\b/g, "new york").replace(/\bny\b/g, "new york").replace(/\bsf\b/g, "san francisco").replace(/\bla\b/g, "los angeles").replace(/\bdc\b/g, "washington");
      const queryLoc = normalize(params.location);
      filtered = filtered.filter(
        (o) => o.location && normalize(o.location).includes(queryLoc)
      );
      console.log(`After location filter (${params.location}): ${filtered.length} opportunities`);
    }
    console.log(`Final result: ${filtered.length} opportunities (limit ${limit})`);
    return filtered.slice(0, limit);
  }
  /** --- GitHub SimplifyJobs Internships --- */
  async fetchGitHubInternships() {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/.github/scripts/listings.json",
        { headers: { "User-Agent": "Pathwise-BeyondJobs/1.0" } }
      );
      if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
      const data = await res.json();
      const listings = Array.isArray(data) ? data : [];
      const active = listings.filter((l) => l && l.active !== false);
      return active.map((l) => ({
        id: `github-${l.id || Math.random().toString(36).slice(2)}`,
        title: l.title || `${l.company_name} Internship`,
        organization: l.company_name || "Company",
        location: l.locations?.join(", ") || "Various",
        type: "internship",
        duration: l.season || l.terms?.join(", ") || "Summer 2026",
        url: l.url || l.application_link || "#",
        description: this.cleanDescription(l.terms?.join(", ") || "Software engineering internship opportunity"),
        remote: l.locations?.some((loc) => loc.toLowerCase().includes("remote")) || false,
        source: "github"
      }));
    } catch (err) {
      console.error("GitHub internships error:", err.message);
      return [];
    }
  }
  /** --- CoreSignal Internships (Premium API) --- */
  async fetchCoreSignalInternships(params) {
    try {
      const body = {
        title: params.keyword || "internship",
        application_active: true
      };
      if (params.location) body.location = params.location;
      const searchRes = await fetch(
        "https://api.coresignal.com/cdapi/v2/job_base/search/filter",
        {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "ApiKey": this.coresignalApiKey
            // Capital K is critical
          },
          body: JSON.stringify(body)
        }
      );
      if (!searchRes.ok) {
        throw new Error(`CoreSignal search failed: ${searchRes.status}`);
      }
      const ids = await searchRes.json();
      const jobIds = Array.isArray(ids) ? ids.slice(0, 5) : [];
      if (jobIds.length === 0) {
        console.log("CoreSignal returned no job IDs for query:", body);
        return [];
      }
      console.log(`CoreSignal found ${jobIds.length} internship IDs, fetching details...`);
      const details = await Promise.all(
        jobIds.map(async (id) => {
          const collectRes = await fetch(
            `https://api.coresignal.com/cdapi/v2/job_base/collect/${id}`,
            {
              headers: {
                "accept": "application/json",
                "ApiKey": this.coresignalApiKey
              }
            }
          );
          return collectRes.ok ? await collectRes.json() : null;
        })
      );
      const validJobs = details.filter(Boolean);
      console.log(`CoreSignal successfully fetched ${validJobs.length} internship details`);
      return validJobs.map((job) => ({
        id: `coresignal-${job.id}`,
        title: job.title || "Internship",
        organization: job.company_name || "Company",
        location: job.location || "Remote",
        type: "internship",
        duration: job.employment_type || "Varies",
        url: job.url || "#",
        description: this.cleanDescription(job.description || ""),
        remote: job.remote_allowed || job.location?.toLowerCase().includes("remote") || false,
        source: "coresignal"
      }));
    } catch (err) {
      console.error("CoreSignal internships error:", err.message);
      return [];
    }
  }
  /** --- VolunteerConnector (Free API with 968+ opportunities) --- */
  async fetchVolunteerConnector(params) {
    try {
      const searchParams = new URLSearchParams();
      if (params.keyword) searchParams.append("q", params.keyword);
      const res = await fetch(
        `https://www.volunteerconnector.org/api/search/?${searchParams}`,
        { headers: { "Accept": "application/json" } }
      );
      if (!res.ok) throw new Error(`VolunteerConnector returned ${res.status}`);
      const data = await res.json();
      const opportunities2 = data.results || [];
      console.log(`VolunteerConnector returned ${opportunities2.length} volunteer opportunities`);
      return opportunities2.slice(0, 10).map((opp) => ({
        id: `vol-${opp.id}`,
        title: opp.title || "Volunteer Opportunity",
        organization: opp.organization?.name || "Organization",
        location: opp.audience?.regions?.join(", ") || "Various",
        type: "volunteer",
        duration: opp.dates || "Ongoing",
        url: opp.organization?.url || `https://www.volunteerconnector.org/opportunity/${opp.id}`,
        description: this.cleanDescription(opp.description || ""),
        remote: !!opp.remote_or_online,
        source: "volunteer-connector"
      }));
    } catch (err) {
      console.error("VolunteerConnector error:", err.message);
      return [];
    }
  }
  /** Utility: Clean HTML from descriptions */
  cleanDescription(desc2) {
    if (!desc2) return "No description available";
    let cleaned = desc2.replace(/<[^>]*>/g, "").trim();
    if (cleaned.length > 200) cleaned = cleaned.substring(0, 197) + "...";
    return cleaned || "No description available";
  }
  /** AI-powered ranking using GPT */
  async getAIRanking(opportunities2, userSkills, resumeGaps, openaiService) {
    try {
      const gapCategories = resumeGaps.map((gap) => gap.category || gap).filter(Boolean);
      const prompt = `You are a career advisor analyzing experiential opportunities for a student.

Student's Skills: ${userSkills.join(", ") || "General skills"}
Resume Gaps: ${gapCategories.join(", ") || "None identified"}

Analyze these opportunities and rank them by relevance (0-100 score). For each opportunity, provide:
1. A relevance score (0-100)
2. A 1-2 sentence explanation

Opportunities:
${opportunities2.map((opp, i) => `
${i + 1}. ${opp.title} (${opp.type})
   Organization: ${opp.organization}
   Description: ${opp.description}
   Location: ${opp.location}
`).join("\n")}

Respond in JSON with this format:
{ "rankings": [ { "opportunityIndex": 0, "relevanceScore": 85, "matchReason": "..." } ] }`;
      const response = await openaiService.generateText(prompt);
      const rankings = JSON.parse(response).rankings;
      return opportunities2.map((opp, index) => {
        const ranking = rankings.find((r) => r.opportunityIndex === index);
        return {
          ...opp,
          relevanceScore: ranking?.relevanceScore || 50,
          matchReason: ranking?.matchReason || "Potentially relevant opportunity"
        };
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error("AI ranking error:", error.message);
      return opportunities2.map((opp) => ({
        ...opp,
        relevanceScore: 50,
        matchReason: "Ranked by source diversity"
      }));
    }
  }
};
var beyondJobsService = new BeyondJobsService();

// server/objectStorage.ts
import { Storage } from "@google-cloud/storage";
import { randomUUID as randomUUID2 } from "crypto";

// server/objectAcl.ts
var ACL_POLICY_METADATA_KEY = "custom:aclPolicy";
function isPermissionAllowed(requested, granted) {
  if (requested === "read" /* READ */) {
    return ["read" /* READ */, "write" /* WRITE */].includes(granted);
  }
  return granted === "write" /* WRITE */;
}
function createObjectAccessGroup(group) {
  switch (group.type) {
    // Implement the case for each type of access group to instantiate.
    //
    // For example:
    // case "USER_LIST":
    //   return new UserListAccessGroup(group.id);
    // case "EMAIL_DOMAIN":
    //   return new EmailDomainAccessGroup(group.id);
    // case "GROUP_MEMBER":
    //   return new GroupMemberAccessGroup(group.id);
    // case "SUBSCRIBER":
    //   return new SubscriberAccessGroup(group.id);
    default:
      throw new Error(`Unknown access group type: ${group.type}`);
  }
}
async function setObjectAclPolicy(objectFile, aclPolicy) {
  const [exists] = await objectFile.exists();
  if (!exists) {
    throw new Error(`Object not found: ${objectFile.name}`);
  }
  await objectFile.setMetadata({
    metadata: {
      [ACL_POLICY_METADATA_KEY]: JSON.stringify(aclPolicy)
    }
  });
}
async function getObjectAclPolicy(objectFile) {
  const [metadata] = await objectFile.getMetadata();
  const aclPolicy = metadata?.metadata?.[ACL_POLICY_METADATA_KEY];
  if (!aclPolicy) {
    return null;
  }
  return JSON.parse(aclPolicy);
}
async function canAccessObject({
  userId,
  objectFile,
  requestedPermission
}) {
  const aclPolicy = await getObjectAclPolicy(objectFile);
  if (!aclPolicy) {
    return false;
  }
  if (aclPolicy.visibility === "public" && requestedPermission === "read" /* READ */) {
    return true;
  }
  if (!userId) {
    return false;
  }
  if (aclPolicy.owner === userId) {
    return true;
  }
  for (const rule of aclPolicy.aclRules || []) {
    const accessGroup = createObjectAccessGroup(rule.group);
    if (await accessGroup.hasMember(userId) && isPermissionAllowed(requestedPermission, rule.permission)) {
      return true;
    }
  }
  return false;
}

// server/objectStorage.ts
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
});
var ObjectNotFoundError = class _ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
  }
};
var ObjectStorageService = class {
  constructor() {
  }
  // Gets the public object search paths.
  getPublicObjectSearchPaths() {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr.split(",").map((path3) => path3.trim()).filter((path3) => path3.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }
  // Gets the private object directory.
  getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }
  // Search for a public object from the search paths.
  async searchPublicObject(filePath) {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }
  // Downloads an object to the response.
  async downloadObject(file, res, cacheTtlSec = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      const aclPolicy = await getObjectAclPolicy(file);
      const isPublic = aclPolicy?.visibility === "public";
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`
      });
      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL() {
    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    const objectId = randomUUID2();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900
    });
  }
  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath) {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }
    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }
  normalizeObjectEntityPath(rawPath) {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;
    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }
    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }
  // Tries to set the ACL policy for the object entity and return the normalized path.
  async trySetObjectEntityAclPolicy(rawPath, aclPolicy) {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }
    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }
  // Checks if the user can access the object entity.
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission
  }) {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? "read" /* READ */
    });
  }
};
function parseObjectPath(path3) {
  if (!path3.startsWith("/")) {
    path3 = `/${path3}`;
  }
  const pathParts = path3.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

// server/email.ts
import { Resend } from "resend";
var resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
var EmailService = class {
  getBaseUrl() {
    if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === "production") {
      return "https://pathwiseinstitutions.org";
    }
    return process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : "http://localhost:5000";
  }
  async sendEmailVerification(data) {
    if (!resend) {
      console.warn("Email service not configured - RESEND_API_KEY is missing");
      return false;
    }
    try {
      const verificationUrl = `${this.getBaseUrl()}/verify-email?token=${data.token}`;
      await resend.emails.send({
        from: "Pathwise <noreply@pathwiseinstitutions.org>",
        to: data.email,
        subject: `Verify your email for ${data.institutionName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Pathwise</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${data.institutionName}</p>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #2d3748; margin-top: 0;">Verify Your Email Address</h2>
                <p style="color: #4a5568; margin-bottom: 20px;">
                  Thank you for joining Pathwise! Please verify your email address to complete your account setup and start building your career roadmap.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            text-decoration: none; 
                            padding: 15px 30px; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            display: inline-block;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Verify Email Address
                  </a>
                </div>
                
                <p style="color: #718096; font-size: 14px; margin-top: 25px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all; color: #4299e1;">${verificationUrl}</span>
                </p>
              </div>
              
              <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                <p>This verification link will expire in 24 hours for security reasons.</p>
                <p>&copy; 2025 Pathwise Institution Edition. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      });
      return true;
    } catch (error) {
      console.error("Failed to send email verification:", error);
      return false;
    }
  }
  async sendInvitation(data) {
    if (!resend) {
      console.warn("Email service not configured - RESEND_API_KEY is missing");
      return false;
    }
    try {
      const invitationUrl = `${this.getBaseUrl()}/register?token=${data.token}`;
      const result = await resend.emails.send({
        from: "Pathwise <noreply@pathwiseinstitutions.org>",
        to: data.email,
        subject: `You're invited to join ${data.institutionName} on Pathwise`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>You're Invited to Pathwise</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Join ${data.institutionName} on Pathwise</p>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #2d3748; margin-top: 0;">Welcome to Your Career Journey</h2>
                <p style="color: #4a5568; margin-bottom: 20px;">
                  <strong>${data.inviterName}</strong> has invited you to join <strong>${data.institutionName}</strong> on Pathwise as a <strong>${data.role}</strong>.
                </p>
                
                <p style="color: #4a5568; margin-bottom: 25px;">
                  Pathwise helps you build personalized career roadmaps, optimize your resume with AI analysis, find the perfect job matches, and track your application progress - all in one comprehensive platform.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${invitationUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            text-decoration: none; 
                            padding: 15px 30px; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            display: inline-block;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Accept Invitation & Join
                  </a>
                </div>
                
                <p style="color: #718096; font-size: 14px; margin-top: 25px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all; color: #4299e1;">${invitationUrl}</span>
                </p>
              </div>
              
              <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                <p>This invitation will expire in 7 days for security reasons.</p>
                <p>&copy; 2025 Pathwise Institution Edition. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      });
      console.log(`\u2705 Invitation email sent successfully to ${data.email}. Resend ID: ${result.data?.id}`);
      return true;
    } catch (error) {
      console.error("Failed to send invitation email:", error);
      if (error && typeof error === "object") {
        console.error("Error details:", JSON.stringify(error, null, 2));
      }
      return false;
    }
  }
  async sendLicenseUsageNotification(data) {
    if (!resend) {
      console.warn("Email service not configured - RESEND_API_KEY is missing");
      return false;
    }
    try {
      await resend.emails.send({
        from: "Pathwise <noreply@pathwiseinstitutions.org>",
        to: data.adminEmail,
        subject: `License Usage Alert: ${data.usagePercentage}% of seats used at ${data.institutionName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>License Usage Alert</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">License Usage Alert</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${data.institutionName}</p>
              </div>
              
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #dc2626; margin-top: 0;">High License Usage Detected</h2>
                <p style="color: #7f1d1d; margin-bottom: 20px;">
                  Your institution is currently using <strong>${data.usedSeats} out of ${data.totalSeats} licensed seats</strong> (${data.usagePercentage}%).
                </p>
                
                <div style="background: white; border-radius: 6px; padding: 20px; margin: 20px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 600; color: #374151;">Current Usage:</span>
                    <span style="font-weight: 600; color: #dc2626;">${data.usagePercentage}%</span>
                  </div>
                  <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: ${data.usagePercentage >= 90 ? "#dc2626" : "#f59e0b"}; height: 100%; width: ${data.usagePercentage}%; transition: width 0.3s ease;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px; color: #6b7280;">
                    <span>${data.usedSeats} used</span>
                    <span>${data.totalSeats - data.usedSeats} remaining</span>
                  </div>
                </div>
                
                <p style="color: #7f1d1d;">
                  ${data.usagePercentage >= 95 ? "You have very few seats remaining. Consider upgrading your license to ensure continuous access for new users." : "Please monitor your usage closely and consider upgrading your license if you need additional seats."}
                </p>
              </div>
              
              <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                <p>This is an automated notification sent when license usage exceeds 80%.</p>
                <p>&copy; 2025 Pathwise Institution Edition. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      });
      return true;
    } catch (error) {
      console.error("Failed to send license usage notification:", error);
      return false;
    }
  }
  async sendContactForm(data) {
    if (!resend) {
      console.warn("Email service not configured - RESEND_API_KEY is missing");
      return false;
    }
    try {
      await resend.emails.send({
        from: "Pathwise Contact Form <noreply@pathwiseinstitutions.org>",
        to: "patrick@pathwiseinstitutions.org",
        replyTo: data.email,
        subject: `Contact Form: ${data.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #2d3748; margin-top: 0;">Contact Details</h2>
                
                <div style="margin-bottom: 20px;">
                  <strong style="color: #4a5568;">Name:</strong>
                  <p style="margin: 5px 0; color: #2d3748;">${data.name}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <strong style="color: #4a5568;">Email:</strong>
                  <p style="margin: 5px 0; color: #2d3748;">
                    <a href="mailto:${data.email}" style="color: #4299e1; text-decoration: none;">${data.email}</a>
                  </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <strong style="color: #4a5568;">Subject:</strong>
                  <p style="margin: 5px 0; color: #2d3748;">${data.subject}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <strong style="color: #4a5568;">Message:</strong>
                  <p style="margin: 5px 0; color: #2d3748; white-space: pre-wrap;">${data.message}</p>
                </div>
              </div>
              
              <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                <p>This email was sent from the Pathwise contact form.</p>
                <p>&copy; 2025 Pathwise Institution Edition. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      });
      return true;
    } catch (error) {
      console.error("Failed to send contact form email:", error);
      return false;
    }
  }
  async sendPasswordReset(data) {
    if (!resend) {
      console.warn("Email service not configured - RESEND_API_KEY is missing");
      return false;
    }
    try {
      const resetUrl = `${this.getBaseUrl()}/reset-password?token=${data.token}`;
      await resend.emails.send({
        from: "Pathwise <noreply@pathwiseinstitutions.org>",
        to: data.email,
        subject: "Reset Your Pathwise Password",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #2d3748; margin-top: 0;">Hello ${data.userName},</h2>
                <p style="color: #4a5568; margin-bottom: 20px;">
                  We received a request to reset your Pathwise password. Click the button below to create a new password.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            text-decoration: none; 
                            padding: 15px 30px; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            display: inline-block;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Reset Password
                  </a>
                </div>
                
                <p style="color: #718096; font-size: 14px; margin-top: 25px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all; color: #4299e1;">${resetUrl}</span>
                </p>
                
                <p style="color: #e53e3e; font-size: 14px; margin-top: 25px; padding: 15px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 4px;">
                  <strong>\u26A0\uFE0F Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </p>
              </div>
              
              <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                <p>This password reset link will expire in 1 hour for security reasons.</p>
                <p>&copy; 2025 Pathwise Institution Edition. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      });
      return true;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return false;
    }
  }
};
var emailService = new EmailService();

// server/routes.ts
init_schema();
import crypto3 from "crypto";
import { z as z3 } from "zod";
import { fromZodError } from "zod-validation-error";
import { Document, Packer, Paragraph, TextRun } from "docx";
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ error: validationError.message });
      }
      const { email, password, firstName, lastName, school, major, gradYear, invitationToken, selectedPlan } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.isActive) {
        return res.status(400).json({ error: "User already exists" });
      }
      if (existingUser && !existingUser.isActive) {
        const reactivatedUser = await storage.activateUser(existingUser.id);
        const token2 = generateToken();
        await storage.createSession(reactivatedUser.id, token2, new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3));
        return res.status(200).json({
          message: "User reactivated successfully",
          user: reactivatedUser,
          token: token2
        });
      }
      let invitation = null;
      let institutionId = null;
      let userRole = "student";
      let subscriptionTier = "free";
      if (invitationToken) {
        invitation = await storage.getInvitationByToken(invitationToken);
        if (!invitation) {
          return res.status(400).json({ error: "Invalid or expired invitation" });
        }
        if (invitation.email !== email) {
          return res.status(400).json({ error: "Email does not match invitation" });
        }
        institutionId = invitation.institutionId;
        userRole = invitation.role;
        subscriptionTier = "institutional";
        if (userRole === "student") {
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (!seatInfo.available) {
            return res.status(400).json({
              error: "No available seats. Please contact your administrator."
            });
          }
        }
      } else {
        const domain = email.split("@")[1];
        const institution = await storage.getInstitutionByDomain(domain);
        if (institution) {
          institutionId = institution.id;
          subscriptionTier = "institutional";
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (!seatInfo.available) {
            return res.status(400).json({
              error: "No available seats. Please contact your administrator."
            });
          }
        } else {
          institutionId = null;
          userRole = "student";
          subscriptionTier = selectedPlan === "paid" ? "paid" : "free";
        }
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        institutionId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: userRole,
        school,
        major,
        gradYear,
        subscriptionTier,
        subscriptionStatus: subscriptionTier === "paid" ? "incomplete" : "active",
        isActive: true,
        // Auto-activate for invited users since email verification is temporarily disabled
        isVerified: true
        // Auto-verify for invited users
      });
      if (invitation) {
        await storage.claimInvitation(invitationToken, user.id);
      }
      if (userRole === "student" && institutionId) {
        const license = await storage.getInstitutionLicense(institutionId);
        if (license && license.licenseType === "per_student") {
          await storage.updateLicenseUsage(license.id, license.usedSeats + 1);
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (license.licensedSeats && seatInfo.usedSeats >= license.licensedSeats * 0.8) {
            const institution = await storage.getInstitution(institutionId);
            const adminUsers = await storage.getInstitutionUsers(institutionId);
            const admins = adminUsers.filter((u) => u.role === "admin");
            for (const admin of admins) {
              await emailService.sendLicenseUsageNotification({
                adminEmail: admin.email,
                institutionName: institution?.name || "Unknown Institution",
                usedSeats: seatInfo.usedSeats,
                totalSeats: seatInfo.totalSeats || 0,
                usagePercentage: Math.round(seatInfo.usedSeats / (seatInfo.totalSeats || 1) * 100)
              });
            }
          }
        }
      }
      console.log(`\u2705 User registered successfully: ${user.id} (${userRole}) for institution ${institutionId}`);
      await storage.createActivity(
        user.id,
        "account_created",
        "Welcome to Pathwise!",
        "Your account is ready to use."
      );
      if (subscriptionTier === "paid") {
        if (!stripe) {
          return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." });
        }
        if (!process.env.STRIPE_PRICE_ID) {
          return res.status(500).json({ error: "Stripe Price ID is not configured. Please add STRIPE_PRICE_ID to your environment variables." });
        }
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id
          }
        });
        await storage.updateUser(user.id, { stripeCustomerId: customer.id });
        const referer = req.get("referer") || "http://localhost:5000";
        const url = new URL(referer);
        const baseUrl = `${url.protocol}//${url.host}`;
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID,
              quantity: 1
            }
          ],
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/register`,
          metadata: {
            userId: user.id
          },
          allow_promotion_codes: true
          // Enable promo code field in Stripe checkout
        });
        return res.status(201).json({
          message: "Registration successful! Redirecting to payment...",
          user: { ...user, password: void 0 },
          requiresPayment: true,
          checkoutUrl: session.url,
          requiresVerification: false
        });
      }
      const token = generateToken();
      await storage.createSession(user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3));
      res.status(201).json({
        message: "Registration successful! You can now log in.",
        user: { ...user, password: void 0 },
        token,
        // Include token for auto-login
        requiresVerification: false
      });
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Incorrect password" });
      }
      const token = await createSession(user.id);
      await storage.createActivity(
        user.id,
        "user_login",
        "Logged In",
        `Welcome back, ${user.firstName}!`
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
      res.json({
        user: { ...user, password: void 0 },
        token
      });
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", authenticate, async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.auth_token;
      if (token) {
        await logout(token);
      }
      res.clearCookie("auth_token");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });
  app2.get("/api/auth/me", authenticate, async (req, res) => {
    res.json(req.user);
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({
          message: "If an account with that email exists, you will receive a password reset link shortly."
        });
      }
      const resetToken = generateToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1e3);
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
        isUsed: false
      });
      await emailService.sendPasswordReset({
        email: user.email,
        token: resetToken,
        userName: user.firstName
      });
      res.json({
        message: "If an account with that email exists, you will receive a password reset link shortly."
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });
  app2.get("/api/auth/reset-password/:token", async (req, res) => {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      res.json({ valid: true });
    } catch (error) {
      console.error("Validate reset token error:", error);
      res.status(500).json({ error: "Failed to validate reset token" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password, confirmPassword } = req.body;
      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      const hashedPassword = await hashPassword(password);
      await storage.updateUser(resetToken.userId, {
        password: hashedPassword
      });
      await storage.markPasswordResetTokenAsUsed(token);
      res.json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
  app2.post("/api/promo-codes/validate", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Promo code is required" });
      }
      const promoCode = await storage.getPromoCodeByCode(code.trim().toUpperCase());
      if (!promoCode) {
        return res.status(404).json({ error: "Invalid or expired promo code" });
      }
      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return res.status(400).json({ error: "Promo code has reached maximum uses" });
      }
      return res.json({
        valid: true,
        type: promoCode.type,
        code: promoCode.code
      });
    } catch (error) {
      console.error("Promo code validation error:", error);
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });
  app2.patch("/api/users/settings", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const settingsSchema = z3.object({
        firstName: z3.string().min(1).optional(),
        lastName: z3.string().min(1).optional(),
        school: z3.string().optional(),
        major: z3.string().optional(),
        gradYear: z3.number().int().min(2e3).max(2040).optional(),
        targetRole: z3.string().optional(),
        location: z3.string().optional(),
        remoteOk: z3.boolean().optional()
      });
      const validated = settingsSchema.parse(updateData);
      const updatedUser = await storage.updateUser(userId, validated);
      res.json(updatedUser);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });
  app2.get("/api/admin/env-check", async (req, res) => {
    try {
      const envStatus = {
        NODE_ENV: process.env.NODE_ENV || "not_set",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "configured" : "missing",
        CORESIGNAL_API_KEY: process.env.CORESIGNAL_API_KEY ? "configured" : "missing",
        ADZUNA_APP_ID: process.env.ADZUNA_APP_ID ? "configured" : "missing",
        ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY ? "configured" : "missing",
        RESEND_API_KEY: process.env.RESEND_API_KEY ? "configured" : "missing",
        DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing"
      };
      res.json({ environmentVariables: envStatus });
    } catch (error) {
      console.error("Error checking environment variables:", error);
      res.status(500).json({ error: "Failed to check environment variables" });
    }
  });
  app2.post("/api/institutions", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only super admins can create institutions" });
      }
      const institutionData = insertInstitutionSchema.parse(req.body);
      const institution = await storage.createInstitution(institutionData);
      res.json(institution);
    } catch (error) {
      console.error("Error creating institution:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/institutions/:id", authenticate, async (req, res) => {
    try {
      const institution = await storage.getInstitution(req.params.id);
      if (!institution) {
        return res.status(404).json({ error: "Institution not found" });
      }
      if (req.user.role !== "super_admin" && req.user.institutionId !== institution.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(institution);
    } catch (error) {
      console.error("Error fetching institution:", error);
      res.status(500).json({ error: "Failed to fetch institution" });
    }
  });
  app2.post("/api/institutions/:id/license", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only super admins can create licenses" });
      }
      const licenseData = insertLicenseSchema.parse({
        ...req.body,
        institutionId: req.params.id
      });
      const license = await storage.createLicense(licenseData);
      res.json(license);
    } catch (error) {
      console.error("Error creating license:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/institutions/:id/license", authenticate, async (req, res) => {
    try {
      const license = await storage.getInstitutionLicense(req.params.id);
      if (!license) {
        return res.status(404).json({ error: "No active license found" });
      }
      if (req.user.role !== "super_admin" && req.user.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      res.json({
        ...license,
        seatInfo
      });
    } catch (error) {
      console.error("Error fetching license:", error);
      res.status(500).json({ error: "Failed to fetch license" });
    }
  });
  app2.post("/api/institutions/:id/invite", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can send invitations" });
      }
      if (req.user.role === "admin" && req.user.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const { email, role = "student" } = inviteUserSchema.parse({
        ...req.body,
        institutionId: req.params.id
      });
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      if (!seatInfo.available && role === "student") {
        return res.status(400).json({
          error: "No available seats. Please upgrade your license or deactivate inactive users."
        });
      }
      const token = crypto3.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      const invitation = await storage.createInvitation({
        institutionId: req.params.id,
        email,
        role,
        invitedBy: req.user.id,
        token,
        expiresAt
      });
      const institution = await storage.getInstitution(req.params.id);
      const emailSent = await emailService.sendInvitation({
        email,
        token,
        institutionName: institution?.name || "Unknown Institution",
        inviterName: `${req.user.firstName} ${req.user.lastName}`,
        role
      });
      if (!emailSent) {
        console.warn("Failed to send invitation email - this is likely due to Resend requiring domain verification for production use");
      }
      res.json({
        message: "Invitation sent successfully",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt
        }
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/institutions/:id/users", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can view user lists" });
      }
      if (req.user.role === "admin" && req.user.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const users2 = await storage.getInstitutionUsers(req.params.id);
      const invitations2 = await storage.getInstitutionInvitations(req.params.id);
      const license = await storage.getInstitutionLicense(req.params.id);
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      res.json({
        users: users2.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          lastActiveAt: user.lastActiveAt,
          createdAt: user.createdAt
        })),
        invitations: invitations2.map((inv) => ({
          id: inv.id,
          email: inv.email,
          role: inv.role,
          status: inv.status,
          expiresAt: inv.expiresAt,
          createdAt: inv.createdAt
        })),
        license,
        seatInfo
      });
    } catch (error) {
      console.error("Error fetching institution users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.delete("/api/institutions/:id/users/:userId", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can terminate users" });
      }
      if (req.user.role === "admin" && req.user.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (req.user.id === req.params.userId) {
        return res.status(400).json({ error: "Cannot terminate your own account" });
      }
      const userToTerminate = await storage.getUser(req.params.userId);
      if (!userToTerminate || userToTerminate.institutionId !== req.params.id) {
        return res.status(404).json({ error: "User not found" });
      }
      await storage.deactivateUser(req.params.userId);
      await storage.deleteUserSessions(req.params.userId);
      if (userToTerminate.institutionId) {
        const license = await storage.getInstitutionLicense(userToTerminate.institutionId);
        if (license && license.licenseType === "per_student" && userToTerminate.role === "student") {
          await storage.updateLicenseUsage(license.id, Math.max(0, license.usedSeats - 1));
        }
      }
      res.json({ message: "User terminated successfully" });
    } catch (error) {
      console.error("Error terminating user:", error);
      res.status(500).json({ error: "Failed to terminate user" });
    }
  });
  app2.delete("/api/institutions/:id/invitations/:invitationId", authenticate, async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can cancel invitations" });
      }
      if (req.user.role === "admin" && req.user.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const invitation = await storage.getInvitation(req.params.invitationId);
      if (!invitation || invitation.institutionId !== req.params.id) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      if (invitation.status !== "pending") {
        return res.status(400).json({ error: "Can only cancel pending invitations" });
      }
      await storage.cancelInvitation(req.params.invitationId);
      res.json({ message: "Invitation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      res.status(500).json({ error: "Failed to cancel invitation" });
    }
  });
  app2.post("/api/verify-email", async (req, res) => {
    try {
      const { token } = verifyEmailSchema.parse(req.body);
      const verification = await storage.getEmailVerification(token);
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }
      const user = await storage.getUserByEmail(verification.email);
      if (user) {
        await storage.updateUser(user.id, { isVerified: true });
        await storage.activateUser(user.id);
        await storage.markEmailVerificationUsed(token);
        if (user.institutionId) {
          const license = await storage.getInstitutionLicense(user.institutionId);
          if (license && license.licenseType === "per_student") {
            await storage.updateLicenseUsage(license.id, license.usedSeats + 1);
            const seatInfo = await storage.checkSeatAvailability(user.institutionId);
            if (license.licensedSeats && seatInfo.usedSeats >= license.licensedSeats * 0.8) {
              const institution = await storage.getInstitution(user.institutionId);
              const adminUsers = await storage.getInstitutionUsers(user.institutionId);
              const admins = adminUsers.filter((u) => u.role === "admin");
              for (const admin of admins) {
                await emailService.sendLicenseUsageNotification({
                  adminEmail: admin.email,
                  institutionName: institution?.name || "Unknown Institution",
                  usedSeats: seatInfo.usedSeats,
                  totalSeats: seatInfo.totalSeats || 0,
                  usagePercentage: Math.round(seatInfo.usedSeats / (seatInfo.totalSeats || 1) * 100)
                });
              }
            }
          }
        }
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/resumes/upload", authenticate, async (req, res) => {
    try {
      const objectStorage = new ObjectStorageService();
      const uploadURL = await objectStorage.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Resume upload URL error:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });
  app2.post("/api/resumes", authenticate, async (req, res) => {
    try {
      const { fileName, filePath, extractedText, targetRole, targetIndustry, targetCompanies } = req.body;
      if (!extractedText) {
        return res.status(400).json({ error: "extractedText is required" });
      }
      if (!targetRole) {
        return res.status(400).json({ error: "targetRole is required" });
      }
      const resume = await storage.createResume({
        userId: req.user.id,
        fileName: fileName || "resume.txt",
        filePath: filePath || "/text-input",
        extractedText
      });
      await storage.createActivity(
        req.user.id,
        "resume_uploaded",
        "Resume Uploaded",
        `Uploaded new resume: ${fileName || "resume.txt"}`
      );
      if (extractedText) {
        try {
          const analysis = await aiService.analyzeResume(
            extractedText,
            targetRole,
            targetIndustry,
            targetCompanies
          );
          console.log("AI Analysis Response:", JSON.stringify(analysis, null, 2));
          await storage.updateResumeAnalysis(resume.id, {
            rmsScore: analysis.rmsScore,
            skillsScore: analysis.skillsScore,
            experienceScore: analysis.experienceScore,
            keywordsScore: analysis.keywordsScore,
            educationScore: analysis.educationScore,
            certificationsScore: analysis.certificationsScore,
            gaps: analysis.gaps,
            overallInsights: analysis.overallInsights,
            sectionAnalysis: analysis.sectionAnalysis
          });
          await storage.createActivity(
            req.user.id,
            "resume_analyzed",
            "Resume Analysis Complete",
            `Your resume scored ${analysis.rmsScore}/100`
          );
        } catch (aiError) {
          console.error("AI analysis error:", aiError);
        }
      }
      res.status(201).json(resume);
    } catch (error) {
      console.error("Resume creation error:", error);
      res.status(500).json({ error: "Failed to create resume" });
    }
  });
  app2.get("/api/resumes", authenticate, async (req, res) => {
    try {
      const resumes2 = await storage.getUserResumes(req.user.id);
      res.json(resumes2);
    } catch (error) {
      console.error("Get resumes error:", error);
      res.status(500).json({ error: "Failed to get resumes" });
    }
  });
  app2.get("/api/resumes/active", authenticate, async (req, res) => {
    try {
      const resume = await storage.getActiveResume(req.user.id);
      res.json(resume || null);
    } catch (error) {
      console.error("Get active resume error:", error);
      res.status(500).json({ error: "Failed to get active resume" });
    }
  });
  app2.post("/api/roadmaps/generate", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { phase } = req.body;
      if (!["30_days", "3_months", "6_months"].includes(phase)) {
        return res.status(400).json({ error: "Invalid phase" });
      }
      const activeResume = await storage.getActiveResume(req.user.id);
      let resumeAnalysis;
      if (activeResume?.gaps) {
        resumeAnalysis = {
          rmsScore: activeResume.rmsScore || 0,
          skillsScore: activeResume.skillsScore || 0,
          experienceScore: activeResume.experienceScore || 0,
          keywordsScore: activeResume.keywordsScore || 0,
          educationScore: activeResume.educationScore || 0,
          certificationsScore: activeResume.certificationsScore || 0,
          gaps: activeResume.gaps
        };
      }
      const roadmapData = await aiService.generateCareerRoadmap(
        phase,
        req.user,
        resumeAnalysis
      );
      const roadmap = await storage.createRoadmap({
        userId: req.user.id,
        phase,
        title: roadmapData.title,
        description: roadmapData.description,
        actions: roadmapData.actions
      });
      await storage.createActivity(
        req.user.id,
        "roadmap_generated",
        `${roadmapData.title} Created`,
        `Your ${phase.replace("_", "-")} roadmap is ready`
      );
      res.status(201).json(roadmap);
    } catch (error) {
      console.error("Roadmap generation error:", error);
      res.status(500).json({ error: "Failed to generate roadmap" });
    }
  });
  app2.get("/api/roadmaps", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const roadmaps2 = await storage.getUserRoadmaps(req.user.id);
      res.json(roadmaps2);
    } catch (error) {
      console.error("Get roadmaps error:", error);
      res.status(500).json({ error: "Failed to get roadmaps" });
    }
  });
  app2.put("/api/roadmaps/:id/progress", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      if (typeof progress !== "number" || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Progress must be between 0 and 100" });
      }
      const roadmap = await storage.updateRoadmapProgress(id, progress);
      res.json(roadmap);
    } catch (error) {
      console.error("Update roadmap progress error:", error);
      res.status(500).json({ error: "Failed to update roadmap progress" });
    }
  });
  app2.post("/api/roadmaps/:id/tasks/:taskId/complete", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id: roadmapId, taskId } = req.params;
      const userId = req.user.id;
      const roadmap = await storage.updateTaskCompletion(roadmapId, taskId, userId, true);
      res.json(roadmap);
    } catch (error) {
      console.error("Task completion error:", error);
      res.status(500).json({ error: "Failed to mark task as complete" });
    }
  });
  app2.delete("/api/roadmaps/:id/tasks/:taskId/complete", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id: roadmapId, taskId } = req.params;
      const userId = req.user.id;
      const roadmap = await storage.updateTaskCompletion(roadmapId, taskId, userId, false);
      res.json(roadmap);
    } catch (error) {
      console.error("Task uncomplete error:", error);
      res.status(500).json({ error: "Failed to mark task as incomplete" });
    }
  });
  app2.get("/api/roadmaps/:id/completion-status", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id: roadmapId } = req.params;
      const userId = req.user.id;
      const completionStatus = await storage.getTaskCompletionStatus(roadmapId, userId);
      res.json(completionStatus);
    } catch (error) {
      console.error("Get completion status error:", error);
      res.status(500).json({ error: "Failed to get completion status" });
    }
  });
  app2.put("/api/roadmaps/:id/actions/:actionId/complete", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id: roadmapId, actionId } = req.params;
      const userId = req.user.id;
      const roadmap = await storage.updateActionCompletion(roadmapId, actionId, userId, true);
      res.json(roadmap);
    } catch (error) {
      console.error("Legacy action completion error:", error);
      res.status(500).json({ error: "Failed to mark action as complete" });
    }
  });
  app2.get("/api/jobs/search", async (req, res) => {
    try {
      const {
        query = "software engineer",
        location = "United States",
        page = "1",
        limit = "20"
      } = req.query;
      console.log("Job search params:", { query, location, page, limit });
      let userSkills = [];
      try {
        if (req.user?.id) {
          const activeResume = await storage.getActiveResume(req.user.id);
          if (activeResume?.extractedText) {
          }
        }
        if (userSkills.length === 0) {
          userSkills = ["JavaScript", "Python", "React", "SQL", "Machine Learning"];
          console.log("Using demo skills:", userSkills);
        } else {
          console.log("Using user skills from resume:", userSkills);
        }
      } catch (error) {
        console.error("Error extracting skills from resume:", error);
        userSkills = ["JavaScript", "Python", "React", "SQL", "Machine Learning"];
      }
      const jobsData = await jobsService.searchJobs({
        query,
        location,
        page: parseInt(page),
        resultsPerPage: parseInt(limit)
      }, userSkills);
      console.log("Jobs found:", jobsData.jobs.length);
      if (jobsData.jobs.length > 0 && jobsData.jobs[0].compatibilityScore) {
        console.log("Sample compatibility scores:", jobsData.jobs.slice(0, 3).map((j) => ({ title: j.title, score: j.compatibilityScore })));
      }
      if (req.user?.id) {
        await storage.createActivity(
          req.user.id,
          "job_search_performed",
          "Job Search",
          `Searched for "${query}" in ${location} - found ${jobsData.jobs.length} results`
        );
      }
      res.json({
        jobs: jobsData.jobs,
        totalCount: jobsData.totalCount,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error("Job search error:", error);
      res.status(500).json({ error: "Failed to search jobs" });
    }
  });
  app2.post("/api/jobs/match-analysis", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      console.log("Match analysis request received from user:", req.user?.id);
      const { jobId, jobData } = req.body;
      if (!jobData) {
        console.log("Missing job data in request");
        return res.status(400).json({ error: "Job data is required" });
      }
      console.log("Job data received:", { title: jobData.title, company: jobData.company?.display_name });
      const activeResume = await storage.getActiveResume(req.user.id);
      console.log("Active resume found:", !!activeResume?.extractedText);
      if (!activeResume?.extractedText) {
        return res.status(400).json({ error: "No active resume found. Please upload a resume first." });
      }
      console.log("Calling AI service for match analysis...");
      const matchAnalysis = await aiService.analyzeJobMatch(activeResume.extractedText, jobData);
      console.log("AI analysis completed successfully");
      res.json(matchAnalysis);
    } catch (error) {
      console.error("Job match analysis error:", error);
      res.status(500).json({ error: "Failed to analyze job match" });
    }
  });
  app2.get("/api/jobs/matches", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const jobMatches2 = await storage.getUserJobMatches(req.user.id, limit);
      res.json(jobMatches2);
    } catch (error) {
      console.error("Get job matches error:", error);
      res.status(500).json({ error: "Failed to get job matches" });
    }
  });
  app2.get("/api/beyond-jobs/search", authenticate, async (req, res) => {
    try {
      const {
        type,
        location,
        keyword,
        remote,
        limit
      } = req.query;
      const opportunities2 = await beyondJobsService.searchOpportunities({
        type,
        location,
        keyword,
        remote: remote === "true",
        limit: limit ? parseInt(limit) : 5
      });
      res.json({ opportunities: opportunities2, totalCount: opportunities2.length });
    } catch (error) {
      console.error("Beyond Jobs search error:", error);
      res.status(500).json({ error: "Failed to search opportunities" });
    }
  });
  app2.post("/api/beyond-jobs/ai-rank", authenticate, async (req, res) => {
    try {
      const { opportunities: opportunities2 } = req.body;
      const activeResume = await storage.getActiveResume(req.user.id);
      if (!activeResume) {
        return res.status(400).json({ error: "No active resume found" });
      }
      const userSkills = activeResume.extractedText ? aiService.extractSkills(activeResume.extractedText) : [];
      const resumeGaps = activeResume.gaps || [];
      const rankedOpportunities = await beyondJobsService.getAIRanking(
        opportunities2,
        userSkills,
        resumeGaps,
        aiService
      );
      res.json({ opportunities: rankedOpportunities });
    } catch (error) {
      console.error("AI ranking error:", error);
      res.status(500).json({ error: "Failed to rank opportunities" });
    }
  });
  app2.post("/api/beyond-jobs/save", authenticate, async (req, res) => {
    try {
      const { opportunityData } = req.body;
      const savedOpportunity = await storage.saveOpportunity(req.user.id, opportunityData);
      res.json(savedOpportunity);
    } catch (error) {
      console.error("Save opportunity error:", error);
      res.status(500).json({ error: "Failed to save opportunity" });
    }
  });
  app2.get("/api/beyond-jobs/saved", authenticate, async (req, res) => {
    try {
      const saved = await storage.getSavedOpportunities(req.user.id);
      res.json(saved);
    } catch (error) {
      console.error("Get saved opportunities error:", error);
      res.status(500).json({ error: "Failed to get saved opportunities" });
    }
  });
  app2.get("/api/copilot/tailored-resumes", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("Fetching tailored resumes for user:", userId);
      const tailoredResumes2 = await storage.getTailoredResumes(userId);
      console.log("Retrieved tailored resumes count:", tailoredResumes2.length);
      console.log("First resume:", tailoredResumes2[0] ? { id: tailoredResumes2[0].id, jobTitle: tailoredResumes2[0].jobTitle, company: tailoredResumes2[0].company } : "none");
      res.json(tailoredResumes2);
    } catch (error) {
      console.error("Error fetching tailored resumes:", error);
      res.status(500).json({ error: "Failed to fetch tailored resumes" });
    }
  });
  app2.post("/api/copilot/cover-letter", authenticate, async (req, res) => {
    try {
      const { jobTitle, company, jobDescription, resumeText } = req.body;
      if (!jobTitle || !company || !jobDescription || !resumeText) {
        return res.status(400).json({
          error: "jobTitle, company, jobDescription, and resumeText are required"
        });
      }
      const coverLetter = await aiService.generateCoverLetter(
        resumeText,
        jobDescription,
        company,
        jobTitle
      );
      res.json({ coverLetter });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  });
  app2.post("/api/copilot/salary-negotiation", authenticate, async (req, res) => {
    try {
      const { currentSalary, targetSalary, jobRole, location, yearsExperience } = req.body;
      if (!targetSalary || !jobRole) {
        return res.status(400).json({ error: "targetSalary and jobRole are required" });
      }
      const resume = await storage.getActiveResume(req.user.id);
      if (!resume?.extractedText) {
        return res.status(400).json({ error: "Resume required for personalized salary negotiation" });
      }
      const negotiationStrategy = await aiService.generateSalaryNegotiationStrategy({
        currentSalary,
        targetSalary,
        jobRole,
        location,
        yearsExperience,
        resumeText: resume.extractedText
      });
      res.json({ strategy: negotiationStrategy });
    } catch (error) {
      console.error("Error generating salary negotiation strategy:", error);
      res.status(500).json({ error: "Failed to generate salary negotiation strategy" });
    }
  });
  app2.post("/api/copilot/update-resume-from-roadmap", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const resume = await storage.getActiveResume(userId);
      if (!resume?.extractedText) {
        return res.status(400).json({ error: "Resume required for auto-update" });
      }
      const roadmaps2 = await storage.getUserRoadmaps(userId);
      const completedTasks = roadmaps2.filter((r) => r.progress === 100);
      if (completedTasks.length === 0) {
        return res.status(400).json({ error: "No completed roadmap tasks to sync with resume" });
      }
      const updatedResume = await aiService.updateResumeFromRoadmap({
        resumeText: resume.extractedText,
        completedTasks: completedTasks.map((task) => ({
          title: task.title,
          description: task.description || void 0,
          actions: task.actions
        }))
      });
      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume from roadmap:", error);
      res.status(500).json({ error: "Failed to update resume from roadmap" });
    }
  });
  app2.post("/api/jobs/tailor-resume", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { jobData, baseResumeId } = req.body;
      if (!jobData) {
        return res.status(400).json({ error: "Job data is required" });
      }
      const resume = baseResumeId ? (await storage.getUserResumes(req.user.id)).find((r) => r?.id === baseResumeId) : await storage.getActiveResume(req.user.id);
      if (!resume?.extractedText) {
        return res.status(400).json({ error: "Resume text not available. Please upload a resume first." });
      }
      const targetKeywords = jobData.description?.split(/\s+/).filter((word) => word.length > 3).slice(0, 20) || [];
      const tailoredResult = await aiService.tailorResume(
        resume.extractedText,
        jobData.description || "",
        targetKeywords,
        req.user
      );
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(tailoredResult.tailoredContent)]
            })
          ]
        }]
      });
      const docxBuffer = await Packer.toBuffer(doc);
      const jobMatchData = {
        userId: req.user.id,
        externalJobId: jobData.id || `external-${Date.now()}`,
        title: jobData.title || "Job Position",
        company: jobData.company?.display_name || jobData.company || "Company",
        location: jobData.location || "",
        description: jobData.description || "",
        requirements: jobData.requirements || "",
        salary: jobData.salary?.display || "",
        compatibilityScore: tailoredResult.jobSpecificScore || 0,
        matchReasons: [],
        skillsGaps: [],
        source: "job_matching"
      };
      console.log("Creating job match with data:", { ...jobMatchData, description: jobMatchData.description?.slice(0, 100) + "..." });
      const jobMatch = await storage.createJobMatch(jobMatchData);
      console.log("Job match created:", { id: jobMatch.id, title: jobMatch.title });
      const tailoredResumeData = {
        userId: req.user.id,
        baseResumeId: resume.id,
        jobMatchId: jobMatch.id,
        tailoredContent: tailoredResult.tailoredContent,
        diffJson: tailoredResult.diffJson,
        jobSpecificScore: tailoredResult.jobSpecificScore,
        keywordsCovered: tailoredResult.keywordsCovered,
        remainingGaps: tailoredResult.remainingGaps
      };
      console.log("Creating tailored resume with data:", { userId: tailoredResumeData.userId, baseResumeId: tailoredResumeData.baseResumeId, jobMatchId: tailoredResumeData.jobMatchId });
      const tailoredResumeRecord = await storage.createTailoredResume(tailoredResumeData);
      console.log("Tailored resume created:", { id: tailoredResumeRecord.id, userId: tailoredResumeRecord.userId });
      await storage.createActivity(
        req.user.id,
        "resume_tailored",
        "Resume Tailored",
        `Resume optimized for ${jobData.company?.display_name || "Company"} - ${jobData.title}`
      );
      res.status(201).json({
        id: tailoredResumeRecord.id,
        jobMatchId: jobMatch.id,
        tailoredContent: tailoredResult.tailoredContent,
        jobSpecificScore: tailoredResult.jobSpecificScore,
        keywordsCovered: tailoredResult.keywordsCovered,
        remainingGaps: tailoredResult.remainingGaps,
        diffJson: tailoredResult.diffJson,
        docxBuffer: docxBuffer.toString("base64"),
        jobTitle: jobData.title,
        companyName: jobData.company?.display_name || "Company"
      });
    } catch (error) {
      console.error("Resume tailoring error:", error);
      res.status(500).json({ error: "Failed to tailor resume" });
    }
  });
  app2.post("/api/applications", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const applicationData = req.body;
      console.log("Raw application data:", applicationData);
      const processedData = {
        ...applicationData,
        userId: req.user.id,
        appliedDate: applicationData.appliedDate ? new Date(applicationData.appliedDate) : /* @__PURE__ */ new Date()
      };
      console.log("Processed application data:", {
        ...processedData,
        appliedDate: processedData.appliedDate?.toISOString?.() || processedData.appliedDate
      });
      const application = await storage.createApplication(processedData);
      await storage.createActivity(
        req.user.id,
        "application_submitted",
        "Application Submitted",
        `Applied to ${application.company} for ${application.position}`
      );
      res.status(201).json(application);
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });
  app2.get("/api/applications", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const applications2 = await storage.getUserApplications(req.user.id);
      res.json(applications2);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });
  app2.put("/api/applications/:id/status", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, responseDate } = req.body;
      const application = await storage.updateApplicationStatus(
        id,
        status,
        responseDate ? new Date(responseDate) : void 0
      );
      res.json(application);
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });
  app2.post("/api/ai/cover-letter", authenticate, async (req, res) => {
    try {
      const { jobDescription, company, role } = req.body;
      const activeResume = await storage.getActiveResume(req.user.id);
      if (!activeResume?.extractedText) {
        return res.status(400).json({ error: "No active resume found" });
      }
      const coverLetter = await aiService.generateCoverLetter(
        activeResume.extractedText,
        jobDescription,
        company,
        role
      );
      res.json({ coverLetter });
    } catch (error) {
      console.error("Cover letter generation error:", error);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  });
  app2.post("/api/ai/linkedin-optimize", authenticate, async (req, res) => {
    try {
      const { currentProfile } = req.body;
      const optimization = await aiService.optimizeLinkedInProfile(
        currentProfile,
        req.user.targetRole || "Professional",
        req.user.industries || []
      );
      res.json(optimization);
    } catch (error) {
      console.error("LinkedIn optimization error:", error);
      res.status(500).json({ error: "Failed to optimize LinkedIn profile" });
    }
  });
  app2.get("/api/activities", authenticate, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities2 = await storage.getUserActivities(req.user.id, limit);
      res.json(activities2);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  });
  app2.get("/api/achievements", authenticate, async (req, res) => {
    try {
      const achievements2 = await storage.getUserAchievements(req.user.id);
      res.json(achievements2);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ error: "Failed to get achievements" });
    }
  });
  app2.get("/api/dashboard/stats", authenticate, async (req, res) => {
    try {
      const [
        activeResume,
        applications2,
        roadmaps2,
        achievements2,
        activities2,
        jobMatches2
      ] = await Promise.all([
        storage.getActiveResume(req.user.id),
        storage.getUserApplications(req.user.id),
        storage.getUserRoadmaps(req.user.id),
        storage.getUserAchievements(req.user.id),
        storage.getUserActivities(req.user.id, 5),
        storage.getUserJobMatches(req.user.id, 10)
      ]);
      const rmsScoreImprovement = activeResume?.rmsScore ? Math.max(0, activeResume.rmsScore - 45) : 0;
      const applicationStats = {
        total: applications2.length,
        pending: applications2.filter((app3) => app3.status === "applied").length,
        interviewing: applications2.filter((app3) => ["interview_scheduled", "interviewed"].includes(app3.status)).length,
        rejected: applications2.filter((app3) => app3.status === "rejected").length,
        offers: applications2.filter((app3) => app3.status === "offered").length
      };
      const today = /* @__PURE__ */ new Date();
      let currentStreak = 0;
      const recentDays = 30;
      for (let i = 0; i < recentDays; i++) {
        const dayToCheck = new Date(today);
        dayToCheck.setDate(today.getDate() - i);
        const dayStart = new Date(dayToCheck.setHours(0, 0, 0, 0));
        const dayEnd = new Date(dayToCheck.setHours(23, 59, 59, 999));
        const hasActivity = activities2.some((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= dayStart && activityDate <= dayEnd;
        });
        if (hasActivity) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      const activeRoadmap = roadmaps2.find((r) => r.isActive === true) || roadmaps2[0];
      const phaseLabels = {
        "30_days": "30-Day Career Advancement Plan",
        "3_months": "3-Month Foundation Building",
        "6_months": "6-Month Career Transformation"
      };
      const currentPhase = activeRoadmap ? {
        title: activeRoadmap.title || phaseLabels[activeRoadmap.phase] || "30-Day Career Advancement Plan",
        progress: activeRoadmap.progress || 0,
        phase: activeRoadmap.phase || "30_days"
      } : null;
      const aiInsights = activeResume?.gaps && Array.isArray(activeResume.gaps) ? {
        topRecommendations: [...activeResume.gaps].map((gap) => ({
          // Normalize the gap data structure
          category: gap.category || "General Improvement",
          rationale: gap.rationale || gap.recommendation || gap.description || "No details provided",
          priority: (gap.priority || "medium").toLowerCase(),
          impact: Number(gap.impact) || 0
        })).sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          const aScore = (priorityWeight[a.priority] || 1) * (a.impact || 0);
          const bScore = (priorityWeight[b.priority] || 1) * (b.impact || 0);
          return bScore - aScore;
        }).slice(0, 2)
        // Get top 2 recommendations
      } : null;
      const currentRoadmapTasks = activeRoadmap && activeRoadmap.subsections ? activeRoadmap.subsections.flatMap(
        (subsection) => (subsection.tasks || []).map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.completed ? "completed" : "pending",
          completed: task.completed,
          priority: task.priority || "medium",
          dueDate: task.dueDate,
          icon: task.icon || "clock"
        }))
      ).slice(0, 3) : [];
      const stats = {
        rmsScore: activeResume?.rmsScore || 0,
        rmsScoreImprovement,
        applicationsCount: applications2.length,
        pendingApplications: applicationStats.pending,
        interviewingCount: applicationStats.interviewing,
        applicationStats,
        roadmapProgress: roadmaps2.length > 0 ? Math.round(roadmaps2.reduce((sum, r) => sum + (r.progress || 0), 0) / roadmaps2.length) : 0,
        currentPhase,
        currentRoadmapTasks,
        achievementsCount: achievements2.length,
        recentActivities: activities2,
        topJobMatches: jobMatches2.slice(0, 5),
        streak: Math.max(1, currentStreak),
        totalActivities: activities2.length,
        aiInsights,
        weeklyProgress: {
          applicationsThisWeek: applications2.filter((app3) => {
            const weekAgo = /* @__PURE__ */ new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(app3.appliedDate) > weekAgo;
          }).length,
          activitiesThisWeek: activities2.filter((activity) => {
            const weekAgo = /* @__PURE__ */ new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(activity.createdAt) > weekAgo;
          }).length
        }
      };
      if (req.user) {
        req.user.streak = stats.streak;
        req.user.unreadNotifications = Math.min(9, stats.totalActivities);
      }
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });
  app2.post("/api/interview-prep/generate-questions", authenticate, async (req, res) => {
    try {
      const { applicationId, category, count = 10 } = req.body;
      if (!applicationId || !category) {
        return res.status(400).json({ error: "Application ID and category are required" });
      }
      const applications2 = await storage.getUserApplications(req.user.id);
      const application = applications2.find((app3) => app3.id === applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      const questions = await aiService.generateInterviewQuestions(
        application.position,
        application.company,
        category,
        count
      );
      res.json(questions);
    } catch (error) {
      console.error("Generate interview questions error:", error);
      res.status(500).json({ error: "Failed to generate interview questions" });
    }
  });
  app2.get("/api/interview-prep/questions", authenticate, async (req, res) => {
    try {
      const { applicationId, category } = req.query;
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }
      const applications2 = await storage.getUserApplications(req.user.id);
      const application = applications2.find((app3) => app3.id === applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json([]);
    } catch (error) {
      console.error("Get interview questions error:", error);
      res.status(500).json({ error: "Failed to get interview questions" });
    }
  });
  app2.get("/api/interview-prep/resources", authenticate, async (req, res) => {
    try {
      const { applicationId } = req.query;
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }
      const applications2 = await storage.getUserApplications(req.user.id);
      const application = applications2.find((app3) => app3.id === applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      let skills = [];
      if (application.jobMatchId) {
        try {
          const jobMatches2 = await storage.getUserJobMatches(req.user.id);
          const jobMatch = jobMatches2.find((jm) => jm.id === application.jobMatchId);
          if (jobMatch && jobMatch.requirements) {
            const commonSkills = ["JavaScript", "Python", "SQL", "React", "Node.js", "AWS", "Docker", "Git"];
            skills = commonSkills.filter(
              (skill) => jobMatch.requirements?.toLowerCase().includes(skill.toLowerCase())
            );
          }
        } catch (error) {
          console.error("Error fetching job match for skills:", error);
        }
      }
      console.log(`Generating resources for ${application.position} at ${application.company} with skills:`, skills);
      const resources2 = await aiService.generatePrepResources(
        application.position,
        application.company,
        skills
      );
      console.log("OpenAI returned resources:", JSON.stringify(resources2, null, 2));
      res.json(resources2);
    } catch (error) {
      console.error("Get prep resources error:", error);
      res.status(500).json({ error: "Failed to get preparation resources" });
    }
  });
  app2.post("/api/skill-gaps", authenticate, async (req, res) => {
    try {
      const validatedData = insertSkillGapAnalysisSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      if (!validatedData.resumeId && !validatedData.jobMatchId) {
        return res.status(400).json({ error: "Either resumeId or jobMatchId is required" });
      }
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      const analysis = await microProjectsService2.analyzeSkillGaps(
        req.user.id,
        validatedData.resumeId,
        validatedData.jobMatchId,
        validatedData.targetRole
      );
      res.status(201).json(analysis);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error analyzing skill gaps:", error);
      res.status(500).json({ error: "Failed to analyze skill gaps" });
    }
  });
  app2.get("/api/skill-gaps", authenticate, async (req, res) => {
    try {
      const analyses = await storage.getSkillGapAnalysesByUser(req.user.id);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching skill gap analyses:", error);
      res.status(500).json({ error: "Failed to fetch skill gap analyses" });
    }
  });
  app2.get("/api/skill-gaps/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      if (analysis.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching skill gap analysis:", error);
      res.status(500).json({ error: "Failed to fetch skill gap analysis" });
    }
  });
  app2.patch("/api/skill-gaps/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      if (analysis.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const updates = insertSkillGapAnalysisSchema.partial().parse(req.body);
      res.json({ message: "Update endpoint not yet implemented" });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error updating skill gap analysis:", error);
      res.status(500).json({ error: "Failed to update skill gap analysis" });
    }
  });
  app2.delete("/api/skill-gaps/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      if (analysis.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.status(204).json({ message: "Delete endpoint not yet implemented" });
    } catch (error) {
      console.error("Error deleting skill gap analysis:", error);
      res.status(500).json({ error: "Failed to delete skill gap analysis" });
    }
  });
  app2.post("/api/micro-projects/generate", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { skillGapAnalysisId } = req.body;
      if (!skillGapAnalysisId) {
        return res.status(400).json({ error: "Skill gap analysis ID is required" });
      }
      const analysis = await storage.getSkillGapAnalysisById(skillGapAnalysisId);
      if (!analysis || analysis.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied to skill gap analysis" });
      }
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      const projects = await microProjectsService2.generateMicroProjectsForSkillGaps(skillGapAnalysisId);
      res.status(201).json(projects);
    } catch (error) {
      console.error("Error generating micro-projects:", error);
      res.status(500).json({ error: "Failed to generate micro-projects" });
    }
  });
  app2.get("/api/micro-projects", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { skills, limit = 20, offset = 0 } = req.query;
      let projects;
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        projects = await storage.getMicroProjectsBySkills(skillsArray);
      } else {
        projects = await storage.getAllMicroProjects(Number(limit), Number(offset));
      }
      res.json(projects);
    } catch (error) {
      console.error("Error fetching micro-projects:", error);
      res.status(500).json({ error: "Failed to fetch micro-projects" });
    }
  });
  app2.get("/api/micro-projects/recommended", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      const projects = await microProjectsService2.getRecommendedProjectsForUser(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching recommended projects:", error);
      res.status(500).json({ error: "Failed to fetch recommended projects" });
    }
  });
  app2.post("/api/micro-projects/generate-from-role", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { targetRole, count } = req.body;
      if (!targetRole || typeof targetRole !== "string") {
        return res.status(400).json({ error: "Target role is required" });
      }
      const projectCount = count && typeof count === "number" && count >= 1 && count <= 3 ? count : 2;
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      console.log(`Generating ${projectCount} projects for role: ${targetRole}`);
      const newProjects = await microProjectsService2.generateProjectsForRole(targetRole, projectCount);
      if (newProjects.length > 0) {
        await storage.createActivity(
          req.user.id,
          "role_projects_generated",
          "Role-Based Projects Generated",
          `Generated ${newProjects.length} project(s) for ${targetRole}`
        );
      }
      res.json({
        message: `Generated ${newProjects.length} project(s) for ${targetRole}`,
        projects: newProjects
      });
    } catch (error) {
      console.error("Error generating role-based projects:", error);
      res.status(500).json({ error: "Failed to generate projects from role" });
    }
  });
  app2.post("/api/micro-projects/generate-ai", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      console.log(`Generating single AI project for user ${req.user.id}`);
      const newProjects = await microProjectsService2.generateAIPoweredProjects(req.user.id);
      if (newProjects.length > 0) {
        await storage.createActivity(
          req.user.id,
          "ai_project_generated",
          "AI Project Generated",
          `Generated new practice project: ${newProjects[0].title}`
        );
      }
      if (newProjects.length === 0) {
        return res.status(200).json({
          message: "Generated fallback project",
          projects: [{
            id: "fallback-" + Date.now(),
            title: "Product Management Fundamentals Practice",
            description: "Learn core PM skills through hands-on exercises with user stories, roadmaps, and stakeholder alignment.",
            targetSkill: "Product Management",
            difficulty: "intermediate",
            estimatedHours: 10,
            tags: ["product management"],
            isActive: true
          }]
        });
      }
      res.json({
        message: `Generated ${newProjects.length} AI-powered project`,
        projects: newProjects
      });
    } catch (error) {
      console.error("Error generating AI project:", error);
      res.status(500).json({ error: "Failed to generate AI project" });
    }
  });
  app2.get("/api/micro-projects/:id", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getMicroProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Micro-project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching micro-project:", error);
      res.status(500).json({ error: "Failed to fetch micro-project" });
    }
  });
  app2.patch("/api/micro-projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertMicroProjectSchema.partial().parse(req.body);
      const project = await storage.getMicroProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Micro-project not found" });
      }
      const updatedProject = await storage.updateMicroProject(id, updates);
      res.json(updatedProject);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error updating micro-project:", error);
      res.status(500).json({ error: "Failed to update micro-project" });
    }
  });
  app2.delete("/api/micro-projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getMicroProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Micro-project not found" });
      }
      await storage.deleteMicroProject(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting micro-project:", error);
      res.status(500).json({ error: "Failed to delete micro-project" });
    }
  });
  app2.post("/api/micro-projects/:projectId/start", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      await microProjectsService2.startProject(req.user.id, projectId);
      res.json({ message: "Project started successfully" });
    } catch (error) {
      console.error("Error starting project:", error);
      res.status(500).json({ error: "Failed to start project" });
    }
  });
  app2.put("/api/micro-projects/:projectId/progress", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { progressPercentage, timeSpent } = req.body;
      if (progressPercentage < 0 || progressPercentage > 100) {
        return res.status(400).json({ error: "Progress percentage must be between 0 and 100" });
      }
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      await microProjectsService2.updateProjectProgress(
        req.user.id,
        projectId,
        progressPercentage,
        timeSpent
      );
      res.json({ message: "Progress updated successfully" });
    } catch (error) {
      console.error("Error updating project progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });
  app2.post("/api/micro-projects/:projectId/complete", authenticate, requirePaidFeatures, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { artifactUrls, reflectionNotes, selfAssessment } = req.body;
      if (!artifactUrls || artifactUrls.length === 0) {
        return res.status(400).json({ error: "At least one artifact URL is required" });
      }
      const project = await storage.getMicroProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const { microProjectsService: microProjectsService2 } = await Promise.resolve().then(() => (init_micro_projects(), micro_projects_exports));
      await microProjectsService2.completeProject(
        req.user.id,
        projectId,
        artifactUrls,
        reflectionNotes,
        selfAssessment
      );
      res.status(201).json({ message: "Project completed successfully" });
    } catch (error) {
      console.error("Error completing project:", error);
      res.status(500).json({ error: "Failed to complete project" });
    }
  });
  app2.get("/api/project-completions", authenticate, async (req, res) => {
    try {
      const completions = await storage.getProjectCompletionsByUser(req.user.id);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching project completions:", error);
      res.status(500).json({ error: "Failed to fetch project completions" });
    }
  });
  app2.patch("/api/project-completions/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const existingCompletion = await storage.getProjectCompletionsByUser(req.user.id);
      const completion = existingCompletion.find((c) => c.id === id);
      if (!completion) {
        return res.status(404).json({ error: "Project completion not found or access denied" });
      }
      await storage.updateProjectCompletion(id, updates);
      res.json({ message: "Project completion updated successfully" });
    } catch (error) {
      console.error("Error updating project completion:", error);
      res.status(500).json({ error: "Failed to update project completion" });
    }
  });
  app2.post("/api/portfolio-artifacts", authenticate, async (req, res) => {
    try {
      const validatedData = insertPortfolioArtifactSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const artifactId = await storage.createPortfolioArtifact(validatedData);
      res.status(201).json({ id: artifactId, message: "Portfolio artifact created successfully" });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error creating portfolio artifact:", error);
      res.status(500).json({ error: "Failed to create portfolio artifact" });
    }
  });
  app2.get("/api/portfolio-artifacts", authenticate, async (req, res) => {
    try {
      const artifacts = await storage.getPortfolioArtifactsByUser(req.user.id);
      res.json(artifacts);
    } catch (error) {
      console.error("Error fetching portfolio artifacts:", error);
      res.status(500).json({ error: "Failed to fetch portfolio artifacts" });
    }
  });
  let stripe = null;
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover"
    });
  }
  app2.post("/api/stripe/create-checkout-session", authenticate, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." });
    }
    if (!process.env.STRIPE_PRICE_ID) {
      return res.status(500).json({ error: "Stripe Price ID is not configured. Please add STRIPE_PRICE_ID to your environment variables." });
    }
    try {
      const user = req.user;
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id
          }
        });
        customerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }
      const referer = req.get("referer") || "http://localhost:5000";
      const url = new URL(referer);
      const baseUrl = `${url.protocol}//${url.host}`;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1
          }
        ],
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
        metadata: {
          userId: user.id
        }
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout session error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });
  app2.post("/api/stripe/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }
    let event;
    try {
      event = req.body;
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription;
          if (userId && subscriptionId) {
            await storage.updateUser(userId, {
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: "active"
            });
            console.log(`\u2705 Subscription activated for user ${userId}`);
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          console.log(`Subscription event ${event.type} for customer ${customerId}`);
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      res.json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err.message);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  });
  app2.post("/api/stripe/verify-and-login", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }
      const userId = session.metadata?.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID not found in session" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.subscriptionStatus !== "active") {
        await storage.updateUser(userId, {
          stripeSubscriptionId: session.subscription,
          subscriptionStatus: "active"
        });
      }
      const token = generateToken();
      await storage.createSession(userId, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3));
      console.log(`\u2705 User ${userId} logged in after payment completion`);
      res.json({
        user: { ...user, password: void 0, subscriptionStatus: "active" },
        token
      });
    } catch (err) {
      console.error("Verify and login error:", err.message);
      res.status(500).json({ error: err.message || "Failed to verify payment" });
    }
  });
  app2.post("/api/stripe/verify-session", authenticate, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    try {
      const { sessionId } = req.body;
      const userId = req.user.id;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }
      if (session.metadata?.userId !== userId) {
        return res.status(403).json({ error: "Session does not belong to this user" });
      }
      await storage.updateUser(userId, {
        stripeSubscriptionId: session.subscription,
        subscriptionTier: "paid",
        subscriptionStatus: "active"
      });
      console.log(`\u2705 Subscription activated for existing user ${userId}`);
      res.json({ success: true, message: "Subscription activated successfully" });
    } catch (err) {
      console.error("Verify session error:", err.message);
      res.status(500).json({ error: err.message || "Failed to verify payment" });
    }
  });
  app2.post("/api/stripe/cancel-subscription", authenticate, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      await storage.updateUser(userId, {
        subscriptionTier: "free",
        subscriptionStatus: "canceled"
      });
      console.log(`\u2705 Subscription canceled for user ${userId}`);
      res.json({ success: true, message: "Subscription canceled successfully" });
    } catch (err) {
      console.error("Cancel subscription error:", err.message);
      res.status(500).json({ error: err.message || "Failed to cancel subscription" });
    }
  });
  app2.post("/api/stripe/billing-portal", authenticate, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? process.env.REPLIT_DEV_DOMAIN.startsWith("http") ? process.env.REPLIT_DEV_DOMAIN : `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000";
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${baseUrl}/dashboard`
      });
      console.log(`\u2705 Billing portal created for user ${userId}`);
      res.json({ url: session.url });
    } catch (err) {
      console.error("Billing portal error:", err.message);
      res.status(500).json({ error: err.message || "Failed to create billing portal" });
    }
  });
  app2.delete("/api/users/delete-account", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (stripe && user.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          console.log(`\u2705 Stripe subscription canceled for user ${userId}`);
        } catch (err) {
          console.error("Error canceling Stripe subscription:", err.message);
        }
      }
      await storage.deleteUser(userId);
      console.log(`\u2705 User account deleted: ${userId}`);
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
      console.error("Delete account error:", err.message);
      res.status(500).json({ error: err.message || "Failed to delete account" });
    }
  });
  app2.get("/api/tours/status", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const completedTours = await storage.getUserCompletedTours(userId);
      res.json({
        completedTours: completedTours.map((t) => t.tourId)
      });
    } catch (err) {
      console.error("Get tour status error:", err.message);
      res.status(500).json({ error: err.message || "Failed to fetch tour status" });
    }
  });
  app2.post("/api/tours/complete", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const { tourId } = req.body;
      if (!tourId || typeof tourId !== "string") {
        return res.status(400).json({ error: "Tour ID is required" });
      }
      const existingCompletion = await storage.getTourCompletion(userId, tourId);
      if (existingCompletion) {
        return res.json({
          message: "Tour already completed",
          completion: existingCompletion
        });
      }
      const completion = await storage.completeTour(userId, tourId);
      res.json({
        message: "Tour marked as completed",
        completion
      });
    } catch (err) {
      console.error("Complete tour error:", err.message);
      res.status(500).json({ error: err.message || "Failed to mark tour as completed" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactFormSchema = z3.object({
        name: z3.string().min(2),
        email: z3.string().email(),
        subject: z3.string().min(5),
        message: z3.string().min(10)
      });
      const validationResult = contactFormSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ error: validationError.message });
      }
      const { name, email, subject, message } = validationResult.data;
      const success = await emailService.sendContactForm({
        name,
        email,
        subject,
        message
      });
      if (!success) {
        return res.status(500).json({ error: "Failed to send email. Please try again later." });
      }
      res.json({ message: "Contact form submitted successfully" });
    } catch (err) {
      console.error("Contact form error:", err.message);
      res.status(500).json({ error: err.message || "Failed to send contact form" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
async function seedDatabase() {
  console.log("\u{1F331} Database seeding disabled");
  return false;
}
async function isDatabaseEmpty() {
  return false;
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    if (await isDatabaseEmpty()) {
      log("Database appears empty, seeding with demo data...");
      await seedDatabase();
      log("Database seeding completed successfully");
    } else {
      log("Database already contains data, skipping seeding");
    }
  } catch (error) {
    log("Warning: Database seeding failed:", String(error));
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
