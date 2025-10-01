import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Authentication() {
  const [viewType, setViewType] = useState("login");
  const [logEmail, setLogEmail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const handleSignUp = async () => {
    try {
      if (username === "" || logEmail === "" || logPass === "") {
  setErrorMsg("Fill all details");
  setShowError(true);
  setTimeout(() => {
    setShowError(false);
  }, 3000);
  return;
      };
      const response = await axios.post("http://localhost:8000/api/authentication/Signup", {
        username: username,
        email: logEmail,
        password: logPass
      })
      if (response.data.message === "User Created successfully") {
        console.log("User Created", response.data.user);
        setLogEmail("");
        setLogPass("");
        navigate("/");
      }
      else {
        console.log(response.data.message);
        setErrorMsg("User Already Exists");
        setShowError(true);
        setTimeout(()=>{
            setShowError(false)
        }, 3000);
      }
    }
    catch (error) {
      console.log("Error", error);
    }
  }
  const handleLogin = async () => {
    const response = await axios.post("http://localhost:8000/api/authentication/login", {
      email: logEmail,
      password: logPass
    });

    if (response.data.message === "User Found") {
      console.log("User Found:", response.data.newUser);
      navigate('/verification', {
        state: {
          email: logEmail
        }
      })
    }
    else {
      console.log(response.data.message);
      setLogEmail("");
      setLogPass("");
      setErrorMsg("Login Credentials wrong either mail or password");
      setShowError(true);
      setTimeout(()=>{
            setShowError(false)
        }, 3000)
    }
  }
  return (
    <div className='flex justify-center'>
      {viewType === "login" ?
        (
          <div>
            <div className='w-80 h-100 rounded-2xl py-4 shadow-2xl mt-20'>
              <p className='text-black font-bold text-2xl'>Welcome Back!</p>
              <p className='text-gray-400'>Log In to have video conference</p>
              <p className='text-left ml-5 pt-5 text-lg'>Email:</p>
              <input placeholder='Enter Email' type='email' className='border-1 w-70 py-1 px-2 rounded' value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
              <p className='text-left ml-5 pt-5 text-lg'>Password:</p>
              <input placeholder='Enter Password' type='password' className='border-1 w-70 py-1 px-2 rounded' value={logPass} onChange={(e) => setLogPass(e.target.value)} /><br />
              <button className='bg-gray-900 text-white my-5 py-2 w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleLogin()}>Log In</button><br />
              <span>Don't have an Account?</span><span className='ml-2 hover:cursor-pointer' onClick={() => setViewType("signup")}>Sign Up</span>
            </div>

          </div>
        )
        :
        (
          <div className='w-90 h-130 rounded-2xl py-8 shadow-2xl mt-20'>
            <p className='text-black font-bold text-2xl'>Welcome to MeetConf</p>
            <p className='text-gray-400'>Sign Up to have video conferencing with close ones, meet ups etc.</p>
            <p className='text-left ml-10 pt-5 text-lg'>UserName:</p>
            <input placeholder='Enter Username' type='text' className='border-1 w-70 py-1 px-2 rounded' value={username} onChange={(e) => setUsername(e.target.value)} />
            <p className='text-left ml-10 pt-5 text-lg'>Email:</p>
            <input placeholder='Enter Email' type='email' className='border-1 w-70 py-1 px-2 rounded' value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
            <p className='text-left ml-10 pt-5 text-lg'>Password:</p>
            <input placeholder='Enter Password' type='password' className='border-1 w-70 py-1 px-2 rounded' value={logPass} onChange={(e) => setLogPass(e.target.value)} /><br />
            <button className='bg-gray-900 text-white my-5 py-2 w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleSignUp()}>Sign Up</button><br />
            <span>Already have an Account?</span><span className='ml-2 hover:cursor-pointer' onClick={() => setViewType("login")}>Log In</span>
          </div>
        )
      }
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className='absolute bottom-15 right-30'>
            <div className='h-17 w-100 rounded-2xl py-2 shadow-2xl'>
              <p className='text-left text-xl px-10'>Error</p>
              <p className='text-gray-400 text-left px-5'>{errorMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
