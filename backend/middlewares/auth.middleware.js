const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const FoodPartner = require('../models/foodpartner.model');


// ✅ FOOD PARTNER AUTH
async function authFoodPartner(req, res, next){

    const token = req.cookies.partnerToken;

    

    if(!token){
        return res.status(401).json({message:'Please register as model first'});
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await FoodPartner.findById(decoded.id);

        if(!foodPartner){
            return res.status(401).json({message:'Please register as model first'});
        }

        req.foodPartner = foodPartner;

        next();

    }catch(err){
      
        return res.status(401).json({message:'Please register as model first'});
    }
}



// ✅ USER AUTH
async function authUser(req,res,next){

    const token = req.cookies.userToken; // ⭐ DIFFERENT COOKIE

    if(!token){
        return res.status(401).json({message:'Please register first'});
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({message:'Please register first'});
        }

        req.user = user;

        next();

    }catch(err){
      
        return res.status(401).json({message:'Please register first'});
    }
}



module.exports = { authFoodPartner, authUser };
