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
        get: (date) => {
          return date ? date.toISOString().substring(0,10) : date
        },
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
    expireAt: {
    type: Date,
    index: { expires: 0 }
  }
}, {
   
    toJSON: { getters: true },
    toObject: { getters: true }
});

const meetInfo = new mongoose.model('meeting', meetInfoSchema)
export{meetInfo};