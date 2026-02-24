const  mongoose=require('mongoose');

const saveSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Food:{  
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food',
        required:true
    }
},{
    timestamps:true
});
saveSchema.index({User:1, Food:1}, {unique:true});

module.exports=mongoose.model('Save',saveSchema);
