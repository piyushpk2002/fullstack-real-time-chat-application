import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) =>{
    //console.log(req.cookies);
    const token = req.cookies.jwt;
    

    if(!token){
        return res.status(400).
        json({message: "Unauthorized, No Tokens Provided"});
    }

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).
            json({message: "Unauthorized Access"});
        }

        //console.log(decoded);
        
        const user = await User.findById(decoded.id).select("-password");

        req.user = user;

        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"});     
    }
}