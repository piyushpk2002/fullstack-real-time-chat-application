import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import { v2 as cloudinary } from 'cloudinary' 
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) =>{
    
    try {
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

       // console.log(filteredUsers);
        
        return res.status(200).
        json(filteredUsers);
    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"});
    }
}

export const getMessages = async (req, res) =>{

    const { id: userToChatWith } = req.params;
    const  myId  = req.user._id;
    // console.log(req.user._id);
    
    // console.log(userToChatWith)
    // console.log(myId);
    
    
    try {
        const messages = await Message.find({$or: [
            {senderId: myId, receiverId: userToChatWith}, 
            {senderId: userToChatWith, receiverId: myId}
        ]})
        //console.log(messages);
        

        res.status(200).
        json(messages);
    } catch (error) {
        console.log(error.message);
        return res.status(500).
        json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req, res) =>{
    let { text, img } = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    try {
       let imgUrl;
       
       if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            imgUrl = uploadResponse.secure_url;
       }

       const newMessage = Message({
        senderId: senderId,
        receiverId: receiverId,
        text: text,
        image: imgUrl
       })

       await newMessage.save();

       //socket io logic
       const receiverSocketId = getReceiverSocketId(receiverId);
       if(receiverSocketId){
        //console.log(receiverSocketId);
        
        io.to(receiverSocketId).emit('newMessage', newMessage)
       }

       return res.status(200).
       json(newMessage);

    } catch (error) {
        console.log(error.message);
        return res.statue(500).
        json({message: "Internal Server Error"});   
    }
}