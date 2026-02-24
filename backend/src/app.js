require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const partnerRoutes = require('../routes/foodpartnerroutes');
const foodRoutes = require('../routes/food.routes');
const authRoutes = require('../routes/auth.routes');

const app = express();

/* ✅ CORS FIRST */
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);    
app.get('/',(req,res)=>{
    res.send('Welcome to Zomato API');
});
app.use('/api/food', foodRoutes);
app.use('/api/partner', partnerRoutes);
module.exports=app;