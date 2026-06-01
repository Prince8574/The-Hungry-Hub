const express  = require("express");
const router   = express.Router();
const jwt      = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User     = require("../models/User");
const Order    = require("../models/Order");
const { protect } = require("../middleware/auth");
const { sendOrderNotification } = require("../utils/orderNotifications");

// ── Middleware: delivery only ─────────────────────────────────
const deliveryOnly = (req, res, next) => {
  const allowed = ["delivery", "admin", "super_admin"];
  if (!allowed.includes(req.user.role))
    return res.status(403).json({ message: "Delivery access only" });
  next();
};

// ── Generate 6-digit OTP ──────────────────────────────────────
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send delivery OTP email to customer ──────────────────────
const sendDeliveryOtp = async (customerEmail, customerName, otp, orderShortId) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"The Hungry Hub 🍔" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `🚚 Your Order #${orderShortId} is at your door! OTP: ${otp}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

  <tr><td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:4px;border-radius:4px 4px 0 0;"></td></tr>

  <tr>
    <td style="background:#1a1a1a;padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🚚</div>
      <h1 style="margin:0 0 6px;color:#fff;font-size:24px;font-weight:800;">Your Order is Here!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Delivery Confirmation</p>
    </td>
  </tr>

  <tr>
    <td style="background:#fff;padding:32px;">
      <p style="margin:0 0 8px;font-size:16px;color:#1a1a1a;">Hi <strong>${customerName}</strong>! 👋</p>
      <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">
        Your delivery partner is at your door with order <strong style="color:#ff6b00;">#${orderShortId}</strong>.<br/>
        Please share this OTP with the delivery partner to confirm receipt.
      </p>

      <div style="background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#ff6b00;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
          🔐 Delivery OTP
        </p>
        <div style="font-size:42px;font-weight:900;color:#fff;letter-spacing:12px;font-family:'Courier New',monospace;margin:8px 0;">
          ${otp}
        </div>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:12px;">
          Valid for 10 minutes only
        </p>
      </div>

      <div style="background:#fff8f5;border:1px solid #ffd5b8;border-radius:10px;padding:14px 16px;">
        <p style="margin:0;color:#888;font-size:12px;line-height:1.6;">
          ⚠️ <strong>Do NOT share this OTP</strong> with anyone other than your delivery partner.<br/>
          If you did not place this order, please contact us immediately.
        </p>
      </div>
    </td>
  </tr>

  <tr>
    <td style="background:#1a1a1a;padding:20px 32px;text-align:center;border-radius:0 0 16px 16px;">
      <p style="margin:0;color:#ff6b00;font-size:14px;font-weight:800;">🍔 The Hungry Hub</p>
      <p style="margin:4px 0 0;color:#555;font-size:11px;">Fresh Food · Fast Delivery · Happy Customers</p>
    </td>
  </tr>

  <tr><td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:4px;border-radius:0 0 4px 4px;"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  });
  console.log(`✅ Delivery OTP ${otp} sent to ${customerEmail}`);
};

// ── POST /api/delivery/login ──────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({
      email,
      role: { $in: ["delivery", "admin", "super_admin"] },
    }).select("+password");

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ── GET /api/delivery/orders ──────────────────────────────────
router.get("/orders", protect, deliveryOnly, async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["confirmed", "preparing", "out_for_delivery"] },
    })
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ── GET /api/delivery/my-orders ───────────────────────────────
router.get("/my-orders", protect, deliveryOnly, async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ── PUT /api/delivery/orders/:id/status ──────────────────────
// out_for_delivery: direct update
// delivered: requires OTP verification first (send OTP step)
router.put("/orders/:id/status", protect, deliveryOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["out_for_delivery", "delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "out_for_delivery") {
      order.status     = "out_for_delivery";
      order.assignedTo = req.user._id;
      await order.save();

      // Notify customer (non-blocking)
      if (order.user?.email) {
        sendOrderNotification(order, order.user.email, order.user.name)
          .catch(e => console.error("❌ Notification error:", e.message));
      }

      return res.json({ message: "Status updated to Out for Delivery", order });
    }

    // For "delivered" — this should not be called directly
    // Use /send-otp then /verify-otp instead
    return res.status(400).json({
      message: "To mark as delivered, use /send-otp first then /verify-otp",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// ── POST /api/delivery/orders/:id/send-otp ───────────────────
// Delivery boy requests OTP → sent to customer email
router.post("/orders/:id/send-otp", protect, deliveryOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "out_for_delivery")
      return res.status(400).json({ message: "Order must be out for delivery first" });

    if (!order.user?.email)
      return res.status(400).json({ message: "Customer email not found" });

    const otp       = genOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    order.deliveryOtp = { code: otp, expiresAt };
    await order.save();

    // Send OTP to customer
    const shortId = order._id.toString().slice(-6).toUpperCase();
    await sendDeliveryOtp(order.user.email, order.user.name, otp, shortId);

    res.json({
      message: `OTP sent to customer's email (${order.user.email})`,
      customerEmail: order.user.email,
      // In dev mode, also return OTP in response
      ...(process.env.NODE_ENV !== "production" && { otp }),
    });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ── POST /api/delivery/orders/:id/verify-otp ─────────────────
// Delivery boy enters OTP → order marked delivered
router.post("/orders/:id/verify-otp", protect, deliveryOnly, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP is required" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.deliveryOtp?.code)
      return res.status(400).json({ message: "No OTP found. Please request OTP first." });

    if (new Date() > order.deliveryOtp.expiresAt)
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    if (order.deliveryOtp.code !== otp.toString().trim())
      return res.status(400).json({ message: "Invalid OTP. Please try again." });

    // OTP correct — mark delivered
    order.status      = "delivered";
    order.assignedTo  = req.user._id;
    order.deliveryOtp = { code: null, expiresAt: null };
    await order.save();

    // Notify customer (non-blocking)
    Order.findById(order._id).populate("user", "name email")
      .then(pop => {
        if (pop?.user?.email) {
          sendOrderNotification(pop, pop.user.email, pop.user.name)
            .catch(e => console.error("❌ Notification error:", e.message));
        }
      });

    res.json({ message: "Order delivered successfully! 🎉", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

// ── GET /api/delivery/stats ───────────────────────────────────
router.get("/stats", protect, deliveryOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pending, delivering, deliveredToday, totalDelivered] = await Promise.all([
      Order.countDocuments({ status: { $in: ["confirmed", "preparing"] } }),
      Order.countDocuments({ status: "out_for_delivery" }),
      Order.countDocuments({ status: "delivered", assignedTo: req.user._id, updatedAt: { $gte: today } }),
      Order.countDocuments({ status: "delivered", assignedTo: req.user._id }),
    ]);

    res.json({ pending, delivering, deliveredToday, totalDelivered });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
