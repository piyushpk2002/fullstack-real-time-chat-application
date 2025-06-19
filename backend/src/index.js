import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import connectDB from './lib/db.js';
import {v2 as cloudinary} from 'cloudinary'
import cors  from 'cors'
import { app, server } from './lib/socket.js'
import path from 'path'


//const cors = require('cors');

dotenv.config();

//const app = express();



const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

//Middlewares
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())


console.log('auth route loaded');
app.use('/api/auth', authRoutes);

console.log('message routes loaded');
app.use('/api/message', messageRoutes)


//This is to load the static assets from dist folder in prod. (dist folder contains minified production ready code for deployment)
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res) =>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`); 
    connectDB();
})