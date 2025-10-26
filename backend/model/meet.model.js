import { User } from "./Authentication.js";
import mongoose from "mongoose";

const meetInfoSchema = mongoose.Schema({
    username:{
        type: String,
        ref: 'User'
    },
    title:{
        type: String,
        required: false
    },

    date:{
        type: Date,
        required: false
    },
    time:{
        type: String,
        required: false
    },
    link:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
})

const meetInfo = new mongoose.model('meeting', meetInfoSchema)
export{meetInfo};