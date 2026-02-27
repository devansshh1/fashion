
const Food = require('../models/food.model');
const FoodPartner = require('../models/foodpartner.model');

async function getPartnerProfile(req,res){

    try{

        const partnerId = req.params.id;

        const partner = await FoodPartner
            .findById(partnerId)
            .select("-password");

        if(!partner){
            return res.status(404).json({
                message:"Partner not found"
            });
        }
        
console.log("Requested Partner:", partnerId);
        // FETCH VIDEOS
        const videos = await Food
            .find({ foodPartnerId: partnerId })
            .sort({ createdAt: -1 })
            .limit(12);

        res.json({
            partner,
            videos
        });

        console.log("Videos Found:", videos.length);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message:"Server error"
        });
    }
}

module.exports = {
    getPartnerProfile
};
