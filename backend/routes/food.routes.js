const express=require('express');
const routes=express.Router();
const foodcontroller=require('../auth/food.controller');
const  authFoodPartner =require('../middlewares/auth.middleware');
const { uploadVideo } = require('../service/storage.service');
//it is because we have middleware we after validation create a new property
//  in auth of food with "req.foodPartner=foodPartner" now this foodPartner
//  has every detail of the logged in food partner and with next we pass these details to
//"foodcontroller.addFood"  
const multer=require('multer');


const path = require('path');



const upload = multer({
  storage: multer.memoryStorage(),
});

routes.post('/add',authFoodPartner.authFoodPartner,upload.single('video'),foodcontroller.addFood); 
routes.get('/',  foodcontroller.getAllFoods);
routes.get('/saved', authFoodPartner.authUserOrFoodPartner, foodcontroller.savedFoodItems);

routes.get('/partner/:partnerId', foodcontroller.getFoodsByPartner);
routes.post('/:foodId/comment', authFoodPartner.authUserOrFoodPartner, foodcontroller.addComment);
routes.post(
  "/:contentId",
  authFoodPartner.authUserOrFoodPartner,
  foodcontroller.likeFood
);
routes.post('/:foodId/save', authFoodPartner.authUserOrFoodPartner, foodcontroller.saveFood);
routes.get('/:foodId/comments', foodcontroller.getComments);
routes.delete('/comment/:commentId', authFoodPartner.authUserOrFoodPartner, foodcontroller.deleteComment);
routes.get("/top-partners", foodcontroller.getTopPartners);
routes.get("/top-reels", foodcontroller.getTopReels);
module.exports=routes;
