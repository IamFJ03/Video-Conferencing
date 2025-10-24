import React, { useState } from 'react'
import Sidebar from '../components/sidebar';

export default function NewMeeting() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log("Title:", title, "date:", date, "Time:", time, "Link:", link, "Description:", description);
  }

  const handleCancel = () => {

  }

  return (
    <div>
      <div className='flex'>
        <Sidebar />
        <div className='h-130 p-10 rounded shadow-2xl ml-50 mt-10'>
            <p className='font-bold text-3xl mb-10'>New Meeting</p>
            <div>
                <div className='flex justify-between items-center'><span className='font-bold'>Meeting Title</span><input type='text' placeholder='E.g. Doubt Session' className='border-1 w-80 py-1 px-2 ml-2 rounded' onChange={(e) => setTitle(e.target.value)}/></div>
                <div className='flex justify-between items-center my-5'><span className='font-bold text-left'>Date</span><input type='date' className='border-1 w-80 py-1 px-2 ml-2 rounded' onChange={(e) => setDate(e.target.value)}/></div>
                <div className='flex justify-between items-center'><span className='font-bold text-left'>Time</span><input type='time' className='border-1 w-80 py-1 px-2 ml-2 rounded' onChange={(e) => setTime(e.target.value)}/></div>
                <div className='flex justify-between items-center my-5'><span className='font-bold text-left'>Location/Link</span><input type='text' placeholder='Create room Link' className='border-1 w-80 py-1 px-2 ml-2 rounded' onChange={(e) => setLink(e.target.value)}/></div>
                <div className='flex justify-between items-center mb-10'><span className='font-bold text-left'>Description</span><textarea type='text' placeholder='Add Agenda or notes' className='border-1 w-80 py-1 px-2 ml-2 rounded' onChange={(e) => setDescription(e.target.value)}/></div>
                <div className='flex justify-between'>
                <button className='border-2 py-2 px-7 rounded font-bold cursor-pointer' onClick={() => handleCancel()}>Cancel</button>
                <button className='border-2 py-2 px-7 rounded font-bold text-white bg-black cursor-pointer' onClick={() => handleSave()}>Save Meeting</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
