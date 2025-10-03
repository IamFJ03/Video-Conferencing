import React from 'react'
import { Link } from 'react-router-dom'
import { Home, User, Calendar, Settings, LogOut } from 'lucide-react';
export default function sidebar() {
  return (
      <div className='h-screen bg-black w-50 bottom-8 md:right-39 right-8 relative'>
          <p className='text-white text-2xl font-bold py-5 border-b-1 w-50'>MeetConf</p>
          <ul className='text-white text-left py-10 px-10'>
            <li className='flex flex-row items-center'>
              <Home color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="/home">Home</Link></span>
            </li>
            <li className='py-10 flex flex-row items-center'>
              <Calendar color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="/schedule"> Schedule</Link></span>
            </li>
            <li className='flex flex-row items-center'>
              <Settings color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="/setting">Setting</Link></span>
            </li>
            <li className='pt-10 flex flex-row items-center'>
              <User color="white" size={20} strokeWidth={1.5} className='mr-2' />
              <span><Link to="/profile">Profile</Link></span>
            </li>

          </ul>
          <p className='text-white pt-10 flex flex-row items-center absolute bottom-10 border-t-1 w-50'>
            <LogOut color='white' size={20} strokeWidth={1.5} className='ml-10 mr-2' />
            <span className=''>LogOut</span>
          </p>
          </div>
  )
}
