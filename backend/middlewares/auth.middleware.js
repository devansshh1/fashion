const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const FoodPartner = require('../models/foodpartner.model');


// ✅ FOOD PARTNER AUTH
async function authFoodPartner(req, res, next){

    const token = req.cookies.partnerToken;

    console.log("PARTNER COOKIE:", token);

    if(!token){
        return res.status(401).json({message:'Unauthorized - No Token'});
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await FoodPartner.findById(decoded.id);

        if(!foodPartner){
            return res.status(401).json({message:'Unauthorized - No Partner'});
        }

        req.foodPartner = foodPartner;

        next();

    }catch(err){
        console.log("JWT ERROR:", err);
        return res.status(401).json({message:'Unauthorized - Invalid Token'});
    }
}



// ✅ USER AUTH
async function authUser(req,res,next){

    const token = req.cookies.userToken; // ⭐ DIFFERENT COOKIE

    console.log("USER COOKIE:", token);

    if(!token){
        return res.status(401).json({message:'Unauthorized - No Token'});
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({message:'Unauthorized - No User'});
        }

        req.user = user;

        next();

    }catch(err){
        console.log("JWT ERROR:", err);
        return res.status(401).json({message:'Unauthorized - Invalid Token'});
    }
}



module.exports = { authFoodPartner, authUser };
