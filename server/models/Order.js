const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      line: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'preparing',
          'out_for_delivery',
          'delivered',
          'cancelled',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: { values: ['cod', 'online'], message: '{VALUE} is not a valid payment method' },
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: { values: ['pending', 'paid', 'failed'], message: '{VALUE} is not a valid payment status' },
      default: 'pending',
    },
    couponCode: {
      type: String,
      default: '',
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
