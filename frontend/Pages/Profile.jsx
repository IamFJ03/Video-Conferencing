import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'
import { useUserContext } from '../Provider/UserContext'
import { UserCircle2Icon, MailIcon } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useUserContext();
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const fetchedUser = () => {
      console.log("User:", user);
    }
    fetchedUser();
  }, [])
  return (
    <div className='flex bg-gray-50 w-342 bottom-8 relative'>
      <div className='top-8 relative'>
        <Sidebar />
      </div>
      <div>
        <div className='w-270 h-160 bg-white mt-10 rounded-3xl shadow-2xl ml-[-50px]'>
          <div className='flex items-center justify-between px-20 mb-10'>
            <div className='flex items-center py-5'>
              <div>
                <UserCircle2Icon color='black' size={45} strokeWidth={1.5} />
              </div>
              <div className='ml-2'>
                <p className='font-bold text-lg text-left'>{user.username}</p>
                <p className='text-md text-gray-400 text-left'>{user.email}</p>
              </div>
            </div>
            <div>
              <button className='bg-blue-600 text-white py-2 px-5 rounded hover:cursor-pointer'><Link to="/setting">Edit</Link></button>
            </div>
          </div>



          <div>
            <div className='flex justify-between px-20 mb-10'>
              <div>
              <p className='text-left mb-2 font-bold'>Full Name:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
              <div>
              <p className='text-left mb-2 font-bold'>Nick Name:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
            </div>
            <div className='flex justify-between px-20 mb-10'>
              <div>
              <p className='text-left mb-2 font-bold'>Gender:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
              <div>
              <p className='text-left mb-2 font-bold'>Country:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
            </div>
            <div className='flex justify-between px-20 mb-10'>
              <div>
              <p className='text-left mb-2 font-bold'>Language:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
              <div>
              <p className='text-left mb-2 font-bold'>Contact No:</p>
              <input value={fullName === "" ? "nill" : fullName} disabled className='bg-gray-200 rounded px-5 py-2 w-100' />
              </div>
            </div>
          </div>
          <div className='px-20'>
            <p className='text-xl font-bold text-left mb-5'>My Email Address:</p>
            <MailIcon color='black' size={30} strokeWidth={1.5}/>
          </div>


        </div>
      </div>
    </div>
  )
}
