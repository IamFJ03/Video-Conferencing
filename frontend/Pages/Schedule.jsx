import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Plus, DeleteIcon, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../Provider/UserContext';
import axios from 'axios';

export default function Schedule() {
  const { user } = useUserContext();
  const [data, setData] = useState([]);
  const [alertMsg, setAlertMsg] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meeting/fetchinfo`, {
          params: { user: user.username }
        });
        if (response.data?.meets) {
          setData(response.data.meets);
        }
      } catch (e) {
        console.log('Error:', e);
      }
    };
    fetching();
  }, [user.username]);

  const handleDeleteSchedule = async (itemID) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/meeting/deleteMeeting/${itemID}`);
      if (res.data.status === 'Schedule removed') {
        setData(prev => prev.filter(item => item._id !== itemID));
        setAlertMsg(true);
        setTimeout(() => setAlertMsg(false), 3000);
      }
    } catch (e) {
      console.log('Error:', e);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="md:block">
        <Sidebar />
      </div>

      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <p className="text-2xl sm:text-3xl font-bold font-mono mb-6">
            SCHEDULED MEETINGS
          </p>

          <Link to="/create-meeting">
            <button className="bg-black text-white px-4 py-2 rounded font-bold flex items-center gap-2 mb-6 text-sm sm:text-base">
              <Plus size={18} /> New Meeting
            </button>
          </Link>

          {data.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-4 font-bold text-lg font-mono px-4">
                <p>Date</p>
                <p>Time</p>
                <p>Title</p>
                <p>Joining</p>
              </div>

              {data.map(item => (
                <div
                  key={item._id}
                  className="relative border border-gray-200 rounded-xl shadow-md p-4"
                >
                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-4 items-center">
                    <p>{item.date}</p>
                    <p>{item.time}</p>
                    <p>{item.title}</p>
                    <Link
                      to="/join-meeting"
                      state={{ code: item.link }}
                      className="text-blue-600 font-semibold"
                    >
                      Join
                    </Link>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden space-y-2">
                    <p><span className="font-semibold">Date:</span> {item.date}</p>
                    <p><span className="font-semibold">Time:</span> {item.time}</p>
                    <p><span className="font-semibold">Title:</span> {item.title}</p>
                    <Link
                      to="/join-meeting"
                      state={{ code: item.link }}
                      className="text-blue-600 font-semibold inline-block"
                    >
                      Join Meeting
                    </Link>
                  </div>

                  <DeleteIcon
                    size={22}
                    className="absolute top-3 right-3 cursor-pointer"
                    onClick={() => handleDeleteSchedule(item._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg font-mono">No Meetings Scheduled yet...</p>
          )}
        </div>
      </div>

      {/* Success alert */}
      <div
        className={`fixed bottom-6 right-6 py-3 px-5 bg-white shadow-xl rounded-2xl transition-opacity duration-500 ${alertMsg ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle size={22} />
          <p className="font-bold">Success</p>
        </div>
        <p className="text-sm">Meeting Successfully Removed.</p>
      </div>
    </div>
  );
}
