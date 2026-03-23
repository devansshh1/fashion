require('dotenv').config();
const pp=require('./src/app');
const connectDB=require('./db/db');
const port = Number(process.env.PORT) || 3000;
connectDB();
pp.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
