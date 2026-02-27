const express = require("express");
const router = express.Router();
const multer = require("multer");

const postc = require("../auth/post.controller");
const { authUser } = require("../middlewares/auth.middleware");
const foodcontroller = require("../auth/food.controller");
const likec=require("../auth/post.controller");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


router.post("/upload", authUser, upload.single("image"), postc.uploadPost);
router.get("/top/:category", postc.getTopPosts);
router.post("/:postId/like", authUser, likec.togglePostLike);

router.post("/post/:postId/save", authUser, postc.togglePostSave);

router.post("/post/:postId/comment", authUser, postc.addPostComment);

router.get("/post/:postId/comments", postc.getPostComments);
router.post(
  "/:contentId/like",
  authUser,
  foodcontroller.likeFood
);
module.exports = router;