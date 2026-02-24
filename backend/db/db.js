const mong=require('mongoose');

function connectDB(){
mong.connect(process.env.URI_KEY).then(()=>{
    console.log('DB connected');
}).catch((err)=>{
    console.log('DB connection failed',err);
});
}

module.exports=connectDB;