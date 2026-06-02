const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateOtp, sendOtpEmail } = require("../utils/sendOtp");

// ── Helper: generate JWT ─────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

const sendTokenCookie = (res, user) => {
  const token = signToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

// ── POST /api/auth/send-otp ──────────────────────────────────
router.post("/send-otp", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // Check if email already registered & verified
    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP temporarily (upsert unverified user)
    await User.findOneAndUpdate(
      { email },
      { email, name, otp: { code: otp, expiresAt }, isVerified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(email, name, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ── POST /api/auth/register ──────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Please request an OTP first" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (!user.otp?.code || user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP has expired. Please resend." });
    }

    // Set password and verify
    user.name = name;
    user.password = password;
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = sendTokenCookie(res, user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const token = sendTokenCookie(res, user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ── POST /api/auth/logout ────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// ── POST /api/auth/forgot-password ───────────────────────────
// Step 1: Send OTP to registered email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(404).json({ message: "No account found with this email" });

    const otp       = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp = { code: otp, expiresAt };
    await user.save();

    // Send OTP email
    await sendOtpEmail(email, user.name, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("forgot-password error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ── POST /api/auth/verify-reset-otp ──────────────────────────
// Step 2: Verify OTP
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp?.code || user.otp.code !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > user.otp.expiresAt)
      return res.status(400).json({ message: "OTP expired. Please request a new one." });

    // Generate a short-lived reset token
    const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.json({ message: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

// ── POST /api/auth/reset-password ────────────────────────────
// Step 3: Set new password using reset token
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword)
      return res.status(400).json({ message: "Reset token and new password required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Reset token expired or invalid. Please start over." });
    }

    if (decoded.purpose !== "reset")
      return res.status(400).json({ message: "Invalid reset token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Use save() so pre-save hook hashes the password
    user.password = newPassword;
    user.otp      = undefined;
    await user.save();

    res.json({ message: "Password reset successfully! You can now login." });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed" });
  }
});

module.exports = router;
