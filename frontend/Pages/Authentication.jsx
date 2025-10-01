import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Authentication() {
    const [viewType, setViewType] = useState("login");
    const [logEmail, setLogEmail] = useState("");
    const [logPass, setLogPass] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const handleSignUp = async () => {
        try{
          const response = await axios.post("http://localhost:8000/api/authentication/Signup",{
            username: username,
            email:logEmail,
            password: logPass
          })
          if(response.message==="User Created successfully"){
            console.log("User Created", response.user);
            setLogEmail("");
            setLogPass("");
          }
          else
            console.log(response.message);
        }
        catch(error){
          console.log("Error",error);
        }
    }
    const handleLogin = async () => {
      const response = await axios.post("http://localhost:8000/api/authentication/login",{
        email: logEmail,
        password: logPass
      });

      if(response.data.message === "User Found"){
        console.log("User Found:", response.data.newUser);
        navigate('/verification',{
          state:{
            email: logEmail
          }
        })
      }
      else{
        console.log(response.data.message);
        setLogEmail("");
        setLogPass("");
    }
  }
  return (
    <div className='flex justify-center'>
      {viewType === "login" ? 
      (
        <div className='w-80 h-100 rounded-2xl py-4 shadow-2xl mt-20'>
        <p className='text-black font-bold text-2xl'>Welcome Back!</p>
        <p className='text-gray-400'>Log In to have video conference</p>
        <p className='text-left ml-5 pt-5 text-lg'>Email:</p>
        <input placeholder='Enter Email' type='email' className='border-1 w-70 py-1 px-2 rounded'  value={logEmail} onChange={(e) => setLogEmail(e.target.value)}/>
        <p className='text-left ml-5 pt-5 text-lg'>Password:</p>
        <input placeholder='Enter Password' type='password' className='border-1 w-70 py-1 px-2 rounded' value={logPass} onChange={(e) => setLogPass(e.target.value)}/><br />
        <button className='bg-gray-900 text-white my-5 py-2 w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleLogin()}>Log In</button><br />
        <span>Don't have an Account?</span><span className='ml-2 hover:cursor-pointer' onClick={() => setViewType("signup")}>Sign Up</span>
      </div>
      )
    :
    (
        <div className='w-90 h-130 rounded-2xl py-8 shadow-2xl mt-20'>
        <p className='text-black font-bold text-2xl'>Welcome to MeetConf</p>
        <p className='text-gray-400'>Sign Up to have video conferencing with close ones, meet ups etc.</p>
        <p className='text-left ml-10 pt-5 text-lg'>UserName:</p>
        <input placeholder='Enter Username' type='text' className='border-1 w-70 py-1 px-2 rounded'  value={username} onChange={(e) => setUsername(e.target.value)}/>
        <p className='text-left ml-10 pt-5 text-lg'>Email:</p>
        <input placeholder='Enter Email' type='email' className='border-1 w-70 py-1 px-2 rounded'  value={logEmail} onChange={(e) => setLogEmail(e.target.value)}/>
        <p className='text-left ml-10 pt-5 text-lg'>Password:</p>
        <input placeholder='Enter Password' type='password' className='border-1 w-70 py-1 px-2 rounded' value={logPass} onChange={(e) => setLogPass(e.target.value)}/><br />
        <button className='bg-gray-900 text-white my-5 py-2 w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleSignUp()}>Sign Up</button><br />
        <span>Already have an Account?</span><span className='ml-2 hover:cursor-pointer' onClick={() => setViewType("login")}>Log In</span>
      </div>
    )
    }
    </div>
  )
}
