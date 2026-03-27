const mongoose=require('mongoose');
const FoodModel=require('../models/food.model');
const { uploadImage } = require('../service/storage.service');
const { v4: uuid } = require('uuid');
const SaveModel=require('../models/save.model');
const LikeModel=require('../models/like.model');
const CommentModel = require('../models/comment.model');
const { uploadVideo } = require("../service/storage.service");

async function addFood(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    // 🔥 Upload to ImageKit instead of local storage
    const uploaded = await uploadVideo(
      req.file.buffer,
      req.file.originalname
    );

    const item = await FoodModel.create({
      title: req.body.title,
      video: uploaded.url, // ✅ IMAGEKIT URL
      foodPartnerId: req.foodPartner._id,
      likesCount: 0,
      savesCount: 0,
      commentsCount: 0
    });

    res.status(201).json({
      message: "Food item added successfully",
      item
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllFoods(req,res){
    const foods=await FoodModel.find().populate('foodPartnerId','name');
    res.status(200).json({foods});
}
async function getFoodsByPartner(req,res){

    try{

        const foods = await FoodModel.find({
            foodPartnerId: req.params.partnerId
        })
        .sort({createdAt:-1})
        .limit(12);

        res.status(200).json(foods);

    }catch(err){
        res.status(500).json({
            message:"Server error"
        });
    }
}
async function saveFood(req, res) {
  try {
    const { foodId } = req.params;
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    if (!actorId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const existing = await SaveModel.findOne({
      ...actorQuery,
      contentId: foodId,
      contentType: "food"
    });

    if (existing) {
      await SaveModel.deleteOne({ _id: existing._id });

      const updated = await FoodModel.findByIdAndUpdate(
        foodId,
        { $inc: { savesCount: -1 } },
        { new: true }
      );

      return res.json({
        saved: false,
        savesCount: updated.savesCount
      });
    }

    await SaveModel.create({
      ...actorQuery,
      contentId: foodId,
      contentType: "food"
    });

    const updated = await FoodModel.findByIdAndUpdate(
      foodId,
      { $inc: { savesCount: 1 } },
      { new: true }
    );

    res.json({
      saved: true,
      savesCount: updated.savesCount
    });

  } catch (err) {
    console.error("saveFood error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function likeFood(req, res) {
  try {

    const { contentId } = req.params;
    const { contentType } = req.body; // "food" or "post"
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    let Model;

    if (contentType === "food") {
      Model = require("../models/food.model");
    } else if (contentType === "post") {
      Model = require("../models/post.model");
    } else {
      return res.status(400).json({ message: "Invalid content type" });
    }

    const item = await Model.findById(contentId);

    if (!item) {
      return res.status(404).json({ message: "Content not found" });
    }

    const existingLike = await LikeModel.findOne({
      ...actorQuery,
      contentType,
      contentId
    });

    // UNLIKE
    if (existingLike) {

      await LikeModel.findByIdAndDelete(existingLike._id);

      await item.updateOne({
        $inc: { likesCount: -1 }
      });

      return res.json({ liked: false });
    }

    // LIKE
    await LikeModel.create({
      ...actorQuery,
      contentType,
      contentId
    });

    await item.updateOne({
      $inc: { likesCount: 1 }
    });

    res.json({ liked: true });

  } catch (err) {
        res.status(500).json({ message: "Server error" });
  }
    
}

async function addComment(req, res) {
  try {
    const { foodId } = req.params;
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorPayload = req.user ? { user: actorId } : { partner: actorId };
    const { text } = req.body;

    if (!actorId) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    await CommentModel.create({
      ...actorPayload,
      contentType: "food",
      contentId: foodId,
      text
    });

    const updated = await FoodModel.findByIdAndUpdate(
      foodId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    res.status(201).json({
      message: "Comment added",
      commentsCount: updated.commentsCount
    });

  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({
      message: err.message || "Server error"
    });
  }
}

async function getComments(req,res){

    try{

        const { foodId } = req.params;
        const page = req.query.page || 1;
        const limit = 10;

        const comments = await CommentModel.find({
            contentType: "food",
contentId: foodId
        })
        .populate('user','name')
        .populate('partner','name')
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit);

        res.json(comments);

    }catch(err){

        res.status(500).json({
            message:"Server error"
        });
    }
}
async function deleteComment(req,res){

    try{

        const { commentId } = req.params;
        const comment = await CommentModel.findById(commentId);
        const actorId = req.user?._id || req.foodPartner?._id;

        if(!comment){
            return res.status(404).json({
                message:"Comment not found"
            });
        }

        const isOwner = comment.user
            ? comment.user.toString() === actorId.toString()
            : comment.partner && comment.partner.toString() === actorId.toString();

        // Only owner can delete
        if(!isOwner){
            return res.status(403).json({
                message:"Unauthorized"
            });
        }

        await CommentModel.deleteOne({_id:commentId});

        await FoodModel.findByIdAndUpdate(
            comment.contentId,
            {$inc:{commentsCount:-1}}
        );

        res.json({
            message:"Comment deleted"
        });

    }catch(err){

        res.status(500).json({
            message:"Server error"
        });
    }
}
async function savedFoodItems(req, res) {
  try {
    const actorId = req.user?._id || req.foodPartner?._id;
    const actorQuery = req.user ? { user: actorId } : { partner: actorId };

    const savedItems = await SaveModel.find({
      ...actorQuery,
      contentType: "food"
    });

    const ids = savedItems.map(item => item.contentId);

    const foods = await FoodModel.find({
      _id: { $in: ids }
    });

    res.json(foods);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllFoods(req,res){

    const foods = await FoodModel.find();

    res.json({foods});
}

async function getTopPartners(req, res) {
  try {
    const topPartners = await FoodModel.aggregate([
      {
        $group: {
          _id: "$foodPartnerId",
          totalLikes: { $sum: "$likesCount" }  // ✅ correct field
        }
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "foodpartners",   // ✅ MUST be plural + lowercase
          localField: "_id",
          foreignField: "_id",
          as: "partnerDetails"
        }
      },
{
  $unwind: "$partnerDetails"
}
      
    ]);
    

    res.json({ partners: topPartners });

  } catch (err) {

    res.status(500).json({ message: "Server error" });
  }
}
// ⭐ Get Top 5 Most Liked Reels
async function getTopReels(req, res) {
  try {
    const topReels = await FoodModel.find()
      .sort({ likesCount: -1 })
      .limit(5)
      .populate("foodPartnerId", "name image");

    res.json({ reels: topReels });

  } catch (err) {

    res.status(500).json({ message: "Server error" });
  }
}


module.exports={addFood, getAllFoods, getFoodsByPartner, likeFood, saveFood, addComment, getComments, deleteComment, savedFoodItems,getAllFoods, getTopPartners, getTopReels    };
