const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
      console.log("Super Admin already exists:", existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@hungry.com",
      password: "super123",
      role: "super_admin",
      isVerified: true,
    });

    console.log("✅ Super Admin created successfully!");
    console.log("Email:", superAdmin.email);
    console.log("Password: super123");
    console.log("Role:", superAdmin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
