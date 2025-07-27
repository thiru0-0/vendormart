const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create conversation ID from sender and receiver IDs (sorted)
messageSchema.pre('save', function(next) {
  if (!this.conversationId) {
    const participants = [this.senderId.toString(), this.receiverId.toString()].sort();
    this.conversationId = participants.join('_');
  }
  next();
});

// Index for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema); 