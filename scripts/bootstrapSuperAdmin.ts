import { storage } from "../server/storage";
import { hashPassword } from "../server/auth";

const BOOTSTRAP_SECRET = process.env.BOOTSTRAP_SUPERADMIN_SECRET;
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;

async function bootstrapSuperAdmin() {
  console.log("🔐 Starting super admin bootstrap process...");

  if (!BOOTSTRAP_SECRET) {
    console.error("❌ BOOTSTRAP_SUPERADMIN_SECRET environment variable is required");
    process.exit(1);
  }

  if (!SUPERADMIN_EMAIL) {
    console.error("❌ SUPERADMIN_EMAIL environment variable is required");
    process.exit(1);
  }

  if (!SUPERADMIN_PASSWORD) {
    console.error("❌ SUPERADMIN_PASSWORD environment variable is required");
    process.exit(1);
  }

  if (SUPERADMIN_PASSWORD.length < 8) {
    console.error("❌ SUPERADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  try {
    const existingUser = await storage.getUserByEmail(SUPERADMIN_EMAIL);
    
    if (existingUser && existingUser.role === "super_admin") {
      console.log("⚠️  Super admin already exists with this email");
      console.log(`   Email: ${SUPERADMIN_EMAIL}`);
      console.log("   No changes made.");
      process.exit(0);
    }

    if (existingUser) {
      console.error("❌ A user with this email already exists but is not a super_admin");
      console.error(`   Email: ${SUPERADMIN_EMAIL}`);
      console.error(`   Current role: ${existingUser.role}`);
      process.exit(1);
    }

    const hashedPassword = await hashPassword(SUPERADMIN_PASSWORD);
    
    const superAdmin = await storage.createUser({
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "super_admin",
      isVerified: true,
      isActive: true,
      subscriptionTier: "institutional",
      subscriptionStatus: "active"
    });

    console.log("✅ Super admin created successfully!");
    console.log(`   User ID: ${superAdmin.id}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log("\n🎉 You can now log in with these credentials");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create super admin:", error);
    process.exit(1);
  }
}

bootstrapSuperAdmin();
