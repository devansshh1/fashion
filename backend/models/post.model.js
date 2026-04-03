const mongoose = require("mongoose");
const POST_CATEGORIES = require("../constants/postCategories");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: POST_CATEGORIES,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPartner",
      default: null
    },
    likesCount: {
      type: Number,
      default: 0
    },
    savesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },  // 🔥 NEW FIELD
    score: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
postSchema.index({ score: -1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model("Post", postSchema);
