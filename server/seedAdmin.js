const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin users already exist
    const existingAdmin = await User.findOne({ email: "admin@hungry.com" });
    const existingSuperAdmin = await User.findOne({ email: "superadmin@hungry.com" });

    if (!existingAdmin) {
      // Create admin user
      const admin = new User({
        name: "Admin User",
        email: "admin@hungry.com",
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      await admin.save();
      console.log("✅ Admin user created: admin@hungry.com / admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    if (!existingSuperAdmin) {
      // Create super admin user
      const superAdmin = new User({
        name: "Super Admin",
        email: "superadmin@hungry.com",
        password: "super123",
        role: "super_admin",
        isVerified: true,
      });
      await superAdmin.save();
      console.log("✅ Super Admin user created: superadmin@hungry.com / super123");
    } else {
      console.log("ℹ️ Super Admin user already exists");
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();