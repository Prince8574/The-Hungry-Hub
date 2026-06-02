const express  = require("express");
const router   = express.Router();
const Order    = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const User     = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");

const getTimeAgo = (date) => {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
};

// GET /api/dashboard
router.get("/", protect, restrictTo("super_admin", "admin"), async (req, res) => {
  try {
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

    const [
      totalOrders, pendingOrders, totalUsers,
      totalMenuItems, todayOrders,
      recentOrders, allOrders, topItems,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["pending","confirmed","preparing","out_for_delivery"] } }),
      User.countDocuments({ role: "user" }),
      MenuItem.countDocuments({ isAvailable: true }),
      Order.countDocuments({ createdAt: { $gte: today, $lte: todayEnd } }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
      Order.find().select("totalAmount status createdAt"),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: {
            _id:         "$items.name",
            totalOrders: { $sum: "$items.qty" },
            revenue:     { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        }},
        { $sort: { totalOrders: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const totalRevenue = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const todayRevenue = allOrders
      .filter(o => new Date(o.createdAt) >= today && new Date(o.createdAt) <= todayEnd)
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
        name:    i._id,
        orders:  i.totalOrders,
        revenue: i.revenue,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
