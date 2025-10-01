import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Username:{
        type: String,
        required: false
    },
    Email:{
        type: String,
        required: false
    },
    Password:{
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false 
    },
    otpExpires: {
        type: Date,
        required: false
    }
})

const User = new mongoose.model("Users", UserSchema);
export{User}