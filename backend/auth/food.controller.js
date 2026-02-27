const mongoose=require('mongoose');
const FoodModel=require('../models/food.model');
const { uploadImage } = require('../service/storage.service');
const { v4: uuid } = require('uuid');
const SaveModel=require('../models/save.model');
const LikeModel=require('../models/like.model');
const CommentModel = require('../models/comment.model');


async function addFood(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    const item = await FoodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: `/uploads/${req.file.filename}`, // LOCAL PATH
      foodPartnerId: req.foodPartner._id,
      likesCount: 0,
      savesCount: 0,
      commentsCount: 0
    });

    res.status(201).json({
      message: 'Food item added successfully',
      item
    });

  } catch (err) {
    console.error(err);
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
    const userId = req.user._id;

    const existing = await SaveModel.findOne({
      user: userId,
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
      user: userId,
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
    console.log("SAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function likeFood(req, res) {
  try {

    const { contentId } = req.params;
    const { contentType } = req.body; // "food" or "post"
    const userId = req.user._id;

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
      user: userId,
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
      user: userId,
      contentType,
      contentId
    });

    await item.updateOne({
      $inc: { likesCount: 1 }
    });

    res.json({ liked: true });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
    
}

async function addComment(req, res) {
  try {
    const { foodId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

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
      user: userId,
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
    console.log(err);
    res.status(500).json({
      message: "Server error"
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
        const userId = req.user._id;

        const comment = await CommentModel.findById(commentId);

        if(!comment){
            return res.status(404).json({
                message:"Comment not found"
            });
        }

        // Only owner can delete
        if(comment.user.toString() !== userId.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            });
        }

        await CommentModel.deleteOne({_id:commentId});

        await FoodModel.findByIdAndUpdate(
            comment.food,
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
    const userId = req.user._id;

    const savedItems = await SaveModel.find({
      user: userId,
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

    console.log("FOODS FROM DB:", foods);

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
    console.log(topPartners);

    res.json({ partners: topPartners });

  } catch (err) {
    console.error("TOP PARTNERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
// ⭐ Get Top 3 Most Liked Reels
async function getTopReels(req, res) {
  try {
    const topReels = await FoodModel.find()
      .sort({ likesCount: -1 })
      .limit(3)
      .populate("foodPartnerId", "name image");

    res.json({ reels: topReels });

  } catch (err) {
    console.error("TOP REELS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports={addFood, getAllFoods, getFoodsByPartner, likeFood, saveFood, addComment, getComments, deleteComment, savedFoodItems,getAllFoods, getTopPartners, getTopReels    };