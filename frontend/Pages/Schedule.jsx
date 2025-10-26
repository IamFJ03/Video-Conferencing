import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../Provider/UserContext';
import axios from 'axios';
export default function Schedule() {
  const { user } = useUserContext();
  const[data, setData] = useState([]);

  useEffect(() => {
    console.log("Username:", user.username);

    const fetching = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/meeting/fetchinfo", {
          params:{
            user: user.username
          }
        });
        if(response.data || response.data.status==="Schedules fetched"){
          console.log("Schedules:", response.data.meets);
          setData(response.data.meets);
        }
      }
      catch (e) {
        console.log("Error:", e);
      }
    }

    fetching();
  }, [])
  return (
    <div>
      <div className='flex'>
        <Sidebar />
        <div className='h-100 ml-10 w-250 px-20 py-10 rounded shadow-2xl'>
          <p className='text-3xl font-bold font-mono'>SCHEDULED MEETINGS</p>
          <div className='mt-10'>
            <div>
              <Link to={"/create-meeting"} ><button className='cursor-pointer bg-black text-white px-7 py-2 rounded font-bold flex items-center gap-2 mb-5'><Plus color='white' size={20} strokeWidth={2} />  New Meeting</button></Link>
              {data ? 
              
              <div>
              <div className='flex justify-between px-5 mb-5 font-bold text-xl font-mono'>
                  <p>Date</p>
                  <p className='ml-26'>Time</p>
                  <p>Title</p>
                  <p>Joining Code</p>
                </div>
              {data.map((item, index) => (
                <div key={item.id} className='border border-gray-200 py-3 px-4 rounded-lg shadow-xl'>
                <div className='flex justify-between'>
                  <p>{item.date}</p>
                  <p>{item.time}</p>
                  <p>{item.title}</p>
                  <p>{item.link}</p>
                </div>
                </div>
              ))}
              </div>
              :
              <div>
              </div>}
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
