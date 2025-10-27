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
    
     const fetchStream = async () => {
      try{
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        setMyStream(stream);

        if(videoRef.current)
          videoRef.current.srcObject = stream;
      }
      catch(e){
console.error("Error accessing media devices:", e);
      }
     } 

     fetchStream();

     
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

const handleCamera = useCallback(() => {

  if(myStream){
    const videoTrack = myStream.getVideoTracks()[0];
    if(videoTrack){
      videoTrack.enabled = !videoTrack.enabled;
    }
  }
},[myStream])

const handleMicrophone = useCallback(() => {
    if(myStream){
      const audioTrack = myStream.getAudioTracks()[0];
      if(audioTrack){
        audioTrack.enabled = !audioTrack.enabled
      }
    }
},[myStream])

  return (
    
    <div>
      <div className='flex'>
      <Sidebar />
      <video
autoPlay
playsInline
muted
ref={videoRef}
className='w-100 h-80 mt-40 rounded shadow-xl'
      />
      <div className='mt-30 ml-50 shadow-2xl h-100 p-10 rounded'>
      <p className='font-bold text-3xl my-5'>Join Meeting</p>
      <input type='email' value={email} onChange={e=> setEmail(e.target.value)} placeholder='Enter Email' className='border-1 p-2 px-5 rounded w-100'></input><br /><br/>
      <input type='text' value={roomId} onChange={e=> setRoomId(e.target.value)} placeholder='Enter Room Id' className='border-1 p-2 px-5  rounded w-100'></input><br /><br/>
      <button type='button' className='px-15 py-3 bg-black text-white rounded hover:cursor-pointer hover:border-1' onClick={handleJoinRoom}>Join Room</button>
      <p className='text-left font-bold text-gray-600 my-5'>Turn Off Microphone<input type='checkbox' onClick={handleMicrophone} className='absolute right-30 h-4 w-4'></input> </p>
      <p className='text-left font-bold text-gray-600'>Turn Off Camera<input type='checkbox' onClick={handleCamera} className='absolute right-30 h-4 w-4'></input></p>
      </div>
      </div>
    </div>
  )
}
