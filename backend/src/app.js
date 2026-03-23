require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const partnerRoutes = require('../routes/foodpartnerroutes');
const foodRoutes = require('../routes/food.routes');
const authRoutes = require('../routes/auth.routes');
const postRoutes = require('../routes/post.routes');
const app = express();

const allowedLocalhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);

/* ✅ CORS FIRST */
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser clients and local Vite dev servers on any port.
        if (!origin || allowedLocalhostOrigin.test(origin) || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/auth',authRoutes);    
app.get('/',(req,res)=>{
    res.send('Welcome to Zomato API');
});
app.use('/api/food', foodRoutes);
app.use('/api/partner', partnerRoutes);
app.use("/api/posts", postRoutes);
module.exports=app;
