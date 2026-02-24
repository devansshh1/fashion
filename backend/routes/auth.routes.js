
const express=require('express');
const registerUser=require('../auth/auth.controller');
const router=express.Router();

router.post('/user/register',registerUser.registerUser);
router.post('/user/login',registerUser.loginUser);
router.post('/user/logout',registerUser.logoutUser);
router.post('/partner/register',registerUser.registerFoodPartner);
router.post('/partner/login',registerUser.loginFoodPartner);
router.post('/partner/logout',registerUser.logoutFoodPartner);
module.exports=router;