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


        // FETCH ALL POSTS
        const videos = await Food
            .find({ foodPartnerId: partnerId })
            .sort({ createdAt: -1 });

        // TOTAL POSTS
        const totalPosts = videos.length;

        // TOTAL LIKES
        const totalLikes = videos.reduce((sum, video) => {
            return sum + (video.likesCount || 0);
        }, 0);

        res.json({
            partner: {
                ...partner._doc,
                totalPosts,
                totalLikes
            },
            videos
        });

    }catch(err){
       
        res.status(500).json({
            message:"Server error"
        });
    }
}

async function updatePartnerProfile(req,res){

    try{

        const partnerId = req.params.id;

        if(req.foodPartner._id.toString() !== partnerId){
            return res.status(403).json({
                message:"You can only edit your own profile"
            });
        }

        const { name, InstagramHandle } = req.body;
        const updates = {};

        if(typeof name === "string"){
            const trimmedName = name.trim();

            if(trimmedName.length < 2){
                return res.status(400).json({
                    message:"Name must be at least 2 characters"
                });
            }

            updates.name = trimmedName;
        }

        if(typeof InstagramHandle === "string"){
            const cleanHandle = InstagramHandle.replace("@", "").trim();
            const instaRegex = /^[a-zA-Z0-9._]{3,30}$/;

            if(!instaRegex.test(cleanHandle)){
                return res.status(400).json({
                    message:"Invalid Instagram username"
                });
            }

            updates.InstagramHandle = cleanHandle;
        }

        if(!Object.keys(updates).length){
            return res.status(400).json({
                message:"No valid profile fields provided"
            });
        }

        const updatedPartner = await FoodPartner.findByIdAndUpdate(
            partnerId,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            message:"Profile updated successfully",
            partner: updatedPartner
        });

    }catch(err){
       
        return res.status(500).json({
            message:"Server error"
        });
    }
}

module.exports = {
    getPartnerProfile,
    updatePartnerProfile
};
