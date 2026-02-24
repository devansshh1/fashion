const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food',
        required:true
    },

    text:{
        type:String,
        required:true
    }

},{
    timestamps:true
});
commentSchema.index({food:1}); // fast comment fetching

module.exports = mongoose.model('Comment', commentSchema);
