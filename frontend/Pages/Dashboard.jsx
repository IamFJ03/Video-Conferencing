import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Calendar, Settings, LogOut, LogIn, Video, Users } from 'lucide-react';
import Sidebar from '../components/sidebar';
import axios from "axios"
import { useUserContext } from '../Provider/UserContext';


export default function Dashboard() {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/authentication/logout`, {
      withCredentials: true
    });

    if (res.data.message === "Logged Out Successfully")
      navigate("/auth")
  }
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/myself`, {
        withCredentials: true
      });

      if (res.data.message === "Unauthorized") {
        navigate("/auth", { replace: true });
      }

      console.log(res.data.user)
      setUser(res.data.user)
    }

    fetchUser();
  }, [])
  return (
    <div>
      <div className='md:flex'>
        <Sidebar />
        <div className='md:hidden bg-black h-30 absolute top-0 w-full left-0 flex items-center justify-between px-4'>
          <p className='font-mono text-white text-4xl'>MeetConf</p>
          <div onClick={handleLogOut} className='cursor-pointer'>
            <LogOut color='white' size={24} strokeWidth={1.5} />
          </div>
        </div>
        <div className='flex flex-col md:flex-row md:justify-center md:gap-40 mt-40 mb-20 md:mb-0 md:mt-20 md:ml-20 ml-[5%] md:flex-wrap gap-10'>
          <Link to={"/create-meeting"}><div className='h-50 md:min-w-70 w-[90%] bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <Video color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>New Meeting</p>
          </div></Link>
          <Link to={"/join-meeting"}><div className='h-50 md:min-w-70 w-[90%] bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <LogIn color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Join Meeting</p>
          </div></Link>
          <Link to={"/schedule"}><div className='h-50 md:min-w-70 w-[90%] bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl md:mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Calendar color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Schedules</p>
          </div></Link>
          <Link ><div className='flex flex-col h-50 md:min-w-70 w-[90%]  bg-black rounded-2xl items-center justify-center hover:shadow-2xl md:mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Users color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Contacts</p>
          </div></Link>
        </div>
      </div>
    </div>
  )
}