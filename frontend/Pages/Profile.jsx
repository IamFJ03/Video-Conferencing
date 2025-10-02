import React, { useEffect } from 'react'
import Sidebar from '../components/sidebar'
import { useUserContext } from '../Provider/UserContext'
export default function Profile() {
    const {user} = useUserContext();
    useEffect(() => {
        const fetchedUser = () => {
            console.log("User:", user);
        }
         fetchedUser();
    },[])
  return (
    <div className='flex bg-gray-50 w-342 bottom-8 relative'>
      <div className='top-8 relative'>
        <Sidebar />
      </div>
      <div>
        <div className='w-270 h-160 bg-white mt-10 rounded-2xl shadow-2xl ml-[-50px]'>
<p>{user.username}</p>
        </div>
      </div>
    </div>
  )
}
