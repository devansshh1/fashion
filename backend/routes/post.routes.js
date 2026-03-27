const express = require("express");
const multer = require("multer");

const postc = require("../auth/post.controller");

const path = require("path");
const { authUser, authUserOrFoodPartner } = require("../middlewares/auth.middleware");
const { uploadVideo } = require("../service/storage.service");


const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload/video", upload.single("video"), async (req, res) => {
  try {
    const uploaded = await uploadVideo(req.file.buffer, req.file.originalname);

    // Save video URL in DB
    const newVideo = await Video.create({
      video: uploaded.url,
      user: req.user._id, // or modelId if different
    });

    res.json({ success: true, video: newVideo });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Video upload failed" });
  }
});


// 🔥 NEW ROUTES
router.get("/", postc.getAllPosts); // all posts (with optional category filter)
router.get("/top", postc.getTopTrending); // overall top 5 (filterable)
router.get("/saved", authUser, postc.getSavedPosts); // NEW - get user's saved posts
// Interactions
router.post("/upload", authUserOrFoodPartner, upload.single("image"), postc.uploadPost);
router.post("/:postId/like", authUser, postc.togglePostLike);
router.post("/:postId/save", authUser, postc.togglePostSave);
router.post("/:postId/comment", authUser, postc.addPostComment);
router.get("/:postId/comments", postc.getPostComments);

module.exports = router;
