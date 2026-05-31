const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Address = require('../models/Address');
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

// ── GET /api/user/me ─────────────────────────────────────────
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/user/me ─────────────────────────────────────────
router.put('/me', protect, async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/user/avatar ────────────────────────────────────
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'avatars');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({ message: 'Avatar updated', user });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/user/addresses ──────────────────────────────────
router.get('/addresses', protect, async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/user/addresses ─────────────────────────────────
router.post('/addresses', protect, async (req, res, next) => {
  try {
    const { type, line, city, pincode, isDefault } = req.body;

    if (!line || !city) {
      return res.status(400).json({ message: 'Address line and city are required' });
    }

    // If this address is default, unset all others first
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      type: type || 'home',
      line,
      city,
      pincode: pincode || '',
      isDefault: isDefault || false,
    });

    res.status(201).json({ message: 'Address added', address });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/user/addresses/:id ──────────────────────────────
router.put('/addresses/:id', protect, async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const { type, line, city, pincode, isDefault } = req.body;

    // If setting as default, unset all others first
    if (isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: address._id } }, { isDefault: false });
    }

    if (type !== undefined) address.type = type;
    if (line !== undefined) address.line = line;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.json({ message: 'Address updated', address });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/user/addresses/:id ──────────────────────────
router.delete('/addresses/:id', protect, async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
