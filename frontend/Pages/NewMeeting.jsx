import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import { X, CheckCircle } from 'lucide-react';
import { useUserContext } from '../Provider/UserContext';
import axios from "axios";

export default function NewMeeting() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modal, setModal] = useState(false);
  const { user } = useUserContext();
  const [successAlert, setSuccessAlert] = useState(false);

  const handleSave = async () => {
    if (title === "" || date === "" || time === "" || link === "" || description === "") {
      setErrorMsg("All Fields are required!!");
      setTimeout(() => setErrorMsg(""), 3000);
    } else {
      setModal(true);
      const dateOnly = date.substring(0, 10);
      const formdata = new FormData();
      formdata.append('title', title);
      formdata.append('date', dateOnly);
      formdata.append('time', time);
      formdata.append('link', link);
      formdata.append('description', description);
      formdata.append('username', user.username);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/meeting/info`, formdata);
        if (response.data.status === "Schedule added") console.log("Meeting Scheduled", response.data.info);
      } catch (e) {
        console.log("Error", e);
      }
    }
  };

  const handleCancel = () => {
    setDate(""); setTitle(""); setTime(""); setLink(""); setDescription("");
  };

  const handleCloseModal = () => {
    setModal(false);
    handleCancel();
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 3000);
  };

  const generateRoomCode = (length) => {
    const ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += ch.charAt(Math.floor(Math.random() * ch.length));
    }
    return code;
  };

  const handleGenerateCode = () => setLink(generateRoomCode(10));

  return (
    <div className='relative min-h-screen bg-gray-50 lg:bg-white'>
      <div className='flex flex-col lg:flex-row'>
        <Sidebar />
        
        {/* Main Content Container */}
        <div className='flex-1 flex justify-center lg:justify-start lg:ml-50 p-4 mt-5'>
          <div className='w-full max-w-xl lg:h-160 p-6 lg:p-15 bg-white rounded shadow-2xl'>
            <p className='font-bold text-2xl lg:text-3xl mb-6 lg:mb-10 text-center lg:text-left'>New Meeting</p>
            
            <div className='space-y-4 lg:space-y-10'>
              {/* Meeting Title */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2'>
                <span className='font-bold'>Meeting Title</span>
                <input type='text' placeholder='E.g. Doubt Session' className='border-1 w-full lg:w-80 py-1 px-2 rounded' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              {/* Date */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2'>
                <span className='font-bold'>Date</span>
                <input type='date' className='border-1 w-full lg:w-80 py-1 px-2 rounded' value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              {/* Time */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2'>
                <span className='font-bold'>Time</span>
                <input type='time' className='border-1 w-full lg:w-80 py-1 px-2 rounded' value={time} onChange={(e) => setTime(e.target.value)} />
              </div>

              {/* Room Code */}
              <div className='relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2'>
                <span className='font-bold'>Room Code:</span>
                <div className='flex flex-col w-full lg:w-80'>
                    <input type='text' placeholder='Create room Link' className='border-1 w-full py-1 px-2 rounded bg-gray-100' value={link} disabled />
                    <button className='mt-2 lg:absolute lg:-bottom-8 lg:right-0 bg-gray-500 py-1 px-3 rounded text-white text-sm cursor-pointer hover:bg-gray-600 transition-colors' onClick={handleGenerateCode}>
                        Generate
                    </button>
                </div>
              </div>

              {/* Description */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 pt-4 lg:pt-0'>
                <span className='font-bold'>Description</span>
                <textarea placeholder='Add Agenda or notes' className='border-1 w-full lg:w-80 py-1 px-2 rounded h-24 lg:h-auto' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Error Message */}
              {errorMsg && <p className='text-left text-red-600 text-sm font-medium'>{errorMsg}</p>}

              {/* Buttons */}
              <div className='flex flex-col-reverse lg:flex-row lg:justify-between gap-3 pt-4'>
                <button className='border-2 py-2 px-7 rounded font-bold cursor-pointer hover:bg-gray-100' onClick={handleCancel}>Cancel</button>
                <button className='border-2 py-2 px-7 rounded font-bold text-white bg-black cursor-pointer hover:bg-zinc-800' onClick={handleSave}>Save Meeting</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Responsive Width */}
      {modal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={handleCloseModal}>
          <div className='relative shadow-2xl text-left w-full max-w-md bg-white p-6 lg:p-8 rounded-lg' onClick={(e) => e.stopPropagation()}>
            <p className='font-bold text-2xl mb-4'>Meeting Details</p>
            <button className='absolute top-3 right-3 text-gray-500 hover:text-gray-900' onClick={handleCloseModal}>
              <X size={24} />
            </button>
            <div className='space-y-2'>
                <p><span className='font-semibold'>Title:</span> {title}</p>
                <p><span className='font-semibold'>Date:</span> {date}</p>
                <p><span className='font-semibold'>Time:</span> {time}</p>
                <p className='break-all'><span className='font-semibold'>Link:</span> {link}</p>
                <p><span className='font-semibold'>Description:</span> {description}</p>
            </div>
            <button className='w-full py-2 rounded font-bold text-white bg-black mt-6 hover:bg-zinc-800' onClick={handleCloseModal}>
              Confirm and Close
            </button>
          </div>
        </div>
      )}

      {/* Success Alert - Adjusted for mobile position */}
      <div className={`fixed bottom-5 right-5 lg:bottom-15 lg:right-5 py-3 px-5 bg-white shadow-2xl border border-gray-100 rounded-2xl transition-all duration-500 ease-in-out z-50 ${successAlert ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className='flex items-center gap-3'>
          <CheckCircle size={25} className="text-green-600" />
          <div>
            <p className='font-bold text-lg'>Success</p>
            <p className='text-sm text-gray-600'>Meeting Scheduled Successfully.</p>
          </div>
        </div>
      </div>
    </div>
  );
}