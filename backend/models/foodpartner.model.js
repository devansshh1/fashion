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
    },address:{
        type:String,
        required:true
     },totalMeals:{
        type:Number,
        required:true
    },customersServed:{
        type:Number,
        required:true
     },image:{
        type:String,
        required:true
     }

    },{
    timestamps:true
}); 
module.exports=mongoose.model('FoodPartner',foodPartnerSchema);