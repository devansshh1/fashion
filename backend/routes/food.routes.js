const express=require('express');
const routes=express.Router();
const foodcontroller=require('../auth/food.controller');
const  authFoodPartner =require('../middlewares/auth.middleware');
//it is because we have middleware we after validation create a new property
//  in auth of food with "req.foodPartner=foodPartner" now this foodPartner
//  has every detail of the logged in food partner and with next we pass these details to
//"foodcontroller.addFood"  
const multer=require('multer');
const upload=multer({
    storage:multer.memoryStorage()}
);

routes.post('/add',authFoodPartner.authFoodPartner,upload.single('video'),foodcontroller.addFood); 
routes.get('/',  foodcontroller.getAllFoods);
routes.get('/saved', authFoodPartner.authUser, foodcontroller.savedFoodItems);

routes.get('/partner/:partnerId', foodcontroller.getFoodsByPartner);
routes.post('/:foodId/comment', authFoodPartner.authUser, foodcontroller.addComment);
routes.post('/:foodId/like', authFoodPartner.authUser, foodcontroller.likeFood);
routes.post('/:foodId/save', authFoodPartner.authUser, foodcontroller.saveFood);
routes.get('/:foodId/comments', foodcontroller.getComments);
routes.delete('/comment/:commentId', authFoodPartner.authUser, foodcontroller.deleteComment);
module.exports=routes;