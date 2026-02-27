const Post = require("../models/post.model");
const { uploadImage } = require("../service/storage.service");
const { v4: uuid } = require("uuid");
const Like = require("../models/like.model");
const Save = require("../models/save.model");
const Comment = require("../models/comment.model");
async function uploadPost(req, res) {
  try {
    const { name, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const uploaded = await uploadImage(req.file.buffer,  req.file.originalname);
console.log("UPLOAD RESPONSE:", uploaded);
    const post = await Post.create({
      name,
      category,
      image: uploaded.url,
      userId: req.user._id
    });

    res.status(201).json({ message: "Post uploaded", post });

  } catch (err) {
    console.error("UPLOAD POST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function getTopPosts(req, res) {
  try {
    const { category } = req.params;

    const posts = await Post.find({ category })
      .sort({ likesCount: -1 })
      .limit(5)
      .populate("userId", "name");

    res.json({ posts });

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function togglePostLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    console.log("USER:", req.user);
console.log("POST ID:", req.params.postId);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    // 🔴 UNLIKE
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      const updated = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

      return res.json({
        liked: false,
        likesCount: updated.likesCount
      });
    }

    // 🟢 LIKE
    await Like.create({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    res.json({
      liked: true,
      likesCount: updated.likesCount
    });

  } catch (err) {
    console.error("POST LIKE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function togglePostSave(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const existingSave = await Save.findOne({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    // 🔴 UNSAVE
    if (existingSave) {
      await Save.deleteOne({ _id: existingSave._id });

      const updated = await Post.findByIdAndUpdate(
        postId,
        { $inc: { savesCount: -1 } },
        { new: true }
      );

      return res.json({
        saved: false,
        savesCount: updated.savesCount
      });
    }

    // 🟢 SAVE
    await Save.create({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $inc: { savesCount: 1 } },
      { new: true }
    );

    res.json({
      saved: true,
      savesCount: updated.savesCount
    });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function addPostComment(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    const comment = await Comment.create({
      user: userId,
      contentId: postId,
      contentType: "post",
      text
    });

    await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } }
    );

    res.status(201).json({ comment });

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function getPostComments(req, res) {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      contentId: postId,
      contentType: "post"
    })
    .populate("user", "name")
    .sort({ createdAt: -1 });

    res.json({ comments });

  } catch (err) {
    console.error("GET COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

 module.exports = {
    uploadPost,
    getTopPosts,
    togglePostLike,
    togglePostSave,
    addPostComment,
    getPostComments
};
