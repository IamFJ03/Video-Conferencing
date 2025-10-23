import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Home, User, Calendar, Settings, LogOut, LogIn, Video, Users } from 'lucide-react';
import Sidebar from '../components/sidebar';

export default function Dashboard() {
  return (
    <div>
      <div className='flex '>
        <div>
          <Sidebar />
        </div>
        <div className='flex flex-row justify-center gap-40 mt-20 ml-20 flex-wrap'>
          <Link to={"/create-meeting"}><div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <Video color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>New Meeting</p>
          </div></Link>
          <Link to={"/join-meeting"}><div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <LogIn color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Join Meeting</p>
          </div></Link>
          <Link to={"/schedule"}><div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Calendar color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Schedule</p>
          </div></Link>
          <Link ><div className='flex flex-col h-50 min-w-70  bg-black rounded-2xl items-center justify-center hover:shadow-2xl mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Users color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Contacts</p>
          </div></Link>
        </div>
      </div>
    </div>
  )
}