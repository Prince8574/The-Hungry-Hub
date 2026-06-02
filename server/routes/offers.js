const express = require("express");
const router  = express.Router();
const Offer   = require("../models/Offer");
const { protect, adminOnly } = require("../middleware/auth");

// ── GET /api/offers — public, for client ─────────────────────
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

// ── GET /api/offers/all — admin, all offers ───────────────────
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

// ── POST /api/offers — create ─────────────────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ message: "Offer created", offer });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Coupon code already exists" });
    res.status(500).json({ message: "Failed to create offer" });
  }
});

// ── PUT /api/offers/:id — update ──────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "Offer updated", offer });
  } catch (err) {
    res.status(500).json({ message: "Failed to update offer" });
  }
});

// ── DELETE /api/offers/:id — delete ──────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete offer" });
  }
});

module.exports = router;
