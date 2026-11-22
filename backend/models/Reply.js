const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please provide reply content'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reply', replySchema);
