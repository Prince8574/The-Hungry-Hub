const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// ── Usage:
//   node createSuperAdmin.js                              → default credentials
//   node createSuperAdmin.js email@example.com MyPass123  → custom credentials
// ─────────────────────────────────────────────────────────

const email    = process.argv[2] || "superadmin@hungry.com";
const password = process.argv[3] || "super123";
const name     = process.argv[4] || "Super Admin";

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role === "super_admin") {
        console.log("ℹ️  Super Admin already exists:", existing.email);
      } else {
        // Upgrade to super_admin
        existing.role     = "super_admin";
        existing.password = password;
        existing.isVerified = true;
        await existing.save();
        console.log("✅ User upgraded to Super Admin:", existing.email);
      }
      process.exit(0);
    }

    // Create new super admin
    const superAdmin = await User.create({
      name,
      email,
      password,
      role:       "super_admin",
      isVerified: true,
    });

    console.log("\n🎉 Super Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 Email:    ${superAdmin.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role:     ${superAdmin.role}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🌐 Login at: http://localhost:5175/login\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();
