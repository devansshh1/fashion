const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  contentType: {
    type: String,
    enum: ["food", "post"],
    required: true
  },

  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  text: {                    // 🔥 ADD THIS
    type: String,
    required: true
  }

},{
  timestamps:true
});

commentSchema.index({contentId:1});

module.exports = mongoose.model('Comment', commentSchema);