const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Cart = require('../models/Cart');

// ── Coupon definitions ────────────────────────────────────────
const COUPONS = {
  HUNGRY10: { type: 'percent', value: 10 },
  FIRST50: { type: 'flat', value: 50 },
};

// ── Delivery fee logic ────────────────────────────────────────
const FREE_DELIVERY_THRESHOLD = 299;
const DELIVERY_FEE = 49;

// ── GET /api/orders/all ──────────────────────────────────────
// Admin only — must be defined before /:id to avoid route conflict
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/orders ──────────────────────────────────────────
// Get current user's orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/orders/:id ──────────────────────────────────────
// Get single order — must belong to user or be admin
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name image')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/orders ─────────────────────────────────────────
// Place a new order
const placeOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.menuItemId').notEmpty().withMessage('Each item must have a menuItemId'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Each item qty must be at least 1'),
  body('deliveryAddress.line').notEmpty().withMessage('Delivery address line is required'),
  body('deliveryAddress.city').notEmpty().withMessage('Delivery city is required'),
  body('paymentMethod').optional().isIn(['cod', 'online']).withMessage('Invalid payment method'),
];

router.post('/', protect, placeOrderValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { items, deliveryAddress, paymentMethod = 'cod', couponCode } = req.body;

    // Validate items and fetch DB prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({ message: 'One or more menu items not found' });
    }

    const unavailable = menuItems.filter((m) => !m.isAvailable);
    if (unavailable.length > 0) {
      return res.status(400).json({
        message: `The following items are unavailable: ${unavailable.map((m) => m.name).join(', ')}`,
      });
    }

    // Build order items using DB prices (never trust client)
    const menuItemMap = {};
    menuItems.forEach((m) => { menuItemMap[m._id.toString()] = m; });

    const orderItems = items.map((i) => {
      const menuItem = menuItemMap[i.menuItemId];
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        image: menuItem.image,
        price: menuItem.price,
        qty: Number(i.qty),
      };
    });

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    // Apply coupon
    let discountAmount = 0;
    const normalizedCoupon = couponCode ? couponCode.toUpperCase().trim() : '';
    if (normalizedCoupon && COUPONS[normalizedCoupon]) {
      const coupon = COUPONS[normalizedCoupon];
      if (coupon.type === 'percent') {
        discountAmount = Math.round((subtotal * coupon.value) / 100);
      } else {
        discountAmount = Math.min(coupon.value, subtotal); // don't discount more than subtotal
      }
    } else if (normalizedCoupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Delivery fee
    const deliveryFee = subtotal - discountAmount > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

    // Total
    const totalAmount = subtotal - discountAmount + deliveryFee;

    // Estimated delivery: now + 35 minutes
    const estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress: {
        line: deliveryAddress.line,
        city: deliveryAddress.city,
        pincode: deliveryAddress.pincode || '',
      },
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      couponCode: normalizedCoupon || '',
      discountAmount,
      deliveryFee,
      estimatedDelivery,
    });

    // Clear user's cart after order placed
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/orders/:id/cancel ───────────────────────────────
// User can cancel if status is pending or confirmed
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/orders/:id/status ───────────────────────────────
// Admin only — update order status
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
