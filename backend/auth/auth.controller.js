const userModel=require('../models/user.model');
const pass=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fp=require('../models/foodpartner.model');

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
        const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET);
res.cookie("userToken", token,{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
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
    const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET);
   res.cookie("userToken", token,{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
});


    res.status(200).json({message:'Login successful',_id:existingUser._id,name:existingUser.name,email:existingUser.email});
}
async function logoutUser(req,res){
    res.clearCookie("userToken", {
    httpOnly: true,
    sameSite: "lax",   // ⭐ REQUIRED for cross-origin
    secure: false       // true ONLY if using HTTPS
});
    res.status(200).json({message:'Logout successful'});
}
async function registerFoodPartner(req,res){
    //food partner registration logic here
    const {
    name,
    email,
    password,
    address,
    totalMeals,
    customersServed
} = req.body;

    const existingPartner=await fp.findOne({email});
    if(existingPartner){
        return res.status(400).json({message:'Food Partner already exists'});
    }
    const hashedPassword=await pass.hash(password,10);
    const newPartner=await fp.create({
        name,
        email,
        password:hashedPassword,
        address,
        totalMeals,
        customersServed
    });
    const token=jwt.sign({id:newPartner._id},process.env.JWT_SECRET);
  res.cookie("partnerToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
});



    res.status(201).json({message:'Food Partner registered successfully',_id:newPartner._id,name:newPartner.name,email:newPartner.email});
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
    const token=jwt.sign({id:existingPartner._id},process.env.JWT_SECRET);
   res.cookie("partnerToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
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