import React, { useState } from 'react'
import Sidebar from '../components/sidebar';
import { X } from 'lucide-react';
import { useUserContext } from '../Provider/UserContext';
import axios from "axios";

export default function NewMeeting() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("")
  const [modal, setModal] = useState(false);
  const { user } = useUserContext();

  const handleSave = async () => {
    console.log("Title:", title, "date:", date, "Time:", time, "Link:", link, "Description:", description);
    if (title === "" || date === "" || time === "" || link === "" || description === "") {
      setErrorMsg("All Fields are required!!")
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
    else {
      console.log(user.username);
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
        console.log("Sending data")
        const response = await axios.post('http://localhost:8000/api/meeting/info',
          formdata
        );
        if (response.data.status === "Schedule added")
          console.log("Meeting Scheduled", response.data.info);

      }
      catch (e) {
        console.log("Error", e);
      }
    }
  }

  const handleCancel = () => {
    setDate("");
    setTitle("");
    setTime("");
    setLink("");
    setDescription("");
  }


  const handleCloseModal = () => {
    setModal(false);
    setDate("");
    setTitle("");
    setTime("");
    setLink("");
    setDescription("");
  }

  return (
    <div>
      <div className='flex'>
        <Sidebar />
        <div className='h-150 p-15 rounded shadow-2xl ml-50 mt-5'>
          <p className='font-bold text-3xl mb-10'>New Meeting</p>
          <div>
            <div className='flex justify-between items-center'><span className='font-bold'>Meeting Title</span><input type='text' placeholder='E.g. Doubt Session' className='border-1 w-80 py-1 px-2 ml-2 rounded' value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className='flex justify-between items-center my-10'><span className='font-bold text-left'>Date</span><input type='date' className='border-1 w-80 py-1 px-2 ml-2 rounded' value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className='flex justify-between items-center'><span className='font-bold text-left'>Time</span><input type='time' className='border-1 w-80 py-1 px-2 ml-2 rounded' value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <div className='flex justify-between items-center my-10'><span className='font-bold text-left'>Location/Link</span><input type='text' placeholder='Create room Link' className='border-1 w-80 py-1 px-2 ml-2 rounded' value={link} onChange={(e) => setLink(e.target.value)} /></div>
            <div className='flex justify-between items-center'><span className='font-bold text-left'>Description</span><textarea placeholder='Add Agenda or notes' className='border-1 w-80 py-1 px-2 ml-2 rounded' value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <p className='text-left my-5 text-red-600'>{errorMsg}</p>
            <div className='flex justify-between'>
              <button className='border-2 py-2 px-7 rounded font-bold cursor-pointer' onClick={handleCancel}>Cancel</button>
              <button className='border-2 py-2 px-7 rounded font-bold text-white bg-black cursor-pointer' onClick={handleSave}>Save Meeting</button>
            </div>
          </div>
        </div>
      </div>

      {modal &&

        <div className='fixed inset-0 bg-black/50 flex items-center justify-center' onClick={handleCloseModal}>

          <div className='relative shadow-2xl text-left w-96 bg-white p-8 rounded-lg' onClick={(e) => e.stopPropagation()}>
            <p className='font-bold text-2xl mb-4'>Meeting Details</p>

            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-900'
              onClick={handleCloseModal}
            >
              <X size={24} />
            </button>

            <p className='mb-1'><span className='font-semibold'>Title:</span> {title}</p>
            <p className='mb-1'><span className='font-semibold'>Date:</span> {date}</p>
            <p className='mb-1'><span className='font-semibold'>Time:</span> {time}</p>
            <p className='mb-1'><span className='font-semibold'>Link:</span> {link}</p>
            <p className='mb-4'><span className='font-semibold'>Description:</span> {description}</p>

            <button
              className='w-full py-2 rounded font-bold text-white bg-black mt-2'
              onClick={handleCloseModal}
            >
              Confirm and Close
            </button>
          </div>
        </div>
      }
    </div>
  )
}