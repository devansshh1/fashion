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

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');
const allowedLocalhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin);

    if (
      !origin ||
      allowedLocalhostOrigin.test(normalizedOrigin) ||
      allowedOrigins.has(normalizedOrigin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));



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

app.use((err, req, res, next) => {
    if (err?.message === 'Not allowed by CORS') {
        return res.status(403).json({
            message: 'CORS blocked for this origin',
            origin: req.headers.origin || null
        });
    }

    return next(err);
});

module.exports=app;
