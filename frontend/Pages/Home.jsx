import React,{useCallback, useEffect, useRef, useState} from 'react';
import Sidebar from '../components/sidebar';
import { useSocket } from '../Provider/Socket';
import { useNavigate} from 'react-router-dom';

export default function Home() {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [myStream, setMyStream] = useState(null);
  const videoRef = useRef(null);

  const {socket} = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
     let currentStream = null;
     const fetchStream = async () => {
      try{
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        currentStream = stream;

        if(videoRef.current)
          videoRef.current.srcObject = currentStream
      }
      catch(e){
console.error("Error accessing media devices:", e);
      }
     } 

     fetchStream();

     return () => {
      if(currentStream)
        currentStream.getTracks().forEach(track => track.stop());
     };
  },[]);

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
      <video
autoPlay
playsInline
muted
ref={videoRef}
className='w-100 h-100 border-1 mt-30 rounded shadow-xl'
      />
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
