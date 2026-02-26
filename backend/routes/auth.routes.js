
const express=require('express');
const registerUser=require('../auth/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const router=express.Router();

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage()
});

router.get('/user/me', authUser, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    });
});
router.post('/user/register',registerUser.registerUser);
router.post('/user/login',registerUser.loginUser);
router.post('/user/logout',registerUser.logoutUser);
router.post(
  '/partner/register',
  upload.single('image'),   // 👈 important
  registerUser.registerFoodPartner
);
router.post('/partner/login',registerUser.loginFoodPartner);
router.post('/partner/logout',registerUser.logoutFoodPartner);
module.exports=router;