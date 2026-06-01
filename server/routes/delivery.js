const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const Order   = require("../models/Order");
const { protect } = require("../middleware/auth");

// ── Middleware: delivery only ─────────────────────────────────
const deliveryOnly = (req, res, next) => {
  if (req.user.role !== "delivery" && req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Delivery access only" });
  }
  next();
};

// ── POST /api/delivery/login ──────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email, role: "delivery" }).select("+password");
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
// Orders that are out_for_delivery or confirmed/preparing
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
// Orders assigned to this delivery boy
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
// Delivery boy can only set: out_for_delivery, delivered
router.put("/orders/:id/status", protect, deliveryOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["out_for_delivery", "delivered"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status. Allowed: out_for_delivery, delivered" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "out_for_delivery") order.assignedTo = req.user._id;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
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
