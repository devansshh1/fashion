const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,    
       
    }},{
    timestamps:true
});
const UserModel=mongoose.model('User',userSchema);
module.exports=UserModel;