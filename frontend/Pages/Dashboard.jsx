import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Home, User, Calendar, Settings, LogOut, LogIn, Video, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div>
      <div className='flex '>
        <div className='h-screen bg-black w-50 bottom-8 md:right-39 right-8 relative'>
          <p className='text-white text-2xl font-bold py-5 border-b-1 w-50'>MeetConf</p>
          <ul className='text-white text-left py-10 px-10'>
            <li className='flex flex-row items-center'>
              <Home color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="">Home</Link></span>
            </li>
            <li className='py-10 flex flex-row items-center'>
              <Calendar color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to=""> Schedule</Link></span>
            </li>
            <li className='flex flex-row items-center'>
              <Settings color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="">Setting</Link></span>
            </li>
            <li className='pt-10 flex flex-row items-center'>
              <User color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="">Profile</Link></span>
            </li>

          </ul>
          <p className='text-white pt-10 flex flex-row items-center absolute bottom-10 border-t-1 w-50'>
            <LogOut color='white' size={20} strokeWidth={1.5} className='ml-10 mr-2' />
            <span className=''>LogOut</span>
          </p>
        </div>
        <div className='flex flex-row justify-center gap-40 mt-20 ml-20 flex-wrap'>
          <div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <Video color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>New Meeting</p>
          </div>
          <div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl hover:mt-[-20px] duration-500 hover:cursor-pointer'>
            <LogIn color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Join Meeting</p>
          </div>
          <div className='h-50 min-w-70 bg-black rounded-2xl flex flex-col items-center justify-center hover:shadow-2xl mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Calendar color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Schedule</p>
          </div>
          <div className='flex flex-col h-50 min-w-70  bg-black rounded-2xl items-center justify-center hover:shadow-2xl mt-[-200px] hover:mt-[-220px] duration-500 hover:cursor-pointer'>
            <Users color='white' size={50} strokeWidth={1.5} />
            <p className='text-white text-3xl'>Contacts</p>
          </div>
        </div>
      </div>
    </div>
  )
}