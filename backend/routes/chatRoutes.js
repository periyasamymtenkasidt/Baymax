const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
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

router.post('/section', auth, chatController.createChatSection);
router.post('/message', auth, chatController.addMessage);
router.get('/history', auth, chatController.getChatHistory);
router.delete('/section/:sectionIndex', auth, chatController.deleteChatSection);

module.exports = router;
