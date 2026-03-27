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

async function authUserOrFoodPartner(req, res, next) {
    const userToken = req.cookies.userToken;
    const partnerToken = req.cookies.partnerToken;

    if (!userToken && !partnerToken) {
        return res.status(401).json({ message: "Please login as user or model first" });
    }

    if (userToken) {
        try {
            const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                req.user = user;
                req.authRole = "user";
                return next();
            }
        } catch (err) {
        }
    }

    if (partnerToken) {
        try {
            const decoded = jwt.verify(partnerToken, process.env.JWT_SECRET);
            const foodPartner = await FoodPartner.findById(decoded.id);

            if (foodPartner) {
                req.foodPartner = foodPartner;
                req.authRole = "partner";
                return next();
            }
        } catch (err) {
        }
    }

    return res.status(401).json({ message: "Please login as user or model first" });
}
module.exports = { authFoodPartner, authUser, authUserOrFoodPartner };
