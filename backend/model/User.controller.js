import mongoose from "mongoose";
import { User } from "./Authentication.js";
const PersonSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    fullName:{
        type: String,
        required:false
    },
    nickName:{
        type: String,
        required:false
    },
    Gender:{
        type: String,
        required:false
    },
    country:{
        type: String,
        required:false
    },
    language:{
        type: String,
        required:false
    },
    contact:{
        type: String,
        required:false
    },
})

const Person = new mongoose.model("Person", PersonSchema);
export{Person}