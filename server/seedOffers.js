require("dotenv").config();
const mongoose = require("mongoose");
const Offer    = require("./models/Offer");

const offers = [
  {
    title:        "1st Order Free Delivery",
    description:  "Use code HUNGRY1 and get free delivery on your very first order. No minimum order value!",
    code:         "HUNGRY1",
    badge:        "FREE\nDELIVERY",
    badgeLabel:   "HOT DEAL",
    discountType: "free_delivery",
    discountValue: 0,
    minOrder:     0,
    validTill:    "Limited time",
    bgColor:      "#2a1200",
    sortOrder:    1,
    isActive:     true,
  },
  {
    title:        "Flat 30% Off on Burgers",
    description:  "Craving a juicy burger? Get 30% off on all burger combos today only. Valid till midnight!",
    code:         "BURGER30",
    badge:        "30%\nOFF",
    badgeLabel:   "FLASH SALE",
    discountType: "percent",
    discountValue: 30,
    minOrder:     199,
    validTill:    "Today only",
    bgColor:      "#1a0a2a",
    sortOrder:    2,
    isActive:     true,
  },
  {
    title:        "Buy 2 Get 1 Free Pizza",
    description:  "Order any 2 pizzas and get the third one absolutely free. Perfect for family weekends!",
    code:         "PIZZA3",
    badge:        "B2G1\nFREE",
    badgeLabel:   "WEEKEND SPECIAL",
    discountType: "percent",
    discountValue: 33,
    minOrder:     599,
    validTill:    "Weekends only",
    bgColor:      "#0a1a2a",
    sortOrder:    3,
    isActive:     true,
  },
  {
    title:        "₹50 Off on First Order",
    description:  "New to The Hungry Hub? Get flat ₹50 off on your first order above ₹299.",
    code:         "FIRST50",
    badge:        "₹50\nOFF",
    badgeLabel:   "NEW USER",
    discountType: "flat",
    discountValue: 50,
    minOrder:     299,
    validTill:    "First order only",
    bgColor:      "#0a2a1a",
    sortOrder:    4,
    isActive:     true,
  },
  {
    title:        "10% Off on Every Order",
    description:  "Enjoy 10% off on every order. No minimum order value required!",
    code:         "HUNGRY10",
    badge:        "10%\nOFF",
    badgeLabel:   "ALWAYS ON",
    discountType: "percent",
    discountValue: 10,
    minOrder:     0,
    validTill:    "Always valid",
    bgColor:      "#2a1a0a",
    sortOrder:    5,
    isActive:     true,
  },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("✅ Connected");
  const existing = await Offer.countDocuments();
  if (existing > 0 && process.argv[2] !== "--force") {
    console.log(`⚠️  ${existing} offers already exist. Use --force to reseed.`);
    process.exit(0);
  }
  await Offer.deleteMany({});
  await Offer.insertMany(offers);
  console.log(`🎉 Seeded ${offers.length} offers!`);
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
