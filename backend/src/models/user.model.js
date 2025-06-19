import mongoose from "mongoose";

//This is called a mongoose document
//This a schema for the user model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        requierd: true
    },

    profilePic: {
        type: String,
        default: "",   
    } 
},

{timestamps: true} //timestamps will add createdAt and updatedAt fields automatically

)

const User = mongoose.model("User", userSchema);

export default User;