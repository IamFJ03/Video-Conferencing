import e from "express";
import { meetInfo } from "../model/meet.model.js";

const meetInfoSave = async (req, res) => {
    try{
    const {username, title, date, time, link, description} = req.body;
    console.log("Username:", username);
    console.log("Title of meeting:", title);
    console.log("Date:", date, "and Time:", time);

    const expireAt = new Date(`${date}T${time}:00`)
    const info = {
        username, title, date, time, link, description, expireAt
    }
    console.log("Meeting Scheduled");
    const addMeetInfo = await meetInfo.create(info)
    res.json({status:"Schedule added", info: addMeetInfo});
        
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"})
    }
}

const fetchMeetInfo = async (req, res) => {
    try{
        const { user } = req.query;
        console.log("User:", user);
        const fetch = await meetInfo.find({username: user});
        if(fetch){
            console.log("Schedules:", fetch);
            res.json({status:"Schedules fetched", meets: fetch});
        }
        else
            res.json({status:"No Meets scheduled"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"});
    }
} 

const removeSchedule = async (req, res) => {
    try{
        const itemID = req.params.id;
        console.log("Scheduled meeting ID at backend:", itemID);
        const remove = await meetInfo.deleteOne({_id: itemID});
        if(remove.deletedCount ===1){
            console.log(`Successfully deleted document with ID: ${itemID}`);
            res.json({status:"Schedule removed"})
        }
        else
            console.log(`Document not found with ID: ${itemID}`);       
    }
    catch(e){
        res.status(500).json({error:"Internal Server Error"});
    }
}

export { meetInfoSave, fetchMeetInfo, removeSchedule };