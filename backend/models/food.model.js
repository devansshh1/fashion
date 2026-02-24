const mongoose=require('mongoose');
const foodSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
     },
     /* */ 
     foodPartnerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodPartner',
         required:true
        
     },likesCount:{
        type:Number,
        default:0
     },
     savesCount:{
        type:Number,
        default:0
     },commentsCount:{
        type:Number,
        default:0
     }
},{
    timestamps:true
});
module.exports=mongoose.model('Food',foodSchema);
    