const mongoose = require("mongoose");

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
      enum: [
        "Old Money",
        "Street Wear",
        "Traditional",
        "Aesthetic",
        "Minimal",
        "Maximal"
      ],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);