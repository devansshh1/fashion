const express=require('express');
const routes=express.Router();
const foodcontroller=require('../auth/food.controller');
const  authFoodPartner =require('../middlewares/auth.middleware');
//it is because we have middleware we after validation create a new property
//  in auth of food with "req.foodPartner=foodPartner" now this foodPartner
//  has every detail of the logged in food partner and with next we pass these details to
//"foodcontroller.addFood"  
const multer=require('multer');


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

routes.post('/add',authFoodPartner.authFoodPartner,upload.single('video'),foodcontroller.addFood); 
routes.get('/',  foodcontroller.getAllFoods);
routes.get('/saved', authFoodPartner.authUser, foodcontroller.savedFoodItems);

routes.get('/partner/:partnerId', foodcontroller.getFoodsByPartner);
routes.post('/:foodId/comment', authFoodPartner.authUser, foodcontroller.addComment);
routes.post(
  "/:contentId",
  authFoodPartner.authUser,
  foodcontroller.likeFood
);
routes.post('/:foodId/save', authFoodPartner.authUser, foodcontroller.saveFood);
routes.get('/:foodId/comments', foodcontroller.getComments);
routes.delete('/comment/:commentId', authFoodPartner.authUser, foodcontroller.deleteComment);
routes.get("/top-partners", foodcontroller.getTopPartners);
routes.get("/top-reels", foodcontroller.getTopReels);
module.exports=routes;