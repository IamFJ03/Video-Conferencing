import { User } from "../model/Authentication.js";
import nodemailer from "nodemailer";
import 'dotenv/config';
import otpGenerator from 'otp-generator';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


const SignUp = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username);
    let user = await User.findOne({ Email: email });
    if (user) {
        res.json({ message: "User Already Present" })
    }
    else {
        user = new User({ Username: username, Email: email, Password: password });
        await user.save();
        res.json({ message: "User Created successfully", newUser: user });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ Email: email });
        if (user) {
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "User Verification for MeetConf",
                html: `
        <h2>OTP for Verification</h2>
        <h2 class="font-bold">${otp}</h2>
        `
            }
            await User.findOneAndUpdate({ Email: email }, {
                $set: { otp: otp, otpExpires: otpExpires }
            });
            console.log(`Sending OTP ${otp} to ${email}`);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error)
                    return console.log("Error", error);

                console.log("Sending message:", info.response);
            })
            res.json({ message: "User Found", newUser: user });
        }
        else
            res.json({ message: "User doesn't Exists" });
    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const verify = async (req, res) => {
    const { email, otp } = req.body;
    try{
    const userVerification = await User.findOne({Email: email, otp});
    
    if(userVerification){
        res.json({message:"User is Identified"});
    }
    else
        res.json({message:"User is Suspecious"});
}
catch(error){
    res.status(500).json({message:'Error during Verification, Please try again to continue...'});
}
}

export { SignUp, login, verify }