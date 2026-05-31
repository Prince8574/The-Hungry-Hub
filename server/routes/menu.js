const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Multer — memory storage, 5 MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// ── GET /api/menu ────────────────────────────────────────────
// Public - Only available items
router.get('/', async (req, res, next) => {
  try {
    const filter = { isAvailable: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: regex }, { description: regex }, { tag: regex }];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/menu/all ────────────────────────────────────────
// Admin only - All items (available + unavailable)
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: regex }, { description: regex }, { tag: regex }];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/menu/:id ────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/menu ───────────────────────────────────────────
// Admin only — create menu item with JSON data (image URL)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, description, price, discount, category, tag, isAvailable, image, stock, inStock, preparationTime, isVeg, spicyLevel } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const item = await MenuItem.create({
      name,
      description: description || '',
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      category,
      image: image || '',
      tag: tag || '',
      rating: 0, // Start with 0, customers will rate
      ratingCount: 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      stock: stock ? Number(stock) : 100,
      inStock: inStock !== undefined ? inStock : true,
      preparationTime: preparationTime ? Number(preparationTime) : 15,
      isVeg: isVeg || false,
      spicyLevel: spicyLevel ? Number(spicyLevel) : 0,
    });

    res.status(201).json({ message: 'Menu item created', item });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/menu/upload ────────────────────────────────────
// Admin only — create menu item with file upload
router.post('/upload', protect, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    const { name, description, price, category, tag, isAvailable, rating } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menu-items');
      imageUrl = result.secure_url;
    }

    const item = await MenuItem.create({
      name,
      description: description || '',
      price: Number(price),
      category,
      image: imageUrl,
      tag: tag || '',
      rating: rating ? Number(rating) : 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({ message: 'Menu item created', item });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/menu/:id ────────────────────────────────────────
// Admin only — update item with JSON data
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, description, price, discount, category, tag, isAvailable, image, stock, inStock, preparationTime, isVeg, spicyLevel } = req.body;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = Number(price);
    if (discount !== undefined) item.discount = Number(discount);
    if (category !== undefined) item.category = category;
    if (tag !== undefined) item.tag = tag;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;
    if (image !== undefined) item.image = image;
    if (stock !== undefined) item.stock = Number(stock);
    if (inStock !== undefined) item.inStock = inStock;
    if (preparationTime !== undefined) item.preparationTime = Number(preparationTime);
    if (isVeg !== undefined) item.isVeg = isVeg;
    if (spicyLevel !== undefined) item.spicyLevel = Number(spicyLevel);
    
    // Note: rating and ratingCount are NOT updated by admin, only by customers

    await item.save();

    res.json({ message: 'Menu item updated', item });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/menu/:id/upload ─────────────────────────────────
// Admin only — update item with file upload
router.put('/:id/upload', protect, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, description, price, category, tag, isAvailable, rating } = req.body;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = Number(price);
    if (category !== undefined) item.category = category;
    if (tag !== undefined) item.tag = tag;
    if (rating !== undefined) item.rating = Number(rating);
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menu-items');
      item.image = result.secure_url;
    }

    await item.save();

    res.json({ message: 'Menu item updated', item });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/menu/:id ─────────────────────────────────────
// Admin only — delete item
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/menu/bulk-delete ───────────────────────────────
// Admin only — delete multiple items
router.post('/bulk-delete', protect, adminOnly, async (req, res, next) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide item IDs to delete' });
    }

    const result = await MenuItem.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} items deleted successfully` });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/menu/:id/duplicate ─────────────────────────────
// Admin only — duplicate an item
router.post('/:id/duplicate', protect, adminOnly, async (req, res, next) => {
  try {
    const original = await MenuItem.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const duplicate = await MenuItem.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      price: original.price,
      discount: original.discount || 0,
      category: original.category,
      image: original.image,
      tag: original.tag,
      rating: 0,
      ratingCount: 0,
      isAvailable: false, // Start as unavailable
      stock: original.stock,
      inStock: original.inStock,
      preparationTime: original.preparationTime,
      isVeg: original.isVeg,
      spicyLevel: original.spicyLevel,
    });

    res.status(201).json({ message: 'Item duplicated successfully', item: duplicate });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/menu/:id/rate ──────────────────────────────────
// Protected — rate an item (1–5)
router.post('/:id/rate', protect, async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Recalculate running average
    const newCount = item.ratingCount + 1;
    const newRating = ((item.rating * item.ratingCount) + Number(rating)) / newCount;

    item.rating = Math.round(newRating * 10) / 10; // 1 decimal place
    item.ratingCount = newCount;
    await item.save();

    res.json({ message: 'Rating submitted', rating: item.rating, ratingCount: item.ratingCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
