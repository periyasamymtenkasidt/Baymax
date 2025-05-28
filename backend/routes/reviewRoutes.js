const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// POST /api/reviews - create a new review (auth required)
router.post('/', auth, reviewController.createReview);

// GET /api/reviews - get all reviews (public)
router.get('/getall', reviewController.getAllReviews);

module.exports = router;
