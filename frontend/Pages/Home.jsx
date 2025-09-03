import React,{useCallback, useEffect, useState} from 'react'
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
    <div className='flex-col mt-50'>
      <input type='email' value={email} onChange={e=> setEmail(e.target.value)} placeholder='Enter Email' className='border-1 p-2 px-5 bg-gray-200 rounded-2xl w-100'></input><br /><br/>
      <input type='text' value={roomId} onChange={e=> setRoomId(e.target.value)} placeholder='Enter Room Id' className='border-1 p-2 px-5 bg-gray-200 rounded-2xl w-100'></input><br /><br/>
      <button type='button' className='px-15 py-3 bg-gray-200 rounded hover:cursor-pointer hover:border-1' onClick={handleJoinRoom}>Enter Room</button>
    </div>
  )
}
