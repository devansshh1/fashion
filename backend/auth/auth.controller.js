const userModel=require('../models/user.model');
const pass=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fp=require('../models/foodpartner.model');
const { uploadImage } = require('../service/storage.service');
const { v4: uuid } = require('uuid');
async function registerUser(req,res){
    console.log("BODY:", req.body); // ⭐ ADD THIS
    const{name,email,password}=req.body;
    
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        const hashedPassword=await pass.hash(password,10);
        const newuser=await userModel.create({
            name,
            email,
            password:hashedPassword
        });
        const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET,{ expiresIn: "7d" });
res.cookie("userToken", token,{
    httpOnly:true,
    secure:false,
    sameSite:"lax",maxAge: 7 * 24 * 60 * 60 * 1000
});



 


     res.status(201).json({message:'User registered successfully',_id:newuser._id,name:newuser.name,email:newuser.email}); 
}
async  function loginUser(req,res){
    //login logic here
    const {email,password}=req.body;
    const existingUser=await userModel.findOne({email});
    if(!existingUser){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const isPasswordValid= await  pass.compare(password,existingUser.password);
    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{ expiresIn: "7d" });
   res.cookie("userToken", token,{
    httpOnly:true,
    secure:false,
    sameSite:"lax",maxAge: 7 * 24 * 60 * 60 * 1000
});


    res.status(200).json({message:'Login successful',_id:existingUser._id,name:existingUser.name,email:existingUser.email});
}
async function logoutUser(req,res){
    res.clearCookie("userToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
    });
    res.status(200).json({message:'Logout successful'});
}
async function registerFoodPartner(req, res) {

  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILE:", req.file);

  const { name, email, password, InstagramHandle } = req.body;

if (!req.file) {
    return res.status(400).json({
      message: "Profile image is required"
    });
  }

  if (!name || name.trim().length < 2) {
  return res.status(400).json({
    message: "Name must be at least 2 characters"
  });
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Enter a valid VIT Bhopal email"
  });
}


  // password validation
  if (!password) {
    return res.status(400).json({
      message: "Password is required"
    });
  }

  // instagram validation
  if (!InstagramHandle || InstagramHandle.trim() === "") {
    return res.status(400).json({
      message: "Instagram handle is required"
    });
  }

  const instaRegex = /^[a-zA-Z0-9._]{3,30}$/;

  let cleanHandle = InstagramHandle.replace("@", "");

  if (!instaRegex.test(cleanHandle)) {
    return res.status(400).json({
      message: "Invalid Instagram username"
    });
  }

  // image validation
  
  const allowedTypes = ["image/jpeg","image/png","image/webp"];

if (!allowedTypes.includes(req.file.mimetype)) {
  return res.status(400).json({
    message: "Only JPG, PNG, WEBP images allowed"
  });
}

  // check existing partner
  const existingPartner = await fp.findOne({ email });

  if (existingPartner) {
    return res.status(400).json({
      message: "Model already exists"
    });
  }

  // upload image AFTER validation
  const uploadedImage = await uploadImage(
    req.file.buffer,
    req.file.originalname
  );

  // hash password
  const hashedPassword = await pass.hash(password, 10);

  // create partner
  const newPartner = await fp.create({
    name,
    email,
    password: hashedPassword,
    InstagramHandle: cleanHandle,
    image: uploadedImage.url
  });

  const token = jwt.sign(
    { id: newPartner._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("partnerToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: "Model registered successfully",
    _id: newPartner._id,
    name: newPartner.name,
    email: newPartner.email
  });
}
async function loginFoodPartner(req,res){
    //food partner login logic here
      const {email,password}=req.body;
    const existingPartner=await fp.findOne({email});
    if(!existingPartner){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const isPasswordValid= await  pass.compare(password,existingPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const token=jwt.sign({id:existingPartner._id},process.env.JWT_SECRET,{ expiresIn: "7d" });
   res.cookie("partnerToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",maxAge: 7 * 24 * 60 * 60 * 1000
});



    res.status(200).json({message:'Login successful',_id:existingPartner._id,name:existingPartner.name,email:existingPartner.email});
    
}
async function logoutFoodPartner(req,res){
  res.clearCookie("partnerToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });


    res.status(200).json({message:'Logout successful'});
}
module.exports={registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner};
