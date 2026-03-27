const mong=require('mongoose');
const SaveModel = require('../models/save.model');
const LikeModel = require('../models/like.model');
const CommentModel = require('../models/comment.model');

function connectDB(){
mong.connect(process.env.URI_KEY).then(async ()=>{
    console.log('DB connected');

    try {
        await SaveModel.syncIndexes();
        await LikeModel.syncIndexes();
        await CommentModel.syncIndexes();
        console.log('DB indexes synced');
    } catch (indexErr) {
        console.log('DB index sync failed', indexErr);
    }
}).catch((err)=>{
    console.log('DB connection failed',err);
});
}

module.exports=connectDB;
