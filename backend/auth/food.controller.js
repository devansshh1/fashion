const mongoose=require('mongoose');
const FoodModel=require('../models/food.model');
const { uploadImage } = require('../service/storage.service');
const { v4: uuid } = require('uuid');
const SaveModel=require('../models/save.model');
const LikeModel=require('../models/like.model');
const CommentModel = require('../models/comment.model');


async function addFood(req,res){
    //add food logic here
    
    
     //logged in food partner details
     
    
     const image = await uploadImage(req.file.buffer,uuid());
console.log("IMAGEKIT RESPONSE:", image);
const item= await FoodModel.create({
      name: req.body.name,
    description: req.body.description,
    video: image.url, // ✅ MUST match schema
    foodPartnerId: req.foodPartner._id
    
})

res.status(201).json({message:'Food item added successfully',item});      
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
async function saveFood(req,res){

    try{

        const { foodId } = req.params;
        const userId = req.user._id;

        const foodExists = await FoodModel.exists({_id:foodId});

        if(!foodExists){
         return res.status(404).json({
         message:"Food not found"
        });
}


        const existingSave = await SaveModel.findOne({
            User:userId,
            Food:foodId
        });

        // UNSAVE
        if(existingSave){

            await SaveModel.deleteOne({_id:existingSave._id});

            await FoodModel.findByIdAndUpdate(
                foodId,
                {$inc:{savesCount:-1}}
            );

            return res.json({
                message:"Food removed from saved"
            });
        }

        // SAVE
        await SaveModel.create({
            User:userId,
            Food:foodId
        });

        await FoodModel.findByIdAndUpdate(
            foodId,
            {$inc:{savesCount:1}}
        );

        res.json({
            message:"Food saved"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server error"
        });
    }
}
async function likeFood(req,res){

    const { foodId } = req.params;
    const userId = req.user._id;

    const food = await FoodModel.findById(foodId);

    if(!food){
        return res.status(404).json({
            message:"Food not found"
        });
    }

    const isLiked = await LikeModel.findOne({
        User:userId,
        Food:foodId
    });

    // UNLIKE
    if(isLiked){

        await LikeModel.findByIdAndDelete(isLiked._id);

        await FoodModel.findByIdAndUpdate(
            foodId,
            { $inc:{likesCount:-1} }
        );

        return res.json({
            message:"Food unliked"
        });
    }

    // LIKE
    await LikeModel.create({
        User:userId,
        Food:foodId
    });

    await FoodModel.findByIdAndUpdate(
        foodId,
        { $inc:{likesCount:1} }
    );

    res.json({
        message:"Food liked"
    });
}
async function addComment(req,res){

    try{

        const { foodId } = req.params;
        const userId = req.user._id;
        const { text } = req.body;

        if(!text){
            return res.status(400).json({
                message:"Comment cannot be empty"
            });
        }

        const foodExists = await FoodModel.exists({_id:foodId});

        if(!foodExists){
            return res.status(404).json({
                message:"Food not found"
            });
        }

        const comment = await CommentModel.create({
            user:userId,
            food:foodId,
            text
        });

        // increment counter
        await FoodModel.findByIdAndUpdate(
            foodId,
            {$inc:{commentsCount:1}}
        );

        res.status(201).json({
            message:"Comment added",
            comment
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server error"
        });
    }
}
async function getComments(req,res){

    try{

        const { foodId } = req.params;
        const page = req.query.page || 1;
        const limit = 10;

        const comments = await CommentModel.find({
            food:foodId
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
async function savedFoodItems(req,res){

    try{
        const userId = req.user._id;

        const savedItems = await SaveModel.find({User:userId}).populate('Food');
        if(!savedItems.length){
            return res.json([]);
        }
         // ⭐ extract actual foods
        const foods = savedItems
            .map(item => item.Food)
            .filter(food => food); // prevents null crash

        res.json(foods);

    }catch(err){

        res.status(500).json({
            message:"Server error"
        });
    }
}
async function getAllFoods(req,res){

    const foods = await FoodModel.find();

    console.log("FOODS FROM DB:", foods);

    res.json({foods});
}






module.exports={addFood, getAllFoods, getFoodsByPartner, likeFood, saveFood, addComment, getComments, deleteComment, savedFoodItems,getAllFoods};