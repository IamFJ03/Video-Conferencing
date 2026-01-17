import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { useUserContext } from '../Provider/UserContext';

export default function Authentication() {
  const [viewType, setViewType] = useState("login");
  const [logEmail, setLogEmail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

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
        setTimeout(() => {
          setShowError(false)
        }, 3000);
      }
    }
    catch (error) {
      console.log("Error", error);
    }
  }
  const handleLogin = async () => {
    if (logEmail === "" || logPass === "") {
      setErrorMsg("Fill all details");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    if (validateEmail(logEmail))
      setErrorMsg("");
    else {
      setErrorMsg("Invalid Email Format");
      setShowError(true);
      setTimeout(() => {
        setShowError(false)
      }, 3000)
      return;
    }

    const response = await axios.post("http://localhost:8000/api/authentication/login", {
      email: logEmail,
      password: logPass
    },{
      withCredentials: true
    });

    if (response.data.message === "Authentication Succesfull") {
      console.log("User Found:", response.data.newUser);
    
      await localStorage.setItem("token", response.data.token);
      navigate(`/home/${logEmail}`, {
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
      setTimeout(() => {
        setShowError(false)
      }, 3000)
    }
  }
  return (
    <div className='flex justify-center overflow-hidden w-90 md:w-screen h-fit py-10'>
      {viewType === "login" ?
        (
          <div>
            <div className=' h-115 rounded-2xl md:p-15 py-10 min-w-70 shadow-xl mt-20 md:mt-0 md:-ml-100'>
              <p className='text-black font-bold text-2xl'>Welcome Back!</p>
              <p className='text-gray-400'>Log In to have video conference</p>
              <p className='text-left pt-5 mb-2 text-lg ml-[10%] md:ml-0'>Email:</p>
              <input placeholder='Enter Email' type='email' className='border-1 w-55 md:w-70 py-1 px-2 rounded' value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
              <p className='text-left mb-2 pt-5 text-lg ml-[10%] md:ml-0'>Password:</p>
              <input placeholder='Enter Password' type='password' className='border-1 w-55 md:w-70 py-1 px-2 rounded mb-5' value={logPass} onChange={(e) => setLogPass(e.target.value)} /><br />
              <button className='bg-gray-900 text-white my-5 py-2 w-55 md:w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleLogin()}>Log In</button><br />
              <span>Don't have an Account?</span><span className='ml-2 hover:cursor-pointer' onClick={() => setViewType("signup")}>Sign Up</span>
            </div>

          </div>
        )
        :
        (
          <div className=' h-140 rounded-2xl p-10 shadow-xl -ml-7 md:-ml-100 mt-20 md:mt-0 min-w-70 '>
            <p className='text-black font-bold text-2xl'>Welcome to MeetConf</p>
            <p className='text-gray-400 w-60'>Sign Up to have video conferencing with close ones, meet ups etc.</p>
            <p className='text-left md:ml-0 pt-5 mb-2 text-lg ml-[10%]'>UserName:</p>
            <input placeholder='Enter Username' type='text' className='border-1 w-55   md:w-70 py-1 px-2 rounded' value={username} onChange={(e) => setUsername(e.target.value)} />
            <p className='text-left md:ml-0 pt-5 mb-2 text-lg ml-[10%]'>Email:</p>
            <input placeholder='Enter Email' type='email' className='border-1 w-55 md:w-70 py-1 px-2 rounded' value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
            <p className='text-left md:ml-0 mb-2 pt-5 text-lg ml-[10%]'>Password:</p>
            <input placeholder='Enter Password' type='password' className='border-1 w-55 md:w-70 py-1 px-2 rounded' value={logPass} onChange={(e) => setLogPass(e.target.value)} /><br />
            <button className='bg-gray-900 text-white my-5 py-2 w-55 md:w-70 rounded-2xl hover:cursor-pointer' onClick={() => handleSignUp()}>Sign Up</button><br />
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
            <div className=' py-3 h-fit w-100 rounded-2xl shadow-2xl'>
              <div className='flex items-center px-5 gap-5 mb-2'>
                <AlertCircle size={25} color='black' />
                <p className='text-left text-xl'>Error</p>
              </div>

              <p className='text-gray-400 text-left px-5'>{errorMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
