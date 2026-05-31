const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const MenuItem = require('../models/MenuItem');

// ── GET /api/wishlist ────────────────────────────────────────
router.get('/', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'items.menuItem',
      'name image price category rating isAvailable'
    );

    if (!wishlist) {
      return res.json({ wishlist: { items: [] } });
    }

    res.json({ wishlist });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/wishlist/check/:menuItemId ──────────────────────
// Returns { inWishlist: true/false }
// NOTE: This route must be defined BEFORE /:menuItemId (DELETE) to avoid conflicts
router.get('/check/:menuItemId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    const inWishlist = wishlist.items.some(
      (i) => i.menuItem.toString() === req.params.menuItemId
    );

    res.json({ inWishlist });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/wishlist ───────────────────────────────────────
// Add item — body: { menuItemId }. Ignore if already exists.
router.post('/', protect, async (req, res, next) => {
  try {
    const { menuItemId } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: 'menuItemId is required' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [{ menuItem: menuItemId }],
      });
    } else {
      const alreadyExists = wishlist.items.some(
        (i) => i.menuItem.toString() === menuItemId
      );

      if (!alreadyExists) {
        wishlist.items.push({ menuItem: menuItemId });
        await wishlist.save();
      }
    }

    await wishlist.populate('items.menuItem', 'name image price category rating isAvailable');

    res.json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/wishlist/:menuItemId ─────────────────────────
// Remove item by menuItem ID
router.delete('/:menuItemId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const itemIndex = wishlist.items.findIndex(
      (i) => i.menuItem.toString() === req.params.menuItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in wishlist' });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
    await wishlist.populate('items.menuItem', 'name image price category rating isAvailable');

    res.json({ message: 'Removed from wishlist', wishlist });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
