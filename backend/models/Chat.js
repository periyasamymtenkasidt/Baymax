const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const chatSectionSchema = new mongoose.Schema({
  title: String,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [chatSectionSchema]
});

module.exports = mongoose.model('Chat', chatSchema);
