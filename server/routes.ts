import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { authenticate, requireAdmin, requirePaidFeatures, hashPassword, verifyPassword, createSession, logout, generateToken, type AuthRequest } from "./auth";
import { aiService } from "./ai";
import { jobsService } from "./jobs";
import { beyondJobsService } from "./beyond-jobs";
import { ObjectStorageService } from "./objectStorage";
import { emailService } from "./email";
import { 
  loginSchema, 
  registerSchema, 
  insertInstitutionSchema, 
  insertLicenseSchema, 
  inviteUserSchema, 
  verifyEmailSchema,
  insertSkillGapAnalysisSchema,
  insertMicroProjectSchema,
  insertProjectCompletionSchema,
  insertPortfolioArtifactSchema
} from "@shared/schema";
import crypto from "crypto";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import PDFParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate request body
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ error: validationError.message });
      }
      
      const { email, password, firstName, lastName, school, major, gradYear, invitationToken, selectedPlan } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
if (existingUser && existingUser.isActive) {
  return res.status(400).json({ error: "User already exists" });
}
// If user exists but is deactivated, reactivate them
if (existingUser && !existingUser.isActive) {
  const reactivatedUser = await storage.activateUser(existingUser.id);
  
  // Generate new session token
  const token = generateToken();
  await storage.createSession(reactivatedUser.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  
  return res.status(200).json({
    message: "User reactivated successfully",
    user: reactivatedUser,
    token
  });
}

      // If invitation token provided, validate it
      let invitation = null;
      let institutionId = null;
      let userRole = "student";
      let subscriptionTier: "free" | "paid" | "institutional" = "free";
      
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
        subscriptionTier = "institutional"; // Institutional users get full access
        
        // Check seat availability for students
        if (userRole === "student") {
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (!seatInfo.available) {
            return res.status(400).json({ 
              error: "No available seats. Please contact your administrator." 
            });
          }
        }
      } else {
        // No invitation - check if domain matches an institution
        const domain = email.split('@')[1];
        const institution = await storage.getInstitutionByDomain(domain);
        
        if (institution) {
          // Domain-based institutional registration
          institutionId = institution.id;
          subscriptionTier = "institutional";
          
          // Check seat availability for domain-based registration
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (!seatInfo.available) {
            return res.status(400).json({ 
              error: "No available seats. Please contact your administrator." 
            });
          }
        } else {
          // Direct signup - no institution affiliation
          institutionId = null;
          userRole = "student";
          
          // Use selected plan if provided, otherwise default to free
          subscriptionTier = selectedPlan === "paid" ? "paid" : "free";
        }
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        institutionId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: userRole as any,
        school,
        major,
        gradYear,
        subscriptionTier,
        subscriptionStatus: subscriptionTier === 'paid' ? 'incomplete' : 'active',
        isActive: true, // Auto-activate for invited users since email verification is temporarily disabled
        isVerified: true // Auto-verify for invited users
      });

      // Claim invitation if provided
      if (invitation) {
        await storage.claimInvitation(invitationToken!, user.id);
      }
      
      // Update license seat usage for active students
      if (userRole === "student" && institutionId) {
        const license = await storage.getInstitutionLicense(institutionId);
        if (license && license.licenseType === "per_student") {
          await storage.updateLicenseUsage(license.id, license.usedSeats + 1);
          
          // Check if we need to send usage notification
          const seatInfo = await storage.checkSeatAvailability(institutionId);
          if (license.licensedSeats && seatInfo.usedSeats >= license.licensedSeats * 0.8) {
            const institution = await storage.getInstitution(institutionId);
            const adminUsers = await storage.getInstitutionUsers(institutionId);
            const admins = adminUsers.filter(u => u.role === "admin");
            
            // Send notification to admins
            for (const admin of admins) {
              await emailService.sendLicenseUsageNotification({
                adminEmail: admin.email,
                institutionName: institution?.name || "Unknown Institution",
                usedSeats: seatInfo.usedSeats,
                totalSeats: seatInfo.totalSeats || 0,
                usagePercentage: Math.round((seatInfo.usedSeats / (seatInfo.totalSeats || 1)) * 100)
              });
            }
          }
        }
      }
      
      console.log(`✅ User registered successfully: ${user.id} (${userRole}) for institution ${institutionId}`)
      
      // Create activity
      await storage.createActivity(
        user.id,
        "account_created",
        "Welcome to Pathwise!",
        "Your account is ready to use."
      );

      // For paid users, create Stripe checkout session instead of auto-login
      if (subscriptionTier === 'paid') {
        if (!stripe) {
          return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." });
        }

        if (!process.env.STRIPE_PRICE_ID) {
          return res.status(500).json({ error: "Stripe Price ID is not configured. Please add STRIPE_PRICE_ID to your environment variables." });
        }

        // Create Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customer.id });

        // Create checkout session
        const referer = req.get("referer") || "http://localhost:5000";
        const url = new URL(referer);
        const baseUrl = `${url.protocol}//${url.host}`;
        
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: 'subscription',
          payment_method_types: ['card'],
          payment_method_collection: 'always', // Require payment method upfront
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],
          subscription_data: {
            trial_period_days: 14,
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel', // Cancel subscription if no payment method
              },
            },
          },
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/register`,
          metadata: {
            userId: user.id,
          },
          allow_promotion_codes: true, // Enable promo code field in Stripe checkout
        });

        return res.status(201).json({
          message: "Registration successful! Redirecting to payment...",
          user: { ...user, password: undefined },
          requiresPayment: true,
          checkoutUrl: session.url,
          requiresVerification: false
        });
      }

      // For free/institutional users, auto-login as before
      const token = generateToken();
      await storage.createSession(user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      res.status(201).json({
        message: "Registration successful! You can now log in.",
        user: { ...user, password: undefined },
        token, // Include token for auto-login
        requiresVerification: false
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
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

      // Temporarily disabled for development - email verification not implemented yet
      // if (!user.isVerified) {
      //   return res.status(401).json({ error: "Please verify your email first" });
      // }

      const token = await createSession(user.id);
      
      // Create login activity
      await storage.createActivity(
        user.id,
        "user_login",
        "Logged In",
        `Welcome back, ${user.firstName}!`
      );
      
      // Set HTTP-only cookie for authentication
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", authenticate, async (req: AuthRequest, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.auth_token;
      if (token) {
        await logout(token);
      }
      
      // Clear the auth cookie
      res.clearCookie('auth_token');
      
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
    res.json(req.user); // ← Return user directly, no nesting
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ 
          message: "If an account with that email exists, you will receive a password reset link shortly." 
        });
      }
      
      // Generate reset token
      const resetToken = generateToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Store reset token
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
        isUsed: false,
      });
      
      // Send reset email
      await emailService.sendPasswordReset({
        email: user.email,
        token: resetToken,
        userName: user.firstName,
      });
      
      res.json({ 
        message: "If an account with that email exists, you will receive a password reset link shortly." 
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  app.get("/api/auth/reset-password/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      
      // Validate token
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

  app.post("/api/auth/reset-password", async (req, res) => {
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
      
      // Validate token
      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update user password
      await storage.updateUser(resetToken.userId, {
        password: hashedPassword,
      });
      
      // Mark token as used
      await storage.markPasswordResetTokenAsUsed(token);
      
      res.json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Promo code validation
  app.post("/api/promo-codes/validate", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Promo code is required" });
      }

      const promoCode = await storage.getPromoCodeByCode(code.trim().toUpperCase());
      
      if (!promoCode) {
        return res.status(404).json({ error: "Invalid or expired promo code" });
      }

      // Check if max uses exceeded
      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return res.status(400).json({ error: "Promo code has reached maximum uses" });
      }

      return res.json({
        valid: true,
        type: promoCode.type,
        code: promoCode.code,
      });
    } catch (error) {
      console.error("Promo code validation error:", error);
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });

  // Update user settings
  app.patch("/api/users/settings", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const updateData = req.body;

      // Validate input with Zod
      const settingsSchema = z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        school: z.string().optional(),
        major: z.string().optional(),
        gradYear: z.number().int().min(2000).max(2040).optional(),
        targetRole: z.string().optional(),
        location: z.string().optional(),
        remoteOk: z.boolean().optional(),
      });

      const validated = settingsSchema.parse(updateData);

      // Update user in database
      const updatedUser = await storage.updateUser(userId, validated);

      res.json(updatedUser);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Environment variables diagnostic endpoint
  app.get("/api/admin/env-check", async (req, res) => {
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

  // INSTITUTIONAL LICENSING ROUTES
  
  // Create institution (super admin only)
  app.post("/api/institutions", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only super admins can create institutions" });
      }
      
      const institutionData = insertInstitutionSchema.parse(req.body);
      const institution = await storage.createInstitution(institutionData);
      res.json(institution);
    } catch (error: any) {
      console.error("Error creating institution:", error);
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get institution details
  app.get("/api/institutions/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const institution = await storage.getInstitution(req.params.id);
      if (!institution) {
        return res.status(404).json({ error: "Institution not found" });
      }
      
      // Only allow access to users from the same institution or super admins
      if (req.user!.role !== "super_admin" && req.user!.institutionId !== institution.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(institution);
    } catch (error: any) {
      console.error("Error fetching institution:", error);
      res.status(500).json({ error: "Failed to fetch institution" });
    }
  });
  
  // Create license for institution
  app.post("/api/institutions/:id/license", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only super admins can create licenses" });
      }
      
      const licenseData = insertLicenseSchema.parse({
        ...req.body,
        institutionId: req.params.id
      });
      
      const license = await storage.createLicense(licenseData);
      res.json(license);
    } catch (error: any) {
      console.error("Error creating license:", error);
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get license information
  app.get("/api/institutions/:id/license", authenticate, async (req: AuthRequest, res) => {
    try {
      const license = await storage.getInstitutionLicense(req.params.id);
      if (!license) {
        return res.status(404).json({ error: "No active license found" });
      }
      
      // Only allow access to users from the same institution or super admins
      if (req.user!.role !== "super_admin" && req.user!.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      
      res.json({
        ...license,
        seatInfo
      });
    } catch (error: any) {
      console.error("Error fetching license:", error);
      res.status(500).json({ error: "Failed to fetch license" });
    }
  });
  
  // Invite user to institution
  app.post("/api/institutions/:id/invite", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "admin" && req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can send invitations" });
      }
      
      if (req.user!.role === "admin" && req.user!.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const { email, role = "student" } = inviteUserSchema.parse({
        ...req.body,
        institutionId: req.params.id
      });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      // Check seat availability for per-student licenses
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      if (!seatInfo.available && role === "student") {
        return res.status(400).json({ 
          error: "No available seats. Please upgrade your license or deactivate inactive users." 
        });
      }
      
      // Create invitation token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      const invitation = await storage.createInvitation({
        institutionId: req.params.id,
        email,
        role: role as any,
        invitedBy: req.user!.id,
        token,
        expiresAt
      });
      
      // Get institution details for email
      const institution = await storage.getInstitution(req.params.id);
      
      // Send invitation email
      const emailSent = await emailService.sendInvitation({
        email,
        token,
        institutionName: institution?.name || "Unknown Institution",
        inviterName: `${req.user!.firstName} ${req.user!.lastName}`,
        role
      });
      
      if (!emailSent) {
        console.warn("Failed to send invitation email - this is likely due to Resend requiring domain verification for production use");
        // For now, we'll still return success since the invitation was created in the database
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
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get institution users and seat usage
  app.get("/api/institutions/:id/users", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "admin" && req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can view user lists" });
      }
      
      if (req.user!.role === "admin" && req.user!.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const users = await storage.getInstitutionUsers(req.params.id);
      const invitations = await storage.getInstitutionInvitations(req.params.id);
      const license = await storage.getInstitutionLicense(req.params.id);
      const seatInfo = await storage.checkSeatAvailability(req.params.id);
      
      res.json({
        users: users.map(user => ({
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
        invitations: invitations.map(inv => ({
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
    } catch (error: any) {
      console.error("Error fetching institution users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  
  // Terminate user (admin only)
  app.delete("/api/institutions/:id/users/:userId", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "admin" && req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can terminate users" });
      }
      
      if (req.user!.role === "admin" && req.user!.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Cannot terminate yourself
      if (req.user!.id === req.params.userId) {
        return res.status(400).json({ error: "Cannot terminate your own account" });
      }
      
      // Get user to verify they belong to the institution
      const userToTerminate = await storage.getUser(req.params.userId);
      if (!userToTerminate || userToTerminate.institutionId !== req.params.id) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Deactivate user and revoke sessions
      await storage.deactivateUser(req.params.userId);
      await storage.deleteUserSessions(req.params.userId);
      
      // Update license seat count
      if (userToTerminate.institutionId) {
        const license = await storage.getInstitutionLicense(userToTerminate.institutionId);
        if (license && license.licenseType === "per_student" && userToTerminate.role === "student") {
          await storage.updateLicenseUsage(license.id, Math.max(0, license.usedSeats - 1));
        }
      }
      
      res.json({ message: "User terminated successfully" });
    } catch (error: any) {
      console.error("Error terminating user:", error);
      res.status(500).json({ error: "Failed to terminate user" });
    }
  });
  
  // Cancel invitation (admin only)
  app.delete("/api/institutions/:id/invitations/:invitationId", authenticate, async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "admin" && req.user!.role !== "super_admin") {
        return res.status(403).json({ error: "Only admins can cancel invitations" });
      }
      
      if (req.user!.role === "admin" && req.user!.institutionId !== req.params.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Get invitation to verify it belongs to the institution
      const invitation = await storage.getInvitation(req.params.invitationId);
      if (!invitation || invitation.institutionId !== req.params.id) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      
      // Can only cancel pending invitations
      if (invitation.status !== "pending") {
        return res.status(400).json({ error: "Can only cancel pending invitations" });
      }
      
      await storage.cancelInvitation(req.params.invitationId);
      
      res.json({ message: "Invitation cancelled successfully" });
    } catch (error: any) {
      console.error("Error cancelling invitation:", error);
      res.status(500).json({ error: "Failed to cancel invitation" });
    }
  });
  
  // Email verification endpoint
  app.post("/api/verify-email", async (req, res) => {
    try {
      const { token } = verifyEmailSchema.parse(req.body);
      
      const verification = await storage.getEmailVerification(token);
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }
      
      // Mark user as verified and activate
      const user = await storage.getUserByEmail(verification.email);
      if (user) {
        await storage.updateUser(user.id, { isVerified: true });
        await storage.activateUser(user.id);
        await storage.markEmailVerificationUsed(token);
        
        // Update license seat usage
        if (user.institutionId) {
          const license = await storage.getInstitutionLicense(user.institutionId);
          if (license && license.licenseType === "per_student") {
            await storage.updateLicenseUsage(license.id, license.usedSeats + 1);
            
            // Check if we need to send usage notification
            const seatInfo = await storage.checkSeatAvailability(user.institutionId);
            if (license.licensedSeats && seatInfo.usedSeats >= license.licensedSeats * 0.8) {
              const institution = await storage.getInstitution(user.institutionId);
              const adminUsers = await storage.getInstitutionUsers(user.institutionId);
              const admins = adminUsers.filter(u => u.role === "admin");
              
              // Send notification to admins
              for (const admin of admins) {
                await emailService.sendLicenseUsageNotification({
                  adminEmail: admin.email,
                  institutionName: institution?.name || "Unknown Institution",
                  usedSeats: seatInfo.usedSeats,
                  totalSeats: seatInfo.totalSeats || 0,
                  usagePercentage: Math.round((seatInfo.usedSeats / (seatInfo.totalSeats || 1)) * 100)
                });
              }
            }
          }
        }
        
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Resume routes
  app.post("/api/resumes/upload", authenticate, async (req: AuthRequest, res) => {
    try {
      const objectStorage = new ObjectStorageService();
      const uploadURL = await objectStorage.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Resume upload URL error:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.post("/api/resumes", authenticate, async (req: AuthRequest, res) => {
    try {
      const { fileName, filePath, extractedText, targetRole, targetIndustry, targetCompanies } = req.body;
      
      if (!extractedText) {
        return res.status(400).json({ error: "extractedText is required" });
      }
      
      if (!targetRole) {
        return res.status(400).json({ error: "targetRole is required" });
      }

      // Create resume record with the provided text
      const resume = await storage.createResume({
        userId: req.user!.id,
        fileName: fileName || "resume.txt",
        filePath: filePath || "/text-input",
        extractedText,
      });

      // Create activity for resume upload
      await storage.createActivity(
        req.user!.id,
        "resume_uploaded",
        "Resume Uploaded",
        `Uploaded new resume: ${fileName || "resume.txt"}`
      );

      // Trigger AI analysis with target role
      if (extractedText) {
        try {
          const analysis = await aiService.analyzeResume(
            req.user!.id,
            extractedText,
            targetRole,
            targetIndustry,
            targetCompanies
          );
          
          console.log("AI Analysis Response:", JSON.stringify(analysis, null, 2));
          
          // Calculate rmsScore if not provided by AI or if it's 0
          let finalRmsScore = analysis.rmsScore;
          if (!finalRmsScore || finalRmsScore === 0) {
            // Calculate as weighted average of section scores
            const scores = [
              analysis.skillsScore || 0,
              analysis.experienceScore || 0,
              analysis.keywordsScore || 0,
              analysis.educationScore || 0,
              analysis.certificationsScore || 0
            ];
            finalRmsScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
            console.log(`Calculated rmsScore from section scores: ${finalRmsScore}`);
          }
          
          await storage.updateResumeAnalysis(resume.id, {
            rmsScore: finalRmsScore,
            skillsScore: analysis.skillsScore,
            experienceScore: analysis.experienceScore,
            keywordsScore: analysis.keywordsScore,
            educationScore: analysis.educationScore,
            certificationsScore: analysis.certificationsScore,
            gaps: analysis.gaps,
            overallInsights: analysis.overallInsights,
            sectionAnalysis: analysis.sectionAnalysis,
            targetRole: targetRole,
            targetIndustry: targetIndustry,
            targetCompanies: targetCompanies,
            analysisHash: analysis.analysisHash
          });

          // Save to analysis history for tracking over time
          await storage.createResumeAnalysisHistory({
            userId: req.user!.id,
            resumeId: resume.id,
            fileName: resume.fileName,
            rmsScore: finalRmsScore,
            skillsScore: analysis.skillsScore,
            experienceScore: analysis.experienceScore,
            keywordsScore: analysis.keywordsScore,
            educationScore: analysis.educationScore,
            certificationsScore: analysis.certificationsScore,
            gaps: analysis.gaps,
            overallInsights: analysis.overallInsights,
            sectionAnalysis: analysis.sectionAnalysis,
            targetRole: targetRole || null,
            targetIndustry: targetIndustry || null,
            targetCompanies: targetCompanies ? [targetCompanies] : null,
            analysisHash: analysis.analysisHash
          });

          // Create activity
          await storage.createActivity(
            req.user!.id,
            "resume_analyzed",
            "Resume Analysis Complete",
            `Your resume scored ${finalRmsScore}/100`
          );
        } catch (aiError) {
          console.error("AI analysis error:", aiError);
          // Continue without analysis for now
        }
      }

      res.status(201).json(resume);
    } catch (error) {
      console.error("Resume creation error:", error);
      res.status(500).json({ error: "Failed to create resume" });
    }
  });

  app.get("/api/resumes", authenticate, async (req: AuthRequest, res) => {
    try {
      const resumes = await storage.getUserResumes(req.user!.id);
      res.json(resumes);
    } catch (error) {
      console.error("Get resumes error:", error);
      res.status(500).json({ error: "Failed to get resumes" });
    }
  });

  app.get("/api/resumes/active", authenticate, async (req: AuthRequest, res) => {
    try {
      const resume = await storage.getActiveResume(req.user!.id);
      res.json(resume || null);
    } catch (error) {
      console.error("Get active resume error:", error);
      res.status(500).json({ error: "Failed to get active resume" });
    }
  });

  // Resume Analysis History
  app.get("/api/resume-analysis-history", authenticate, async (req: AuthRequest, res) => {
    try {
      const { targetRole, targetIndustry, startDate, endDate } = req.query;
      
      const filters: any = {};
      if (targetRole) filters.targetRole = targetRole as string;
      if (targetIndustry) filters.targetIndustry = targetIndustry as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const history = await storage.getUserResumeAnalysisHistory(req.user!.id, filters);
      res.json(history);
    } catch (error) {
      console.error("Get resume analysis history error:", error);
      res.status(500).json({ error: "Failed to get resume analysis history" });
    }
  });

  // Career roadmap routes
  app.post("/api/roadmaps/generate", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { phase } = req.body;
      
      if (!["30_days", "3_months", "6_months"].includes(phase)) {
        return res.status(400).json({ error: "Invalid phase" });
      }

      // Get user's resume analysis for context
      const activeResume = await storage.getActiveResume(req.user!.id);
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
        } as any;
      }

      const roadmapData = await aiService.generateCareerRoadmap(
        phase,
        req.user!,
        resumeAnalysis
      );

      const roadmap = await storage.createRoadmap({
        userId: req.user!.id,
        phase,
        title: roadmapData.title,
        description: roadmapData.description,
        actions: roadmapData.actions,
      });

      // Create activity
      await storage.createActivity(
        req.user!.id,
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

  app.get("/api/roadmaps", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const roadmaps = await storage.getUserRoadmaps(req.user!.id);
      res.json(roadmaps);
    } catch (error) {
      console.error("Get roadmaps error:", error);
      res.status(500).json({ error: "Failed to get roadmaps" });
    }
  });

  app.put("/api/roadmaps/:id/progress", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
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

  // Track task completion for roadmap subsections
  app.post("/api/roadmaps/:id/tasks/:taskId/complete", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { id: roadmapId, taskId } = req.params;
      const userId = req.user!.id;
      
      // Update task completion status in roadmap subsections
      const roadmap = await storage.updateTaskCompletion(roadmapId, taskId, userId, true);
      res.json(roadmap);
    } catch (error) {
      console.error("Task completion error:", error);
      res.status(500).json({ error: "Failed to mark task as complete" });
    }
  });

  app.delete("/api/roadmaps/:id/tasks/:taskId/complete", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { id: roadmapId, taskId } = req.params;
      const userId = req.user!.id;
      
      // Update task completion status in roadmap subsections
      const roadmap = await storage.updateTaskCompletion(roadmapId, taskId, userId, false);
      res.json(roadmap);
    } catch (error) {
      console.error("Task uncomplete error:", error);
      res.status(500).json({ error: "Failed to mark task as incomplete" });
    }
  });

  // Get task completion status for a user
  app.get("/api/roadmaps/:id/completion-status", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { id: roadmapId } = req.params;
      const userId = req.user!.id;
      
      const completionStatus = await storage.getTaskCompletionStatus(roadmapId, userId);
      res.json(completionStatus);
    } catch (error) {
      console.error("Get completion status error:", error);
      res.status(500).json({ error: "Failed to get completion status" });
    }
  });

  // Legacy action completion for old roadmap format
  app.put("/api/roadmaps/:id/actions/:actionId/complete", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { id: roadmapId, actionId } = req.params;
      const userId = req.user!.id;
      
      // Update legacy action completion status
      const roadmap = await storage.updateActionCompletion(roadmapId, actionId, userId, true);
      res.json(roadmap);
    } catch (error) {
      console.error("Legacy action completion error:", error);
      res.status(500).json({ error: "Failed to mark action as complete" });
    }
  });

  // Job matching routes
  app.get("/api/jobs/search", async (req, res) => {
    try {
      const {
        query = "software engineer",
        location = "United States", 
        page = "1",
        limit = "20"
      } = req.query;

      console.log("Job search params:", { query, location, page, limit });

      // Get user's active resume and extract skills for compatibility scoring
      let userSkills: string[] = [];
      
      try {
        // Get the authenticated user's active resume if available
        if ((req as any).user?.id) {
          const activeResume = await storage.getActiveResume((req as any).user.id);
          if (activeResume?.extractedText) {
            // Extract skills from resume analysis if available - for now use demo skills
            // TODO: Integrate with actual resume analysis system
          }
        }
        
        // Fallback to demo skills if no user resume found
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
        query: query as string,
        location: location as string,
        page: parseInt(page as string),
        resultsPerPage: parseInt(limit as string),
      }, userSkills);

      console.log("Jobs found:", jobsData.jobs.length);
      if (jobsData.jobs.length > 0 && jobsData.jobs[0].compatibilityScore) {
        console.log("Sample compatibility scores:", jobsData.jobs.slice(0, 3).map(j => ({ title: j.title, score: j.compatibilityScore })));
      }

      // Create activity for job search if user is authenticated
      if ((req as any).user?.id) {
        await storage.createActivity(
          (req as any).user.id,
          "job_search_performed",
          "Job Search",
          `Searched for "${query}" in ${location} - found ${jobsData.jobs.length} results`
        );
      }

      res.json({
        jobs: jobsData.jobs,
        totalCount: jobsData.totalCount,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
    } catch (error) {
      console.error("Job search error:", error);
      res.status(500).json({ error: "Failed to search jobs" });
    }
  });

  // New endpoint: Get detailed AI match analysis for a specific job
  app.post("/api/jobs/match-analysis", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      console.log("Match analysis request received from user:", req.user?.id);
      const { jobId, jobData } = req.body;
      
      if (!jobData) {
        console.log("Missing job data in request");
        return res.status(400).json({ error: "Job data is required" });
      }
      
      console.log("Job data received:", { title: jobData.title, company: jobData.company?.display_name });
      
      // Get user's active resume
      const activeResume = await storage.getActiveResume(req.user!.id);
      console.log("Active resume found:", !!activeResume?.extractedText);
      
      if (!activeResume?.extractedText) {
        return res.status(400).json({ error: "No active resume found. Please upload a resume first." });
      }
      
      console.log("Calling AI service for match analysis...");
      // Get AI analysis of resume vs job match
      const matchAnalysis = await aiService.analyzeJobMatch(activeResume.extractedText, jobData);
      
      console.log("AI analysis completed successfully");
      res.json(matchAnalysis);
    } catch (error: any) {
      console.error("Job match analysis error:", error);
      res.status(500).json({ error: "Failed to analyze job match" });
    }
  });

  app.get("/api/jobs/matches", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const jobMatches = await storage.getUserJobMatches(req.user!.id, limit);
      res.json(jobMatches);
    } catch (error) {
      console.error("Get job matches error:", error);
      res.status(500).json({ error: "Failed to get job matches" });
    }
  });

  // Beyond Jobs routes - experiential opportunities
  app.get("/api/beyond-jobs/search", authenticate, async (req: AuthRequest, res) => {
    try {
      const {
        type,
        location,
        keyword,
        remote,
        limit
      } = req.query;

      const opportunities = await beyondJobsService.searchOpportunities({
        type: type as string,
        location: location as string,
        keyword: keyword as string,
        remote: remote === 'true',
        limit: limit ? parseInt(limit as string) : 5
      });

      res.json({ opportunities, totalCount: opportunities.length });
    } catch (error: any) {
      console.error("Beyond Jobs search error:", error);
      res.status(500).json({ error: "Failed to search opportunities" });
    }
  });

  app.post("/api/beyond-jobs/ai-rank", authenticate, async (req: AuthRequest, res) => {
    try {
      const { opportunities } = req.body;
      
      // Get user's resume for personalized ranking
      const activeResume = await storage.getActiveResume(req.user!.id);
      if (!activeResume) {
        return res.status(400).json({ error: "No active resume found" });
      }

      const userSkills = activeResume.extractedText ? 
        aiService.extractSkills(activeResume.extractedText) : [];
      const resumeGaps = activeResume.gaps || [];

      const rankedOpportunities = await beyondJobsService.getAIRanking(
        opportunities,
        userSkills,
        resumeGaps,
        aiService
      );

      res.json({ opportunities: rankedOpportunities });
    } catch (error: any) {
      console.error("AI ranking error:", error);
      res.status(500).json({ error: "Failed to rank opportunities" });
    }
  });

  app.post("/api/beyond-jobs/save", authenticate, async (req: AuthRequest, res) => {
    try {
      const { opportunityData } = req.body;
      
      const savedOpportunity = await storage.saveOpportunity(req.user!.id, opportunityData);
      
      res.json(savedOpportunity);
    } catch (error: any) {
      console.error("Save opportunity error:", error);
      res.status(500).json({ error: "Failed to save opportunity" });
    }
  });

  app.get("/api/beyond-jobs/saved", authenticate, async (req: AuthRequest, res) => {
    try {
      const saved = await storage.getSavedOpportunities(req.user!.id);
      res.json(saved);
    } catch (error: any) {
      console.error("Get saved opportunities error:", error);
      res.status(500).json({ error: "Failed to get saved opportunities" });
    }
  });

  // Updated resume tailoring endpoint - works with real-time job data
  // AI Copilot - Get tailored resumes for user
  app.get("/api/copilot/tailored-resumes", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      console.log('Fetching tailored resumes for user:', userId);
      
      const tailoredResumes = await storage.getTailoredResumes(userId);
      console.log('Retrieved tailored resumes count:', tailoredResumes.length);
      console.log('First resume:', tailoredResumes[0] ? { id: tailoredResumes[0].id, jobTitle: tailoredResumes[0].jobTitle, company: tailoredResumes[0].company } : 'none');
      
      res.json(tailoredResumes);
    } catch (error) {
      console.error("Error fetching tailored resumes:", error);
      res.status(500).json({ error: "Failed to fetch tailored resumes" });
    }
  });

  // AI Copilot - Generate cover letter
  app.post("/api/copilot/cover-letter", authenticate, async (req: AuthRequest, res) => {
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

  // AI Copilot - Salary negotiation strategy
  app.post("/api/copilot/salary-negotiation", authenticate, async (req: AuthRequest, res) => {
    try {
      const { currentSalary, targetSalary, jobRole, location, yearsExperience } = req.body;
      
      if (!targetSalary || !jobRole) {
        return res.status(400).json({ error: "targetSalary and jobRole are required" });
      }

      // Get user's resume for personalized advice
      const resume = await storage.getActiveResume(req.user!.id);
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

  // AI Copilot - Auto resume updater from roadmap
  app.post("/api/copilot/update-resume-from-roadmap", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      
      // Get user's current resume and roadmap progress
      const resume = await storage.getActiveResume(userId);
      if (!resume?.extractedText) {
        return res.status(400).json({ error: "Resume required for auto-update" });
      }

      const roadmaps = await storage.getUserRoadmaps(userId);
      const completedTasks = roadmaps.filter(r => r.progress === 100);

      if (completedTasks.length === 0) {
        return res.status(400).json({ error: "No completed roadmap tasks to sync with resume" });
      }

      const updatedResume = await aiService.updateResumeFromRoadmap({
        resumeText: resume.extractedText,
        completedTasks: completedTasks.map(task => ({
          title: task.title,
          description: task.description || undefined,
          actions: task.actions
        }))
      });

      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume from roadmap:", error);
      res.status(500).json({ error: "Failed to update resume from roadmap" });
    }
  });

  app.post("/api/jobs/tailor-resume", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { jobData, baseResumeId } = req.body;
      
      if (!jobData) {
        return res.status(400).json({ error: "Job data is required" });
      }
      
      // Get base resume
      const resume = baseResumeId 
        ? (await storage.getUserResumes(req.user!.id)).find(r => r?.id === baseResumeId)
        : await storage.getActiveResume(req.user!.id);
        
      if (!resume?.extractedText) {
        return res.status(400).json({ error: "Resume text not available. Please upload a resume first." });
      }

      // Extract keywords from job description
      const targetKeywords = jobData.description
        ?.split(/\s+/)
        .filter((word: string) => word.length > 3)
        .slice(0, 20) || [];

      const tailoredResult = await aiService.tailorResume(
        resume.extractedText,
        jobData.description || "",
        targetKeywords,
        req.user!
      );

      // Generate DOCX file
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(tailoredResult.tailoredContent)],
            }),
          ],
        }],
      });

      const docxBuffer = await Packer.toBuffer(doc);
      
      // Create or find job match record for the tailored resume
      const jobMatchData = {
        userId: req.user!.id,
        externalJobId: jobData.id || `external-${Date.now()}`,
        title: jobData.title || 'Job Position',
        company: jobData.company?.display_name || jobData.company || 'Company',
        location: jobData.location || '',
        description: jobData.description || '',
        requirements: jobData.requirements || '',
        salary: jobData.salary?.display || '',
        compatibilityScore: tailoredResult.jobSpecificScore || 0,
        matchReasons: [],
        skillsGaps: [],
        source: 'job_matching'
      };
      
      console.log('Creating job match with data:', { ...jobMatchData, description: jobMatchData.description?.slice(0, 100) + '...' });
      const jobMatch = await storage.createJobMatch(jobMatchData);
      console.log('Job match created:', { id: jobMatch.id, title: jobMatch.title });
      
      // Save the tailored resume to database
      const tailoredResumeData = {
        userId: req.user!.id,
        baseResumeId: resume.id,
        jobMatchId: jobMatch.id,
        tailoredContent: tailoredResult.tailoredContent,
        diffJson: tailoredResult.diffJson,
        jobSpecificScore: tailoredResult.jobSpecificScore,
        keywordsCovered: tailoredResult.keywordsCovered,
        remainingGaps: tailoredResult.remainingGaps
      };
      
      console.log('Creating tailored resume with data:', { userId: tailoredResumeData.userId, baseResumeId: tailoredResumeData.baseResumeId, jobMatchId: tailoredResumeData.jobMatchId });
      const tailoredResumeRecord = await storage.createTailoredResume(tailoredResumeData);
      console.log('Tailored resume created:', { id: tailoredResumeRecord.id, userId: tailoredResumeRecord.userId });
      
      // Create activity
      await storage.createActivity(
        req.user!.id,
        "resume_tailored",
        "Resume Tailored",
        `Resume optimized for ${jobData.company?.display_name || 'Company'} - ${jobData.title}`
      );

      res.status(201).json({
        id: tailoredResumeRecord.id,
        jobMatchId: jobMatch.id,
        tailoredContent: tailoredResult.tailoredContent,
        jobSpecificScore: tailoredResult.jobSpecificScore,
        keywordsCovered: tailoredResult.keywordsCovered,
        remainingGaps: tailoredResult.remainingGaps,
        diffJson: tailoredResult.diffJson,
        docxBuffer: docxBuffer.toString('base64'),
        jobTitle: jobData.title,
        companyName: jobData.company?.display_name || 'Company'
      });
    } catch (error) {
      console.error("Resume tailoring error:", error);
      res.status(500).json({ error: "Failed to tailor resume" });
    }
  });

  // Applications routes
  app.post("/api/applications", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const applicationData = req.body;
      console.log('Raw application data:', applicationData);
      
      // Convert appliedDate string to Date object if provided
      const processedData = {
        ...applicationData,
        userId: req.user!.id,
        appliedDate: applicationData.appliedDate ? new Date(applicationData.appliedDate) : new Date(),
      };
      
      console.log('Processed application data:', { 
        ...processedData, 
        appliedDate: processedData.appliedDate?.toISOString?.() || processedData.appliedDate 
      });
      
      const application = await storage.createApplication(processedData);

      // Create activity
      await storage.createActivity(
        req.user!.id,
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

  app.get("/api/applications", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const applications = await storage.getUserApplications(req.user!.id);
      res.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  app.put("/api/applications/:id/status", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status, responseDate } = req.body;
      
      const application = await storage.updateApplicationStatus(
        id, 
        status, 
        responseDate ? new Date(responseDate) : undefined
      );
      
      res.json(application);
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // AI Co-pilot routes
  app.post("/api/ai/cover-letter", authenticate, async (req: AuthRequest, res) => {
    try {
      const { jobDescription, company, role } = req.body;
      
      const activeResume = await storage.getActiveResume(req.user!.id);
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

  app.post("/api/ai/linkedin-optimize", authenticate, async (req: AuthRequest, res) => {
    try {
      const { currentProfile } = req.body;
      
      const optimization = await aiService.optimizeLinkedInProfile(
        currentProfile,
        req.user!.targetRole || "Professional",
        req.user!.industries || []
      );

      res.json(optimization);
    } catch (error) {
      console.error("LinkedIn optimization error:", error);
      res.status(500).json({ error: "Failed to optimize LinkedIn profile" });
    }
  });

  // Activities and achievements
  app.get("/api/activities", authenticate, async (req: AuthRequest, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getUserActivities(req.user!.id, limit);
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  app.get("/api/achievements", authenticate, async (req: AuthRequest, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.user!.id);
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ error: "Failed to get achievements" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", authenticate, async (req: AuthRequest, res) => {
    try {
      const [
        activeResume,
        applications,
        roadmaps,
        achievements,
        activities,
        jobMatches
      ] = await Promise.all([
        storage.getActiveResume(req.user!.id),
        storage.getUserApplications(req.user!.id),
        storage.getUserRoadmaps(req.user!.id),
        storage.getUserAchievements(req.user!.id),
        storage.getUserActivities(req.user!.id, 5),
        storage.getUserJobMatches(req.user!.id, 10)
      ]);

      // Calculate dynamic stats
      const rmsScoreImprovement = activeResume?.rmsScore ? 
        Math.max(0, (activeResume.rmsScore - 45)) : 0; // Improvement from baseline
      
      const applicationStats = {
        total: applications.length,
        pending: applications.filter(app => app.status === "applied").length,
        interviewing: applications.filter(app => ["interview_scheduled", "interviewed"].includes(app.status)).length,
        rejected: applications.filter(app => app.status === "rejected").length,
        offers: applications.filter(app => app.status === "offered").length
      };

      // Calculate actual streak from activities
      const today = new Date();
      let currentStreak = 0;
      const recentDays = 30;
      
      for (let i = 0; i < recentDays; i++) {
        const dayToCheck = new Date(today);
        dayToCheck.setDate(today.getDate() - i);
        const dayStart = new Date(dayToCheck.setHours(0, 0, 0, 0));
        const dayEnd = new Date(dayToCheck.setHours(23, 59, 59, 999));
        
        const hasActivity = activities.some(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= dayStart && activityDate <= dayEnd;
        });
        
        if (hasActivity) {
          currentStreak++;
        } else if (i > 0) {
          break; // Break streak if no activity found (but not for today)
        }
      }

      // Get current active roadmap phase
      const activeRoadmap = roadmaps.find(r => r.isActive === true) || roadmaps[0];
      // Phase title mapping to match Career Roadmap
      const phaseLabels = {
        '30_days': '30-Day Career Advancement Plan',
        '3_months': '3-Month Foundation Building',
        '6_months': '6-Month Career Transformation'
      };
      
      const currentPhase = activeRoadmap ? {
        title: activeRoadmap.title || phaseLabels[activeRoadmap.phase as keyof typeof phaseLabels] || '30-Day Career Advancement Plan',
        progress: activeRoadmap.progress || 0,
        phase: activeRoadmap.phase || '30_days'
      } : null;

      // Get AI insights from actual resume analysis
      const aiInsights = activeResume?.gaps && Array.isArray(activeResume.gaps) ? {
        topRecommendations: [...activeResume.gaps] // Create copy to avoid mutation
          .map((gap: any) => ({
            // Normalize the gap data structure
            category: gap.category || 'General Improvement',
            rationale: gap.rationale || gap.recommendation || gap.description || 'No details provided',
            priority: (gap.priority || 'medium').toLowerCase(),
            impact: Number(gap.impact) || 0
          }))
          .sort((a: any, b: any) => {
            // Prioritize by impact and priority (same logic as Resume Analysis)
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            const aScore = (priorityWeight[a.priority as keyof typeof priorityWeight] || 1) * (a.impact || 0);
            const bScore = (priorityWeight[b.priority as keyof typeof priorityWeight] || 1) * (b.impact || 0);
            return bScore - aScore;
          })
          .slice(0, 2) // Get top 2 recommendations
      } : null;

      // Get actual roadmap tasks for dashboard display
      const currentRoadmapTasks = activeRoadmap && activeRoadmap.subsections ? 
        (activeRoadmap.subsections as any[]).flatMap(subsection => 
          (subsection.tasks || []).map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.completed ? 'completed' : 'pending',
            completed: task.completed,
            priority: task.priority || 'medium',
            dueDate: task.dueDate,
            icon: task.icon || 'clock'
          }))
        ).slice(0, 3) // Show top 3 tasks on dashboard
      : [];

      const stats = {
        rmsScore: activeResume?.rmsScore || 0,
        rmsScoreImprovement,
        applicationsCount: applications.length,
        pendingApplications: applicationStats.pending,
        interviewingCount: applicationStats.interviewing,
        applicationStats,
        roadmapProgress: roadmaps.length > 0 ? 
          Math.round(roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0) / roadmaps.length) : 0,
        currentPhase,
        currentRoadmapTasks,
        achievementsCount: achievements.length,
        recentActivities: activities,
        topJobMatches: jobMatches.slice(0, 5),
        streak: Math.max(1, currentStreak),
        totalActivities: activities.length,
        aiInsights,
        weeklyProgress: {
          applicationsThisWeek: applications.filter(app => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(app.appliedDate) > weekAgo;
          }).length,
          activitiesThisWeek: activities.filter(activity => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(activity.createdAt) > weekAgo;
          }).length
        }
      };

      // Update user session with streak info for display in header
      if ((req as any).user) {
        (req as any).user.streak = stats.streak;
        (req as any).user.unreadNotifications = Math.min(9, stats.totalActivities); // Cap at 9 for UI
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // Interview prep routes
  app.post("/api/interview-prep/generate-questions", authenticate, async (req: AuthRequest, res) => {
    try {
      const { applicationId, category, count = 10 } = req.body;
      
      if (!applicationId || !category) {
        return res.status(400).json({ error: "Application ID and category are required" });
      }

      // Get the application details to extract job info
      const applications = await storage.getUserApplications(req.user!.id);
      const application = applications.find(app => app.id === applicationId);
      
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

  app.get("/api/interview-prep/questions", authenticate, async (req: AuthRequest, res) => {
    try {
      const { applicationId, category } = req.query;
      
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }

      // Get the application details
      const applications = await storage.getUserApplications(req.user!.id);
      const application = applications.find(app => app.id === applicationId);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // For now, return empty array - questions are generated on demand
      // In a real implementation, you might want to store generated questions
      res.json([]);
    } catch (error) {
      console.error("Get interview questions error:", error);
      res.status(500).json({ error: "Failed to get interview questions" });
    }
  });

  app.get("/api/interview-prep/resources", authenticate, async (req: AuthRequest, res) => {
    try {
      const { applicationId } = req.query;
      
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }

      // Get the application details
      const applications = await storage.getUserApplications(req.user!.id);
      const application = applications.find(app => app.id === applicationId);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Extract skills from job match requirements or use defaults based on position
      let skills: string[] = [];
      if (application.jobMatchId) {
        try {
          const jobMatches = await storage.getUserJobMatches(req.user!.id);
          const jobMatch = jobMatches.find(jm => jm.id === application.jobMatchId);
          if (jobMatch && jobMatch.requirements) {
            // Extract basic skills from requirements text
            const commonSkills = ['JavaScript', 'Python', 'SQL', 'React', 'Node.js', 'AWS', 'Docker', 'Git'];
            skills = commonSkills.filter(skill => 
              jobMatch.requirements?.toLowerCase().includes(skill.toLowerCase())
            );
          }
        } catch (error) {
          console.error('Error fetching job match for skills:', error);
        }
      }
      
      // Call OpenAI to generate resources
      console.log(`Generating resources for ${application.position} at ${application.company} with skills:`, skills);
      const resources = await aiService.generatePrepResources(
        application.position,
        application.company,
        skills
      );
      console.log('OpenAI returned resources:', JSON.stringify(resources, null, 2));

      res.json(resources);
    } catch (error) {
      console.error("Get prep resources error:", error);
      res.status(500).json({ error: "Failed to get preparation resources" });
    }
  });







  // Micro-Internship Marketplace routes - Skill Gap Analysis
  app.post("/api/skill-gaps", authenticate, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertSkillGapAnalysisSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      if (!validatedData.resumeId && !validatedData.jobMatchId) {
        return res.status(400).json({ error: "Either resumeId or jobMatchId is required" });
      }
      
      const { microProjectsService } = await import("./micro-projects");
      
      const analysis = await microProjectsService.analyzeSkillGaps(
        req.user!.id,
        validatedData.resumeId,
        validatedData.jobMatchId,
        validatedData.targetRole
      );
      
      res.status(201).json(analysis);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error analyzing skill gaps:", error);
      res.status(500).json({ error: "Failed to analyze skill gaps" });
    }
  });

  app.get("/api/skill-gaps", authenticate, async (req: AuthRequest, res) => {
    try {
      const analyses = await storage.getSkillGapAnalysesByUser(req.user!.id);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching skill gap analyses:", error);
      res.status(500).json({ error: "Failed to fetch skill gap analyses" });
    }
  });

  app.get("/api/skill-gaps/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      
      if (analysis.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching skill gap analysis:", error);
      res.status(500).json({ error: "Failed to fetch skill gap analysis" });
    }
  });

  app.patch("/api/skill-gaps/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      
      if (analysis.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const updates = insertSkillGapAnalysisSchema.partial().parse(req.body);
      
      // Note: No updateSkillGapAnalysis method yet - would need to add to storage
      res.json({ message: "Update endpoint not yet implemented" });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error updating skill gap analysis:", error);
      res.status(500).json({ error: "Failed to update skill gap analysis" });
    }
  });

  app.delete("/api/skill-gaps/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getSkillGapAnalysisById(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Skill gap analysis not found" });
      }
      
      if (analysis.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Note: No deleteSkillGapAnalysis method yet - would need to add to storage
      res.status(204).json({ message: "Delete endpoint not yet implemented" });
    } catch (error) {
      console.error("Error deleting skill gap analysis:", error);
      res.status(500).json({ error: "Failed to delete skill gap analysis" });
    }
  });

  // Micro-Projects routes
  app.post("/api/micro-projects/generate", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { skillGapAnalysisId } = req.body;
      
      if (!skillGapAnalysisId) {
        return res.status(400).json({ error: "Skill gap analysis ID is required" });
      }
      
      // Verify ownership of skill gap analysis
      const analysis = await storage.getSkillGapAnalysisById(skillGapAnalysisId);
      if (!analysis || analysis.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied to skill gap analysis" });
      }
      
      const { microProjectsService } = await import("./micro-projects");
      
      const projects = await microProjectsService.generateMicroProjectsForSkillGaps(skillGapAnalysisId);
      
      res.status(201).json(projects);
    } catch (error) {
      console.error("Error generating micro-projects:", error);
      res.status(500).json({ error: "Failed to generate micro-projects" });
    }
  });

  app.get("/api/micro-projects", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { skills, limit = 20, offset = 0 } = req.query;
      
      let projects;
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        projects = await storage.getMicroProjectsBySkills(skillsArray as string[]);
      } else {
        projects = await storage.getAllMicroProjects(Number(limit), Number(offset));
      }
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching micro-projects:", error);
      res.status(500).json({ error: "Failed to fetch micro-projects" });
    }
  });

  app.get("/api/micro-projects/recommended", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { microProjectsService } = await import("./micro-projects");
      
      const projects = await microProjectsService.getRecommendedProjectsForUser(req.user!.id);
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching recommended projects:", error);
      res.status(500).json({ error: "Failed to fetch recommended projects" });
    }
  });

  // NEW: Role-based project generation
  app.post("/api/micro-projects/generate-from-role", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { targetRole, count, difficulty } = req.body;
      
      if (!targetRole || typeof targetRole !== 'string') {
        return res.status(400).json({ error: "Target role is required" });
      }
      
      const projectCount = count && typeof count === 'number' && count >= 1 && count <= 3 ? count : 2;
      const projectDifficulty = difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty) ? difficulty : 'intermediate';
      
      const { microProjectsService } = await import("./micro-projects");
      
      console.log(`Generating ${projectCount} ${projectDifficulty} projects for role: ${targetRole}`);
      const newProjects = await microProjectsService.generateProjectsForRole(targetRole, projectCount, projectDifficulty);
      
      // Create activity for project generation
      if (newProjects.length > 0) {
        await storage.createActivity(
          req.user!.id,
          "role_projects_generated",
          "Role-Based Projects Generated",
          `Generated ${newProjects.length} ${projectDifficulty} project(s) for ${targetRole}`
        );
      }
      
      res.json({
        message: `Generated ${newProjects.length} ${projectDifficulty} project(s) for ${targetRole}`,
        projects: newProjects
      });
    } catch (error) {
      console.error("Error generating role-based projects:", error);
      res.status(500).json({ error: "Failed to generate projects from role" });
    }
  });

  app.post("/api/micro-projects/generate-ai", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { microProjectsService } = await import("./micro-projects");
      
      console.log(`Generating single AI project for user ${req.user!.id}`);
      const newProjects = await microProjectsService.generateAIPoweredProjects(req.user!.id);
      
      // Create activity for AI project generation
      if (newProjects.length > 0) {
        await storage.createActivity(
          req.user!.id,
          "ai_project_generated",
          "AI Project Generated",
          `Generated new practice project: ${newProjects[0].title}`
        );
      }
      
      if (newProjects.length === 0) {
        return res.status(200).json({
          message: "Generated fallback project",
          projects: [{
            id: 'fallback-' + Date.now(),
            title: "Product Management Fundamentals Practice",
            description: "Learn core PM skills through hands-on exercises with user stories, roadmaps, and stakeholder alignment.",
            targetSkill: "Product Management",
            difficulty: "intermediate",
            estimatedHours: 10,
            tags: ['product management'],
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

  app.get("/api/micro-projects/:id", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
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

  app.patch("/api/micro-projects/:id", requireAdmin, async (req: AuthRequest, res) => {
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
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error updating micro-project:", error);
      res.status(500).json({ error: "Failed to update micro-project" });
    }
  });

  // Clear all projects for the current user (must come before /:id route)
  app.delete("/api/micro-projects/clear", authenticate, async (req: AuthRequest, res) => {
    try {
      // Delete all micro projects from the database
      await storage.clearAllMicroProjects();
      
      // Delete all project completions for this user
      await storage.clearAllProjectCompletions(req.user!.id);
      
      res.json({ message: "All projects cleared successfully" });
    } catch (error) {
      console.error("Error clearing all micro-projects:", error);
      res.status(500).json({ error: "Failed to clear all projects" });
    }
  });

  app.delete("/api/micro-projects/:id", requireAdmin, async (req: AuthRequest, res) => {
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

  app.post("/api/micro-projects/:projectId/start", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { projectId } = req.params;
      
      const { microProjectsService } = await import("./micro-projects");
      
      await microProjectsService.startProject(req.user!.id, projectId);
      
      res.json({ message: "Project started successfully" });
    } catch (error) {
      console.error("Error starting project:", error);
      res.status(500).json({ error: "Failed to start project" });
    }
  });

  app.put("/api/micro-projects/:projectId/progress", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { projectId } = req.params;
      const { progressPercentage, timeSpent } = req.body;
      
      if (progressPercentage < 0 || progressPercentage > 100) {
        return res.status(400).json({ error: "Progress percentage must be between 0 and 100" });
      }
      
      const { microProjectsService } = await import("./micro-projects");
      
      await microProjectsService.updateProjectProgress(
        req.user!.id, 
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

  app.post("/api/micro-projects/:projectId/complete", authenticate, requirePaidFeatures, async (req: AuthRequest, res) => {
    try {
      const { projectId } = req.params;
      const { artifactUrls, reflectionNotes, selfAssessment } = req.body;
      
      if (!artifactUrls || artifactUrls.length === 0) {
        return res.status(400).json({ error: "At least one artifact URL is required" });
      }
      
      // Verify project exists
      const project = await storage.getMicroProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const { microProjectsService } = await import("./micro-projects");
      
      await microProjectsService.completeProject(
        req.user!.id,
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

  // Project Completions routes
  app.get("/api/project-completions", authenticate, async (req: AuthRequest, res) => {
    try {
      const completions = await storage.getProjectCompletionsByUser(req.user!.id);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching project completions:", error);
      res.status(500).json({ error: "Failed to fetch project completions" });
    }
  });

  app.patch("/api/project-completions/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Verify ownership through existing completion
      const existingCompletion = await storage.getProjectCompletionsByUser(req.user!.id);
      const completion = existingCompletion.find(c => c.id === id);
      
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

  // Portfolio Artifacts routes
  app.post("/api/portfolio-artifacts", authenticate, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertPortfolioArtifactSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const artifactId = await storage.createPortfolioArtifact(validatedData);
      res.status(201).json({ id: artifactId, message: "Portfolio artifact created successfully" });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Error creating portfolio artifact:", error);
      res.status(500).json({ error: "Failed to create portfolio artifact" });
    }
  });

  app.get("/api/portfolio-artifacts", authenticate, async (req: AuthRequest, res) => {
    try {
      const artifacts = await storage.getPortfolioArtifactsByUser(req.user!.id);
      res.json(artifacts);
    } catch (error) {
      console.error("Error fetching portfolio artifacts:", error);
      res.status(500).json({ error: "Failed to fetch portfolio artifacts" });
    }
  });

  // Stripe routes
  // Initialize Stripe (only if keys are present)
  let stripe: Stripe | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    });
  }

  // Create Stripe checkout session for paid subscriptions
  app.post("/api/stripe/create-checkout-session", authenticate, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return res.status(500).json({ error: "Stripe Price ID is not configured. Please add STRIPE_PRICE_ID to your environment variables." });
    }

    try {
      const user = req.user!;

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Construct base URL with proper scheme
      const referer = req.get("referer") || "http://localhost:5000";
      const url = new URL(referer);
      const baseUrl = `${url.protocol}//${url.host}`;

      // Create checkout session with 14-day trial
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        payment_method_collection: 'always', // Require payment method upfront
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 14,
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel', // Cancel subscription if no payment method
            },
          },
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
        metadata: {
          userId: user.id,
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Stripe checkout session error:', error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Stripe webhook handler
  app.post("/api/stripe/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event: Stripe.Event;

    try {
      // In production, you should use a webhook secret
      // For now, we'll parse the event directly
      event = req.body;

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription as string;

          if (userId && subscriptionId) {
            // Update user subscription status - will be 'trialing' during trial period
            await storage.updateUser(userId, {
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'trialing',
            });
            console.log(`✅ Subscription created for user ${userId} (trial period active)`);
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            // Map Stripe status to our subscription status
            let subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' = 'active';
            
            if (subscription.status === 'trialing') {
              subscriptionStatus = 'trialing';
            } else if (subscription.status === 'past_due') {
              subscriptionStatus = 'past_due';
            } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
              subscriptionStatus = 'canceled';
            } else if (subscription.status === 'incomplete' || subscription.status === 'incomplete_expired') {
              subscriptionStatus = 'incomplete';
            } else if (subscription.status === 'active') {
              subscriptionStatus = 'active';
            }

            await storage.updateUser(user.id, {
              subscriptionStatus,
              subscriptionTier: subscriptionStatus === 'active' || subscriptionStatus === 'trialing' ? 'paid' : 'free',
            });
            
            console.log(`✅ Subscription updated for user ${user.id}: ${subscriptionStatus}`);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            // Downgrade to free tier and clear subscription data
            await storage.updateUser(user.id, {
              subscriptionStatus: 'canceled',
              subscriptionTier: 'free',
              stripeSubscriptionId: null,
            });
            
            console.log(`✅ Subscription canceled for user ${user.id}, downgraded to free tier`);
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;

          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            // Update user to past_due status to restrict access
            await storage.updateUser(user.id, {
              subscriptionStatus: 'past_due',
              subscriptionTier: 'free', // Downgrade access immediately
            });
            
            console.log(`⚠️ Payment failed for user ${user.id}, status set to past_due`);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  });

  // Verify Stripe checkout session and log user in (for new user registration)
  app.post("/api/stripe/verify-and-login", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: "Payment not completed" });
      }

      const userId = session.metadata?.userId;

      if (!userId) {
        return res.status(400).json({ error: "User ID not found in session" });
      }

      // Get user and verify subscription is active
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update subscription status if needed
      if (user.subscriptionStatus !== 'active') {
        await storage.updateUser(userId, {
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
        });
      }

      // Create session token for login
      const token = generateToken();
      await storage.createSession(userId, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      console.log(`✅ User ${userId} logged in after payment completion`);

      res.json({
        user: { ...user, password: undefined, subscriptionStatus: 'active' },
        token,
      });
    } catch (err: any) {
      console.error('Verify and login error:', err.message);
      res.status(500).json({ error: err.message || "Failed to verify payment" });
    }
  });

  // Verify Stripe checkout session for existing logged-in users upgrading
  app.post("/api/stripe/verify-session", authenticate, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const { sessionId } = req.body;
      const userId = req.user!.id;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: "Payment not completed" });
      }

      // Verify the session belongs to this user
      if (session.metadata?.userId !== userId) {
        return res.status(403).json({ error: "Session does not belong to this user" });
      }

      // Update user subscription status
      await storage.updateUser(userId, {
        stripeSubscriptionId: session.subscription as string,
        subscriptionTier: 'paid',
        subscriptionStatus: 'active',
      });

      console.log(`✅ Subscription activated for existing user ${userId}`);

      res.json({ success: true, message: "Subscription activated successfully" });
    } catch (err: any) {
      console.error('Verify session error:', err.message);
      res.status(500).json({ error: err.message || "Failed to verify payment" });
    }
  });

  // Cancel subscription endpoint
  app.post("/api/stripe/cancel-subscription", authenticate, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);

      if (!user || !user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Cancel the subscription at period end
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update user to free tier
      await storage.updateUser(userId, {
        subscriptionTier: 'free',
        subscriptionStatus: 'canceled',
      });

      console.log(`✅ Subscription canceled for user ${userId}`);

      res.json({ success: true, message: "Subscription canceled successfully" });
    } catch (err: any) {
      console.error('Cancel subscription error:', err.message);
      res.status(500).json({ error: err.message || "Failed to cancel subscription" });
    }
  });

  // Create Stripe billing portal session
  app.post("/api/stripe/billing-portal", authenticate, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);

      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? (process.env.REPLIT_DEV_DOMAIN.startsWith('http') ? process.env.REPLIT_DEV_DOMAIN : `https://${process.env.REPLIT_DEV_DOMAIN}`)
        : 'http://localhost:5000';

      // Create billing portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${baseUrl}/dashboard`,
      });

      console.log(`✅ Billing portal created for user ${userId}`);

      res.json({ url: session.url });
    } catch (err: any) {
      console.error('Billing portal error:', err.message);
      res.status(500).json({ error: err.message || "Failed to create billing portal" });
    }
  });

  // Delete user account endpoint
  app.delete("/api/users/delete-account", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cancel Stripe subscription if exists
      if (stripe && user.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          console.log(`✅ Stripe subscription canceled for user ${userId}`);
        } catch (err: any) {
          console.error('Error canceling Stripe subscription:', err.message);
        }
      }

      // Delete user (this should cascade delete related data)
      await storage.deleteUser(userId);

      console.log(`✅ User account deleted: ${userId}`);

      res.json({ success: true, message: "Account deleted successfully" });
    } catch (err: any) {
      console.error('Delete account error:', err.message);
      res.status(500).json({ error: err.message || "Failed to delete account" });
    }
  });

  // Tour tracking routes
  app.get("/api/tours/status", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const completedTours = await storage.getUserCompletedTours(userId);
      
      res.json({ 
        completedTours: completedTours.map(t => t.tourId)
      });
    } catch (err: any) {
      console.error('Get tour status error:', err.message);
      res.status(500).json({ error: err.message || "Failed to fetch tour status" });
    }
  });

  app.post("/api/tours/complete", authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { tourId } = req.body;

      if (!tourId || typeof tourId !== 'string') {
        return res.status(400).json({ error: "Tour ID is required" });
      }

      // Check if already completed
      const existingCompletion = await storage.getTourCompletion(userId, tourId);
      
      if (existingCompletion) {
        return res.json({ 
          message: "Tour already completed",
          completion: existingCompletion
        });
      }

      // Mark as completed
      const completion = await storage.completeTour(userId, tourId);
      
      res.json({ 
        message: "Tour marked as completed",
        completion
      });
    } catch (err: any) {
      console.error('Complete tour error:', err.message);
      res.status(500).json({ error: err.message || "Failed to mark tour as completed" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactFormSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        subject: z.string().min(5),
        message: z.string().min(10),
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
        message,
      });

      if (!success) {
        return res.status(500).json({ error: "Failed to send email. Please try again later." });
      }

      res.json({ message: "Contact form submitted successfully" });
    } catch (err: any) {
      console.error('Contact form error:', err.message);
      res.status(500).json({ error: err.message || "Failed to send contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
