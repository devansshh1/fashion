const mongoose=require('mongoose');

const foodPartnerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true,
        unique:true
    },password:{
        type:String,
        required:true
    },image:{
        type:String,
        required:true
     },InstagramHandle:{
        type:String,
        required:true
     }

    },{
    timestamps:true
}); 
module.exports=mongoose.model('FoodPartner',foodPartnerSchema);