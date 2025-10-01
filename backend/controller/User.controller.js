import { User } from "../model/Authentication.js"; 
import otpGenerator from 'otp-generator';

    const SignUp = async (req, res) => {
        const {username, email, password } = req.body;
        console.log(username);
        let user = await User.findOne({Email:email});
        if(user){
            res.json({message:"User Already Present"})
        }
        else{
            user = new User({Username:username, Email:email, Password:password});
            await user.save();
            res.json({message:"User Created successfully", newUser: user});
        }
    }

    const login = async (req, res) => {
        const {email, password} = req.body;
        try{
        let user = await User.findOne({Email: email});
        if(user){
            const otp = otpGenerator.generate(6, {digits: true,lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars:false })
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            await User.findOneAndUpdate({Email: email},{
                $set :{ otp: otp, otpExpires: otpExpires}
            });
            console.log(`Sending OTP ${otp} to ${email}`);
            res.json({message:"User Found", newUser: user});
        }
        else
            res.json({message:"User doesn't Exists"});
        }
        catch(e){
            res.status(500).json({message:"Internal Server Error"});
        }
    }

    export{SignUp, login}