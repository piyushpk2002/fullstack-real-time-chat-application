import bcrypt from 'bcrypt';
import {generateTokens} from '../lib/utils.js';
import User from '../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary'

export const signup = async (req, res) => {
    
    
    const {password, fullName, profilePic, email} = await req.body;

    if(!password || !fullName || !email)
    {
        return res.status(400).
        json({message: "Provide all necesssay fields"});
    }
    if(password.length < 6){
        return res.status(400).json({message:"Password must be atleas of 6 characters"});
    }
    try {
        
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        
        //encrypt the password

        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       const newUser =  await User.create({
            email,
            password: hashedPassword,
            profilePic,
            fullName
        })

        if(newUser){
            //generate Tokens
            generateTokens(newUser._id, res);
            await newUser.save();

            res.status(200).
            json({
                _id: newUser._id,
                email: newUser.email,
                profilePic: newUser.profilePic,
                fullName: newUser.fullName   
            })

        }else{    
            return res.status(400).
            json({message:"Invalid user data"});
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"});
        
    }
}

export const login = async (req, res)=>{

    //console.log(req.body);
    
    const {email, password} = await req.body;

    if(!email || !password){
        return res.status(400).
        json({message: "Provide all necesssay fields"});
    }
    //console.log("here");
    

   try {

     const user = await User.findOne({email});
     //console.log(user);
     if(!user){
        return res.status(404).
        json({message: "User not found"});
     }
     const isPasswordCorrect = await bcrypt.compare(password, user.password);
 
     if(isPasswordCorrect){
         
 
         generateTokens(user._id, res);
         return res.status(200).
         json({
            _id: user._id,
            email: user.email,
            profilePic: user.profilePic,
            fullName: user.fullName
         })
     }else{
         return res.status(400).
         json({message: "Invalid user Credentials"});
     }
   } catch (error) {
        return res.status(500).
         json({message: "Internal Server error"});
   }
}

export const logout = async (req, res) =>{

    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })

        return res.status(200).
        json({message: "Logged out successfully"});          
    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) =>{

    const {profilePic, password} = req.body;

    try {

        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).
            json({message: "User not found"})
        }

        if(password){
            const salt = bcrypt.genSalt(10);
            const hashedPassword =  bcrypt.hash(password, salt)

            user.password = hashedPassword;
        }

        if(profilePic){
            if(user.profilePic){
               
                // Extracting public id from the url, its the last one except jpg
                https://res.cloudinary.com/dpm1cedeq/image/upload/v1749065495/rusnnzftweq46rkjd1vb.jpg
                cloudinary.uploader.destroy(user.profilePic.split('/')[7].split('.')[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePic)
            //console.log(uploadResponse);
            user.profilePic = uploadResponse.secure_url ||user.profilePic;
        }
        


       
        await user.save();
        //console.log("here");
        
        return res.status(200).
        json(user);

    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"});  
    }
}

export const checkAuth = (req, res) =>{
    try {
        return res.status(200).
        json(req.user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Eroor"});
    }
}