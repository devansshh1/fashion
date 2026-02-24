const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Food:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Food',
        required:true
    }
},{
    timestamps:true
});
likeSchema.index({User:1, Food:1}, {unique:true}); // prevent multiple likes by same user on same food
module.exports = mongoose.model('Like', likeSchema);
