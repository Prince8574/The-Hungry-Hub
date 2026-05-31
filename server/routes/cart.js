const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// ── GET /api/cart ────────────────────────────────────────────
router.get('/', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.menuItem',
      'name image price category isAvailable'
    );

    if (!cart) {
      return res.json({ cart: { items: [] } });
    }

    res.json({ cart });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/cart ───────────────────────────────────────────
// Add item — body: { menuItemId, qty }
router.post('/', protect, async (req, res, next) => {
  try {
    const { menuItemId, qty = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: 'menuItemId is required' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ message: 'This item is currently unavailable' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ menuItem: menuItemId, qty: Number(qty), price: menuItem.price }],
      });
    } else {
      const existingIndex = cart.items.findIndex(
        (i) => i.menuItem.toString() === menuItemId
      );

      if (existingIndex > -1) {
        // Increment qty
        cart.items[existingIndex].qty += Number(qty);
      } else {
        // Add new item
        cart.items.push({ menuItem: menuItemId, qty: Number(qty), price: menuItem.price });
      }

      await cart.save();
    }

    await cart.populate('items.menuItem', 'name image price category isAvailable');

    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/cart/:itemId ────────────────────────────────────
// Update qty of a cart item (itemId = subdoc _id)
router.put('/:itemId', protect, async (req, res, next) => {
  try {
    const { qty } = req.body;

    if (qty === undefined) {
      return res.status(400).json({ message: 'qty is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (Number(qty) <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].qty = Number(qty);
    }

    await cart.save();
    await cart.populate('items.menuItem', 'name image price category isAvailable');

    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/cart/:itemId ─────────────────────────────────
// Remove a single item from cart
router.delete('/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.menuItem', 'name image price category isAvailable');

    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/cart ─────────────────────────────────────────
// Clear entire cart
router.delete('/', protect, async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
