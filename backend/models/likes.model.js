import React from 'react';
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
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

module.exports=mongoose.model('Like',likeSchema);
 