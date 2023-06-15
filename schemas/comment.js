const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  syncTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
