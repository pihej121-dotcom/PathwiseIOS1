import { Resend } from "resend";

export interface EmailVerificationData {
  email: string;
  token: string;
  institutionName: string;
}

export interface InvitationEmailData {
  email: string;
  token: string;
  institutionName: string;
  inviterName: string;
  role: string;
}

export interface LicenseNotificationData {
  adminEmail: string;
  institutionName: string;
  usedSeats: number;
  totalSeats: number;
  usagePercentage: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PasswordResetData {
  email: string;
  token: string;
  userName: string;
}

export interface AdminWelcomeData {
  email: string;
  password: string;
  institutionName: string;
  studentLimit: number;
  licenseEndDate: string;
}

/* ✅ 1. Clean, Railway-friendly Resend client setup */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Pathwise <noreply@pathwise.nyc>";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY not found in environment variables. Please set it in Railway."
    );
  }

  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

/* ✅ 2. Main EmailService */
export class EmailService {
  private getBaseUrl(): string {
    // Detect Railway or production
    if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === "production") {
      return "https://pathwise.nyc"; // <-- use your live domain
    }

    // Development fallback
    return process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:5000";
  }

  async sendEmailVerification(data: EmailVerificationData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      const verificationUrl = `${this.getBaseUrl()}/verify-email?token=${data.token}`;

      await client.emails.send({
        from: fromEmail,
        to: data.email,
        subject: `Verify your email for ${data.institutionName}`,
        html: `
          <p>Welcome to <strong>${data.institutionName}</strong> on Pathwise!</p>
          <p>Please verify your email by clicking below:</p>
          <a href="${verificationUrl}" style="color:#667eea;">Verify Email</a>
        `,
      });

      return true;
    } catch (error) {
      console.error("❌ Failed to send email verification:", error);
      return false;
    }
  }

  async sendInvitation(data: InvitationEmailData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      const invitationUrl = `${this.getBaseUrl()}/register?token=${data.token}`;

      const result = await client.emails.send({
        from: fromEmail,
        to: data.email,
        subject: `You're invited to join ${data.institutionName} on Pathwise`,
        html: `
          <p><strong>${data.inviterName}</strong> invited you to join <strong>${data.institutionName}</strong> on Pathwise as a ${data.role}.</p>
          <p><a href="${invitationUrl}" style="color:#667eea;">Accept Invitation</a></p>
        `,
      });

      console.log(`✅ Invitation email sent to ${data.email}: ${result.data?.id}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send invitation email:", error);
      return false;
    }
  }

  async sendLicenseUsageNotification(data: LicenseNotificationData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      await client.emails.send({
        from: fromEmail,
        to: data.adminEmail,
        subject: `License usage alert for ${data.institutionName}`,
        html: `
          <p>${data.institutionName} has used ${data.usedSeats}/${data.totalSeats} seats (${data.usagePercentage}%).</p>
          <p>Please monitor your usage or consider upgrading.</p>
        `,
      });
      return true;
    } catch (error) {
      console.error("❌ Failed to send license usage notification:", error);
      return false;
    }
  }

  async sendContactForm(data: ContactFormData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      await client.emails.send({
        from: fromEmail,
        to: "patrick@pathwise.nyc",
        replyTo: data.email,
        subject: `Contact Form: ${data.subject}`,
        html: `
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Message:</strong><br>${data.message}</p>
        `,
      });
      return true;
    } catch (error) {
      console.error("❌ Failed to send contact form email:", error);
      return false;
    }
  }

  async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      const resetUrl = `${this.getBaseUrl()}/reset-password?token=${data.token}`;
      await client.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Reset your Pathwise password",
        html: `
          <p>Hello ${data.userName},</p>
          <p>Click below to reset your password:</p>
          <a href="${resetUrl}" style="color:#667eea;">Reset Password</a>
        `,
      });
      return true;
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      return false;
    }
  }

  async sendAdminWelcome(data: AdminWelcomeData): Promise<boolean> {
    try {
      const { client, fromEmail } = getResendClient();
      const loginUrl = `${this.getBaseUrl()}/login`;

      await client.emails.send({
        from: fromEmail,
        to: data.email,
        subject: `Welcome to Pathwise (${data.institutionName})`,
        html: `
          <p>Welcome to Pathwise! Your institution <strong>${data.institutionName}</strong> is now active.</p>
          <p><strong>Login:</strong> ${data.email}</p>
          <p><strong>Temp Password:</strong> ${data.password}</p>
          <p>Seats: ${data.studentLimit}<br>License Ends: ${data.licenseEndDate}</p>
          <p><a href="${loginUrl}" style="color:#667eea;">Login Now</a></p>
        `,
      });

      console.log(`✅ Admin welcome email sent to ${data.email}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send admin welcome email:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();

