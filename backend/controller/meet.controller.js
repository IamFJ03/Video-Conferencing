import { meetInfo } from "../model/meet.model.js";

const meetInfoSave = async (req, res) => {
    try{
    const {username, title, date, time, link, description} = req.body;
    console.log("Username:", username);
    console.log("Title of meeting:", title);
    console.log("Date:", date, "and Time:", time);
    const info = {
        username, title, date, time, link, description
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

export { meetInfoSave, fetchMeetInfo };