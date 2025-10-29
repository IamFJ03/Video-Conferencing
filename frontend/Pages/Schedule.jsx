import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Plus, DeleteIcon,CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../Provider/UserContext';
import axios from 'axios';
export default function Schedule() {

  const { user } = useUserContext();
  const [data, setData] = useState([]);
  const [alertMsg, setAlertMsg] = useState(false);

  useEffect(() => {
    console.log("Username:", user.username);

    const fetching = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/meeting/fetchinfo", {
          params: {
            user: user.username
          }
        });
        if (response.data || response.data.status === "Schedules fetched") {
          console.log("Schedules:", response.data.meets);
          setData(response.data.meets);
        }
      }
      catch (e) {
        console.log("Error:", e);
      }
    }

    fetching();
  }, []);

  const handleDeleteSchedule = async (itemID) => {
    console.log("Scheduled Meeting ID:", itemID);
    try {
      const res = await axios.delete(`http://localhost:8000/api/meeting/deleteMeeting/${itemID}`);
      if (res.data.status === "Schedule removed") {
        console.log(`Successfully deleted meeting with ID: ${itemID}`);
        setData(prevData => prevData.filter(item => item._id != itemID))
        setAlertMsg(true);
        setTimeout(() => {
          setAlertMsg(false)
        }, 3000);
      }
    }
    catch (e) {
      console.log("Error:", e);
    }
  }
  return (
    <div>
      <div className='flex'>
        <Sidebar />
        <div className='h-fit ml-10 w-250 px-20 py-10 rounded shadow-2xl'>
          <p className='text-3xl font-bold font-mono'>SCHEDULED MEETINGS</p>
          <div className='mt-10'>
            <div>
              <Link to={"/create-meeting"} ><button className='cursor-pointer bg-black text-white px-7 py-2 rounded font-bold flex items-center gap-2 mb-5'><Plus color='white' size={20} strokeWidth={2} />  New Meeting</button></Link>
              {data.length > 0 ?
                <div>
                  <div className='flex justify-between px-5 mb-5 font-bold text-xl font-mono'>
                    <p>Date</p>
                    <p className='ml-25'>Time</p>
                    <p className='ml-20'>Title</p>
                    <p>Joining Code</p>
                  </div>
                  {data.map((item, index) => (
                    <div className='flex items-center'>
                      <div key={item.id} className='border border-gray-200 py-3 px-4 rounded-lg shadow-xl mb-5 w-230'>
                        <div className='flex justify-between'>
                          <p>{item.date}</p>
                          <p>{item.time}</p>
                          <p>{item.title}</p>
                          <p><Link
                            to="/join-meeting"
                            state={{ code: item.link }}
                          >
                            Join
                          </Link></p>
                        </div>

                      </div>
                      <DeleteIcon size={30} color='black' className='absolute right-40' onClick={() => handleDeleteSchedule(item._id)} />
                    </div>
                  ))}
                </div>
                :
                <div>
                  <p className='text-gray-500 text-xl font-mono'>No Meetings Scheduled yet...</p>
                </div>
              }
            </div>
            <div>

            </div>
          </div>
        </div>
        <div className={`absolute bottom-15 right-20 py-2 px-5 bg-white shadow-xl rounded-2xl transition-opacity duration-500 ease-in-out ${alertMsg ? 'opacity-100' : 'opacity-0'}`}>
        <div className='flex items-center gap-3'>
        <CheckCircle size={25} color='black' />
        <p className='font-bold text-xl'>Success</p>
        </div>
        <p>Meeting Successfully Removed.</p>
      </div>
      </div>
    </div >
  )
}
