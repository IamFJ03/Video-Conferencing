import React,{useCallback, useEffect, useState} from 'react';
import Sidebar from '../components/sidebar';
import { useSocket } from '../Provider/Socket'
import { useNavigate} from 'react-router-dom'
export default function Home() {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const {socket} = useSocket()
  const navigate = useNavigate()
  const handleJoinRoom = () => {
    socket.emit('join-room',{email, roomId})
  }
 
  const handleJoinedRoom = useCallback(({email, roomId}) =>{
      navigate(`/room/${roomId}`)
  }, [navigate])

  useEffect(() => {
      socket.on("Joined-room", handleJoinedRoom)

      return () => {
        socket.off('Joined-room', handleJoinedRoom)
      }
  },[])
  return (
    
    <div>
      <div className='flex'>
      <Sidebar />
      <div className='mt-30 ml-50 shadow-2xl h-100 p-10 rounded'>
      <p className='font-bold text-3xl my-5'>Join Meeting</p>
      <input type='email' value={email} onChange={e=> setEmail(e.target.value)} placeholder='Enter Email' className='border-1 p-2 px-5 rounded w-100'></input><br /><br/>
      <input type='text' value={roomId} onChange={e=> setRoomId(e.target.value)} placeholder='Enter Room Id' className='border-1 p-2 px-5  rounded w-100'></input><br /><br/>
      <button type='button' className='px-15 py-3 bg-black text-white rounded hover:cursor-pointer hover:border-1' onClick={handleJoinRoom}>Join Room</button>
      <p className='text-left font-bold text-gray-600 my-5'>Turn Off Microphone</p>
      <p className='text-left font-bold text-gray-600'>Turn Off Camera</p>
      </div>
      </div>
    </div>
  )
}
