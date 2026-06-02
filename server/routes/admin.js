const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");
const nodemailer = require("nodemailer");

// ── Beautiful Welcome Email ───────────────────────────────────
const sendAdminCredentials = async (email, name, password, role) => {
  console.log(`📧 Sending welcome email to ${email}...`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const roleLabel = role === "super_admin" ? "Super Admin" : "Admin";
  const roleColor = role === "super_admin" ? "#ff6b00" : "#00c853";
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- ══ HERO ══ -->
  <tr>
    <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2d1a00 50%,#1a1a1a 100%);
               border-radius:20px 20px 0 0;padding:0;overflow:hidden;">

      <!-- Orange top bar -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:5px;"></td>
        </tr>
      </table>

      <!-- Hero content -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:48px 40px 40px;text-align:center;">

            <!-- Burger icon with glow ring -->
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:24px;">
              <tr>
                <td style="background:rgba(255,107,0,0.15);border:2px solid rgba(255,107,0,0.4);
                           border-radius:50%;width:90px;height:90px;text-align:center;
                           vertical-align:middle;font-size:44px;line-height:90px;">
                  🍔
                </td>
              </tr>
            </table>

            <h1 style="margin:0 0 6px;color:#ffffff;font-size:32px;font-weight:900;
                       letter-spacing:-0.5px;text-shadow:0 2px 8px rgba(255,107,0,0.3);">
              The Hungry Hub
            </h1>
            <p style="margin:0 0 24px;color:rgba(255,255,255,0.45);font-size:12px;
                      letter-spacing:4px;text-transform:uppercase;">
              Admin Management System
            </p>

            <!-- Welcome badge -->
            <table cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td style="background:linear-gradient(135deg,#ff6b00,#ff3d00);
                           border-radius:50px;padding:10px 28px;">
                  <span style="color:#fff;font-size:15px;font-weight:800;letter-spacing:1px;">
                    🎉 &nbsp; WELCOME ABOARD!
                  </span>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ WELCOME MESSAGE ══ -->
  <tr>
    <td style="background:#ffffff;padding:40px 40px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #ff6b00;padding-left:20px;margin-bottom:24px;">
            <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:24px;font-weight:800;">
              Hi ${name}! 👋
            </h2>
            <p style="margin:0;color:#555;font-size:15px;line-height:1.7;">
              You have been successfully added as a
              <strong style="color:${roleColor};">&nbsp;${roleLabel}&nbsp;</strong>
              at <strong style="color:#ff6b00;">The Hungry Hub</strong>.
              Your account is now active and ready to use.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ CREDENTIALS SECTION ══ -->
  <tr>
    <td style="background:#ffffff;padding:0 40px 32px;">

      <p style="margin:0 0 16px;color:#999;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:2px;">
        🔐 Your Login Credentials
      </p>

      <!-- Dark card -->
      <table width="100%" cellpadding="0" cellspacing="0"
             style="background:linear-gradient(135deg,#111111,#1e1e1e);
                    border-radius:16px;border:1px solid rgba(255,107,0,0.2);
                    overflow:hidden;">
        <tr>
          <td style="padding:28px;">

            <!-- Email field -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:rgba(255,107,0,0.08);border:1px solid rgba(255,107,0,0.2);
                           border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 5px;color:#ff6b00;font-size:10px;font-weight:700;
                             text-transform:uppercase;letter-spacing:2px;">
                    📧 &nbsp; Email Address
                  </p>
                  <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">
                    ${email}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Password field -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:rgba(255,107,0,0.08);border:1px solid rgba(255,107,0,0.2);
                           border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 5px;color:#ff6b00;font-size:10px;font-weight:700;
                             text-transform:uppercase;letter-spacing:2px;">
                    🔑 &nbsp; Password
                  </p>
                  <p style="margin:0;color:#ffffff;font-size:24px;font-weight:900;
                             letter-spacing:6px;font-family:'Courier New',Courier,monospace;">
                    ${password}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Role field -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:rgba(255,107,0,0.08);border:1px solid rgba(255,107,0,0.2);
                           border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 8px;color:#ff6b00;font-size:10px;font-weight:700;
                             text-transform:uppercase;letter-spacing:2px;">
                    👤 &nbsp; Access Level
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:${roleColor};border-radius:20px;
                                 padding:6px 18px;">
                        <span style="color:#fff;font-size:13px;font-weight:800;">
                          ${roleLabel}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>
        <!-- Bottom glow bar -->
        <tr>
          <td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:3px;"></td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- ══ CTA BUTTON ══ -->
  <tr>
    <td style="background:#ffffff;padding:0 40px 36px;text-align:center;">
      <table cellpadding="0" cellspacing="0" align="center">
        <tr>
          <td style="background:linear-gradient(135deg,#ff6b00,#ff3d00);
                     border-radius:50px;
                     box-shadow:0 8px 28px rgba(255,107,0,0.45);">
            <a href="http://localhost:5175/login"
               style="display:block;color:#ffffff;text-decoration:none;
                      padding:16px 52px;font-size:17px;font-weight:800;
                      letter-spacing:0.5px;">
              🚀 &nbsp; Login to Admin Panel
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;color:#bbb;font-size:12px;">
        URL: <span style="color:#ff6b00;">http://localhost:5175/login</span>
      </p>
    </td>
  </tr>

  <!-- ══ DIVIDER ══ -->
  <tr>
    <td style="background:#ffffff;padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:2px dashed #f0f0f0;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ TIPS ══ -->
  <tr>
    <td style="background:#ffffff;padding:28px 40px 36px;">
      <p style="margin:0 0 18px;color:#999;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:2px;">
        💡 Quick Start Guide
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="48%" style="vertical-align:top;padding-right:8px;padding-bottom:12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff8f5;border:1px solid #ffd5b8;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 6px;font-size:22px;">🔒</p>
                  <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700;">Change Password</p>
                  <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">Update immediately after first login for security</p>
                </td>
              </tr>
            </table>
          </td>
          <td width="4%"></td>
          <td width="48%" style="vertical-align:top;padding-left:8px;padding-bottom:12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff8f5;border:1px solid #ffd5b8;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 6px;font-size:22px;">🖥️</p>
                  <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700;">Use Desktop</p>
                  <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">Admin panel is optimized for desktop browsers</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="48%" style="vertical-align:top;padding-right:8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff8f5;border:1px solid #ffd5b8;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 6px;font-size:22px;">🛡️</p>
                  <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700;">Stay Secure</p>
                  <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">Never share your login credentials with anyone</p>
                </td>
              </tr>
            </table>
          </td>
          <td width="4%"></td>
          <td width="48%" style="vertical-align:top;padding-left:8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff8f5;border:1px solid #ffd5b8;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 6px;font-size:22px;">🆘</p>
                  <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700;">Need Help?</p>
                  <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">Reach out to your Super Admin anytime</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ FOOTER ══ -->
  <tr>
    <td style="background:linear-gradient(135deg,#1a1a1a,#2d1a00);
               border-radius:0 0 20px 20px;padding:32px 40px;text-align:center;">
      <p style="margin:0 0 4px;color:#ff6b00;font-size:18px;font-weight:900;letter-spacing:0.5px;">
        🍔 The Hungry Hub
      </p>
      <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:12px;letter-spacing:1px;">
        FRESH FOOD &nbsp;·&nbsp; FAST DELIVERY &nbsp;·&nbsp; HAPPY CUSTOMERS
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
            <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;line-height:1.6;">
              This email was sent on ${date}<br/>
              This is an automated message — please do not reply directly to this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom orange strip -->
  <tr>
    <td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:4px;border-radius:0 0 4px 4px;"></td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

  await transporter.sendMail({
    from: `"The Hungry Hub 🍔" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Welcome to The Hungry Hub, ${name}! Your ${roleLabel} Access is Ready`,
    html,
  });

  console.log(`✅ Welcome email sent to ${email}`);
};

// ── GET all admins ────────────────────────────────────────────
router.get("/admins", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).select("-password");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// ── POST create admin ─────────────────────────────────────────
router.post("/admins", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const { name, email, password, role, phone, department, notes } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const admin = await User.create({
      name, email, password,
      role: ["delivery", "admin"].includes(role) ? role : "admin",
      isVerified: true,
      phone:      phone      || "",
      department: department || "",
      notes:      notes      || "",
    });

    try {
      await sendAdminCredentials(email, name, password, admin.role);
    } catch (emailErr) {
      console.error("❌ Email failed:", emailErr.message);
    }

    res.status(201).json({
      message: "Admin created! Credentials sent to email.",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create admin" });
  }
});

// ── PUT update admin ──────────────────────────────────────────
router.put("/admins/:id", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const { name, password, role, phone, department, notes } = req.body;
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name !== undefined)       admin.name       = name;
    if (phone !== undefined)      admin.phone      = phone;
    if (department !== undefined) admin.department = department;
    if (notes !== undefined)      admin.notes      = notes;
    if (role && role !== "super_admin") admin.role = role;
    if (password)                 admin.password   = password;

    await admin.save();
    const result = admin.toObject();
    delete result.password;
    res.json({ message: "Admin updated successfully", admin: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update admin" });
  }
});

