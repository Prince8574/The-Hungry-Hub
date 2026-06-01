const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createDeliveryBoy = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: "delivery@hungry.com" });
    if (existing) {
      console.log("Delivery boy already exists:", existing.email);
      process.exit(0);
    }

    const deliveryBoy = await User.create({
      name: "Delivery Boy",
      email: "delivery@hungry.com",
      password: "delivery123",
      role: "delivery",
      isVerified: true,
      phone: "+91 98765 43210",
    });

    console.log("✅ Delivery Boy created!");
    console.log("Email:", deliveryBoy.email);
    console.log("Password: delivery123");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createDeliveryBoy();
