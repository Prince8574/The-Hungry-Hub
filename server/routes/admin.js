const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");

// Get all admins (super_admin only)
router.get("/admins", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] }
    }).select("-password");

    res.json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// Create new admin (super_admin only)
router.post("/admins", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Prevent creating super_admin through API
    if (role === "super_admin") {
      return res.status(403).json({ message: "Cannot create super admin through API" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new admin (force role to be 'admin')
    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      isVerified: true,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Failed to create admin" });
  }
});

// Update admin (super_admin only)
router.put("/admins/:id", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    
    // Prevent changing role to super_admin
    if (role && role !== "super_admin") {
      updateData.role = role;
    }
    
    if (password) {
      // Password will be hashed by pre-save hook
      updateData.password = password;
    }

    const admin = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: "Admin updated successfully",
      admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Failed to update admin" });
  }
});

// Delete admin (super_admin only)
router.delete("/admins/:id", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deleting super_admin
    if (admin.role === "super_admin") {
      return res.status(403).json({ message: "Cannot delete super admin" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Failed to delete admin" });
  }
});

module.exports = router;