// ── DELETE admin ──────────────────────────────────────────────
router.delete("/admins/:id", protect, restrictTo("super_admin"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.role === "super_admin") return res.status(403).json({ message: "Cannot delete super admin" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin" });
  }
});

module.exports = router;

// ── GET /api/admin/dashboard ──────────────────────────────────
// Dashboard stats for super admin
router.get("/dashboard", protect, restrictTo("super_admin", "admin"), async (req, res) => {
  try {
    const Order    = require("../models/Order");
    const MenuItem = require("../models/MenuItem");
    const User     = require("../models/User");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today); todayEnd.setHours(23,59,59,999);

    const [
      totalOrders, pendingOrders, totalUsers, totalMenuItems,
      todayOrders, recentOrders, topItems,
      allOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["pending","confirmed","preparing","out_for_delivery"] } }),
      User.countDocuments({ role: "user" }),
      MenuItem.countDocuments({ isAvailable: true }),
      Order.countDocuments({ createdAt: { $gte: today, $lte: todayEnd } }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user","name"),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", totalOrders: { $sum: "$items.qty" }, revenue: { $sum: { $multiply: ["$items.price","$items.qty"] } } } },
        { $sort: { totalOrders: -1 } },
        { $limit: 5 }
      ]),
      Order.find().select("totalAmount status createdAt"),
    ]);

    const totalRevenue = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const todayRevenue = allOrders
      .filter(o => o.createdAt >= today && o.createdAt <= todayEnd)
      .reduce((s, o) => s + (o.totalAmount || 0), 0);

    const deliveredOrders = allOrders.filter(o => o.status === "delivered").length;

    res.json({
      stats: {
        totalOrders, pendingOrders, totalRevenue,
        totalUsers, totalMenuItems, deliveredOrders,
        todayOrders, todayRevenue,
      },
      recentOrders: recentOrders.map(o => ({
        id:       o._id.toString().slice(-6).toUpperCase(),
        customer: o.user?.name || "Guest",
        amount:   o.totalAmount,
        status:   o.status,
        time:     getTimeAgo(o.createdAt),
      })),
      topItems: topItems.map(i => ({
        name:   i._id,
        orders: i.totalOrders,
        revenue: i.revenue,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

function getTimeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
