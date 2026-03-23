const Post = require("../models/post.model");
const Like = require("../models/like.model");
const Save = require("../models/save.model");
const Comment = require("../models/comment.model");
const { uploadImage } = require("../service/storage.service");


// ================= UPLOAD =================
async function uploadPost(req, res) {
  try {
    const { name, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const uploadedImage = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );

    const post = await Post.create({
      name,
      category,
      image: uploadedImage.url,
      userId: req.user._id
    });

    res.status(201).json({ message: "Post uploaded", post });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
}


// ================= GET ALL POSTS =================
async function getAllPosts(req, res) {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (err) {
  
    res.status(500).json({ message: "Server error" });
  }
}


// ================= TOP TRENDING =================
// score = 1*likes + 2*comments + 3*saves
async function getTopTrending(req, res) {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate("userId", "name")
      .sort({ score: -1 })
      .limit(5);

    res.json({ posts });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
}


// ================= LIKE =================
async function togglePostLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const existingLike = await Like.findOne({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      post.likesCount -= 1;
    } else {
      await Like.create({
        user: userId,
        contentId: postId,
        contentType: "post"
      });
      post.likesCount += 1;
    }

    // 🔥 Update score
    post.score =
      post.likesCount * 1 +
      post.commentsCount * 2 +
      post.savesCount * 3;

    await post.save();

    res.json({
      likesCount: post.likesCount,
      score: post.score
    });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
}


// ================= SAVE =================
async function togglePostSave(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const existingSave = await Save.findOne({
      user: userId,
      contentId: postId,
      contentType: "post"
    });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (existingSave) {
      await Save.deleteOne({ _id: existingSave._id });
      post.savesCount -= 1;
    } else {
      await Save.create({
        user: userId,
        contentId: postId,
        contentType: "post"
      });
      post.savesCount += 1;
    }

    post.score =
      post.likesCount * 1 +
      post.commentsCount * 2 +
      post.savesCount * 3;

    await post.save();

    res.json({
      savesCount: post.savesCount,
      score: post.score
    });

  } catch (err) {
   
    res.status(500).json({ message: "Server error" });
  }
}


// ================= COMMENT =================
async function addPostComment(req, res) {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment required" });

    await Comment.create({
      user: req.user._id,
      contentId: postId,
      contentType: "post",
      text
    });

    const post = await Post.findById(postId);
    post.commentsCount += 1;

    post.score =
      post.likesCount * 1 +
      post.commentsCount * 2 +
      post.savesCount * 3;

    await post.save();

    res.status(201).json({ message: "Comment added" });

  } catch (err) {
        res.status(500).json({ message: "Server error" });
  }
}


// ================= GET COMMENTS =================
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
  
    res.status(500).json({ message: "Server error" });
  }
}
async function getSavedPosts(req, res) {
  try {
    const userId = req.user._id;

    const saves = await Save.find({
      user: userId,
      contentType: "post"
    });

    const postIds = saves.map((s) => s.contentId).filter(Boolean);

    const posts = await Post.find({ _id: { $in: postIds } })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  uploadPost,
  getAllPosts,
  getTopTrending,
  togglePostLike,
  togglePostSave,
  addPostComment,
  getPostComments,
  getSavedPosts
};
