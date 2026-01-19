import React from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'
import { Home, User, Calendar, Settings, LogOut } from 'lucide-react';

export default function sidebar() {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/authentication/logout`,{
      withCredentials: true
    });

    if(res.data.message === "Logged Out Successfully")
      navigate("/auth")
  }

  return (
    <div>
      <div className='hidden md:block h-screen bg-black w-50 bottom-8 md:right-39 right-8 relative'>
        <p className='text-white text-2xl font-bold py-5 border-b-1 w-50'>MeetConf</p>
        <ul className='text-white text-left py-10 px-10'>
          <li className='flex flex-row items-center'>
            <Home color="white" size={20} strokeWidth={1.5} className='mr-2' />
            <span><Link to="/">Home</Link></span>
          </li>
          <li className='py-10 flex flex-row items-center'>
            <Calendar color="white" size={20} strokeWidth={1.5} className='mr-2' />
            <span><Link to="/schedule"> Schedules</Link></span>
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
        <div className='text-white pt-10 flex flex-row items-center absolute bottom-10 border-t-1 w-50' onClick={handleLogOut}>
          <LogOut color='white' size={20} strokeWidth={1.5} className='ml-10 mr-2' />
          <span className=''>LogOut</span>
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-black z-50 flex justify-around items-center">
  <Link to="/">
    <Home color="white" size={28} strokeWidth={1.5} />
  </Link>
  <Link to="/schedule">
    <Calendar color="white" size={28} strokeWidth={1.5} />
  </Link>
  <Link to="/setting">
    <Settings color="white" size={28} strokeWidth={1.5} />
  </Link>
  <Link to="/profile">
    <User color="white" size={28} strokeWidth={1.5} />
  </Link>
</div>
    </div>
  )
}
