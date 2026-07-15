const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, propertyId, content } = req.body;

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      propertyId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between logged in user and another user
// @route   GET /api/messages/conversation/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users the logged-in user has chatted with
// @route   GET /api/messages/conversations
// @access  Private
const getConversationsList = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all distinct users we have sent messages to or received from
    const sentMessages = await Message.distinct('receiverId', { senderId: currentUserId });
    const receivedMessages = await Message.distinct('senderId', { receiverId: currentUserId });

    const userIds = [...new Set([...sentMessages, ...receivedMessages].map(id => id.toString()))];

    const users = await User.find({ _id: { $in: userIds } }).select('name email userType phone');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getConversationsList };
