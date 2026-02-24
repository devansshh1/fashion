require('dotenv').config();
const pp=require('./src/app');
const connectDB=require('./db/db');
connectDB();
pp.listen(3000,()=>{
    console.log('server is running on port 3000');
})
