const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

likeSchema.index({user:1, contentId:1, contentType:1}, {unique:true}); // prevent multiple likes by same user on same content
module.exports = mongoose.model('Like', likeSchema);
