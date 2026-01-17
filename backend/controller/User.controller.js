import mongoose from "mongoose";
import { Person } from "../model/User.model.js";
import multer from 'multer';
import express from 'express';
import jwt from "jsonwebtoken";

const SaveUser = async (req, res) => {
    const { fullname, nickname, gender, country, language, contact } = req.body;
    const profilePictureFilename = req.file ? req.file.filename : null;

  console.log('Full Name:', fullname);
  console.log('Nick Name:', nickname);
  console.log('Gender:', gender);
  console.log('Country:', country);
  console.log('Language:', language);
  console.log('Contact:', contact);
  console.log("User:",req.user);
  console.log("Picture:", profilePictureFilename);
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const updateData = {
    fullName: fullname,
    nickName: nickname, 
    gender, 
    country, 
    language, 
    contact
  }

  if(profilePictureFilename)
    updateData.profilePicture = profilePictureFilename;

  const search = await Person.findOne({id: userId});
  if(search){
   const newPerson = await Person.findOneAndUpdate({id: userId},{
    $set: {...updateData}
   },
  { new: true }
);

   res.json({message:"User Updated", user: newPerson});
  }
  else{
    const person = new Person({ id: req.user.id, ...updateData});
    await person.save();
    res.json({message:"User Profile Saved", user: person})
  }
}

const fetchData = async (req, res) => {
  
  const userId = new mongoose.Types.ObjectId(req.user.id);
  console.log("User Id:",userId);
      const userData = await Person.findOne({id: userId});
      console.log(userData);
     try{
      
      if(userData){
      res.json({message:"User Data Fetched", user: userData});
      }
      else
      res.json({message:"User Data not found"});
     }
     catch(error){
      res.status(500).json({message:"Internal Server Error"});
     }
}

const me = async (req, res) => {
  const token = req.cookies.token;
console.log("Cookie received:", req.cookies.token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    console.log(decode);
    res.json({ user: decode });
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export{SaveUser, fetchData, me}