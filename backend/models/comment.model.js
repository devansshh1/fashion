const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodPartner",
    default: null
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

commentSchema.pre("validate", function () {
  if (!this.user && !this.partner) {
    throw new Error("Comment must belong to a user or partner");
  }

  if (this.user && this.partner) {
    throw new Error("Comment cannot belong to both user and partner");
  }
});

commentSchema.index({contentId:1});

module.exports = mongoose.model('Comment', commentSchema);
