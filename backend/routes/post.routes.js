const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const postc = require("../auth/post.controller");
const { authUser } = require("../middlewares/auth.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Upload
router.post("/upload", authUser, upload.single("image"), postc.uploadPost);

// 🔥 NEW ROUTES
router.get("/", postc.getAllPosts); // all posts (with optional category filter)
router.get("/top", postc.getTopTrending); // overall top 5 (filterable)
router.get("/saved", authUser, postc.getSavedPosts); // NEW - get user's saved posts
// Interactions
router.post("/:postId/like", authUser, postc.togglePostLike);
router.post("/:postId/save", authUser, postc.togglePostSave);
router.post("/:postId/comment", authUser, postc.addPostComment);
router.get("/:postId/comments", postc.getPostComments);

module.exports = router;