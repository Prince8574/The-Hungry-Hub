const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  code:        { type: String, required: true, uppercase: true, trim: true, unique: true },
  badge:       { type: String, default: "" },        // e.g. "30% OFF", "FREE DELIVERY", "B2G1"
  badgeLabel:  { type: String, default: "" },        // e.g. "FLASH SALE", "HOT DEAL"
  discountType:{ type: String, enum: ["percent","flat","free_delivery"], default: "percent" },
  discountValue:{ type: Number, default: 0 },
  minOrder:    { type: Number, default: 0 },
  validTill:   { type: String, default: "Limited time" }, // e.g. "Today only", "Weekends only"
  isActive:    { type: Boolean, default: true },
  bgColor:     { type: String, default: "#2a1a0a" }, // card background color
  sortOrder:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
