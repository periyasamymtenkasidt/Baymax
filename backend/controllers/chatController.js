const Chat = require('../models/Chat');

exports.createChatSection = async (req, res) => {
  const { title } = req.body;
  let chat = await Chat.findOne({ user: req.user._id });

  const newSection = { title, messages: [] };

  if (!chat) {
    chat = new Chat({ user: req.user._id, sections: [newSection] });
  } else {
    chat.sections.push(newSection);
  }

  await chat.save();
  res.status(201).json(chat.sections[chat.sections.length - 1]);
};

exports.addMessage = async (req, res) => {
  const { sectionIndex, sender, text } = req.body;
  const chat = await Chat.findOne({ user: req.user._id });

  if (!chat || !chat.sections[sectionIndex]) {
    return res.status(404).json({ error: 'Chat section not found' });
  }

  chat.sections[sectionIndex].messages.push({ sender, text });
  await chat.save();
  res.json({ message: 'Message added' });
};

exports.getChatHistory = async (req, res) => {
  const chat = await Chat.findOne({ user: req.user._id });
  res.json(chat?.sections || []);
};

exports.deleteChatSection = async (req, res) => {
  const { sectionIndex } = req.params;

  try {
    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat || !chat.sections[sectionIndex]) {
      return res.status(404).json({ error: 'Chat section not found' });
    }

    chat.sections.splice(sectionIndex, 1); // Remove the section
    await chat.save();

    res.json({ message: 'Chat section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
