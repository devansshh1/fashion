const Post = require("../models/post.model");
const Like = require("../models/like.model");
const Save = require("../models/save.model");
const Comment = require("../models/comment.model");
const { uploadImage } = require("../service/storage.service");


// ================= UPLOAD =================
async function uploadPost(req, res) {
  try {
    const { name, category } = req.body;
    const ownerUserId = req.user?._id || null;
    const ownerPartnerId = req.foodPartner?._id || null;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    if (!ownerUserId && !ownerPartnerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const uploadedImage = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );

    const post = await Post.create({
      name,
      category,
      image: uploadedImage.url,
      userId: ownerUserId,
      partnerId: ownerPartnerId
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
      .populate("partnerId", "name image InstagramHandle")
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
      .populate("partnerId", "name image InstagramHandle")
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
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    if (!actorId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const existingLike = await Like.findOne({
      ...actorQuery,
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
        ...actorQuery,
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
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    if (!actorId) return res.status(401).json({ message: "Please login first" });

    const existingSave = await Save.findOne({
      ...actorQuery,
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
        ...actorQuery,
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
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorPayload = req.user ? { user: actorId } : { partner: actorId };

    if (!text) return res.status(400).json({ message: "Comment required" });
    if (!actorId) return res.status(401).json({ message: "Please login first" });

    await Comment.create({
      ...actorPayload,
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
      .populate("partner", "name")
      .sort({ createdAt: -1 });

    res.json({ comments });

  } catch (err) {
  
    res.status(500).json({ message: "Server error" });
  }
}
async function getSavedPosts(req, res) {
  try {
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    if (!actorId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const saves = await Save.find({
      ...actorQuery,
      contentType: "post"
    });

    const postIds = saves.map((s) => s.contentId).filter(Boolean);

    const posts = await Post.find({ _id: { $in: postIds } })
      .populate("userId", "name")
      .populate("partnerId", "name image InstagramHandle")
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
}

async function deletePosts(req, res) {
  try {
    const { postIds } = req.body;
    const actorId = req.user?._id || req.foodPartner?._id;
    const ownerQuery = req.user
      ? { userId: req.user._id }
      : req.foodPartner
        ? { partnerId: req.foodPartner._id }
        : null;

    if (!actorId || !ownerQuery) {
      return res.status(401).json({ message: "Please login as user or model first" });
    }

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({ message: "Select at least one post to delete." });
    }

    const normalizedPostIds = [...new Set(postIds.filter(Boolean))];

    const ownedPosts = await Post.find({
      _id: { $in: normalizedPostIds },
      ...ownerQuery,
    }).select("_id");

    if (!ownedPosts.length) {
      return res.status(404).json({ message: "No owned posts found for deletion." });
    }

    const deletedIds = ownedPosts.map((post) => post._id.toString());

    await Promise.all([
      Like.deleteMany({
        contentId: { $in: deletedIds },
        contentType: "post",
      }),
      Save.deleteMany({
        contentId: { $in: deletedIds },
        contentType: "post",
      }),
      Comment.deleteMany({
        contentId: { $in: deletedIds },
        contentType: "post",
      }),
      Post.deleteMany({
        _id: { $in: deletedIds },
        ...ownerQuery,
      }),
    ]);

    res.json({
      message: "Posts deleted successfully",
      deletedIds,
      deletedCount: deletedIds.length,
    });
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
  getSavedPosts,
  deletePosts,
};
