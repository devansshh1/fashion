const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

likeSchema.pre("validate", function () {
  if (!this.user && !this.partner) {
    throw new Error("Like must belong to a user or partner");
  }

  if (this.user && this.partner) {
    throw new Error("Like cannot belong to both user and partner");
  }
});

likeSchema.index(
  { user: 1, contentId: 1, contentType: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);
likeSchema.index(
  { partner: 1, contentId: 1, contentType: 1 },
  { unique: true, partialFilterExpression: { partner: { $type: "objectId" } } }
);
module.exports = mongoose.model('Like', likeSchema);
