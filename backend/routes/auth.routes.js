
const express=require('express');
const registerUser=require('../auth/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const router=express.Router();



const multer = require('multer');
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