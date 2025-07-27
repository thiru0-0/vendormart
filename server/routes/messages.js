const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId', 'name email').populate('receiverId', 'name email')
    .sort({ createdAt: -1 });

    // Group messages by conversation
    const conversationsMap = new Map();

    messages.forEach(message => {
      const conversationId = message.conversationId;
      
      if (!conversationsMap.has(conversationId)) {
        const otherParticipant = message.senderId._id.equals(userId) 
          ? message.receiverId 
          : message.senderId;
        
        conversationsMap.set(conversationId, {
          id: conversationId,
          participants: [message.senderId, message.receiverId],
          lastMessage: message,
          unreadCount: 0
        });
      }

      // Count unread messages
      const conversation = conversationsMap.get(conversationId);
      if (message.receiverId._id.equals(userId) && !message.isRead) {
        conversation.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get messages for a specific conversation
// @access  Private
router.get('/conversations/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of this conversation
    const conversation = await Message.findOne({
      conversationId,
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Get all messages for this conversation
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read if user is the receiver
    const unreadMessages = messages.filter(msg => 
      msg.receiverId._id.equals(userId) && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(msg => msg._id) } },
        { isRead: true }
      );
    }

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages/conversations/:conversationId
// @desc    Send a message in a conversation
// @access  Private
router.post('/conversations/:conversationId', auth, [
  body('content').trim().notEmpty().withMessage('Message content is required')
    .isLength({ max: 1000 }).withMessage('Message cannot be more than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    // Verify user is part of this conversation
    const existingMessage = await Message.findOne({
      conversationId,
      $or: [{ senderId }, { receiverId: senderId }]
    });

    if (!existingMessage) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Determine receiver ID from conversation
    const receiverId = existingMessage.senderId.equals(senderId) 
      ? existingMessage.receiverId 
      : existingMessage.senderId;

    // Create new message
    const message = new Message({
      senderId,
      receiverId,
      content,
      conversationId
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:messageId/read
// @desc    Mark a message as read
// @access  Private
router.put('/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify user is the receiver
    if (!message.receiverId.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 