import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../Provider/Socket'
import { usePeer } from '../Provider/Peer';

export default function Room() {
  const [myStream, setMyStream] = useState(null)
  const { socket } = useSocket()
  const { createOffer, createAnswer, setRemoteAnswer } = usePeer()

  const handleNewUserJoined = useCallback(async ({ email }) => {
    console.log("New User ", email, " joined")
    const offer = await createOffer();
    socket.emit("call-user", { email, offer })
  }, [createOffer, socket])

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data
    console.log("Incoming Call from:", from, offer)
    const ans = await createAnswer(offer)
    socket.emit("call-accepted", { email: from, ans })
  },[socket, createAnswer])

  const handleCallAccepted = useCallback(async (data) => {
    const { ans } = data
    console.log("Call got accepted", ans)
    await setRemoteAnswer(ans)
  }, [setRemoteAnswer])

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    setMyStream(stream)
  }, [handleNewUserJoined, handleIncomingCall, handleCallAccepted, socket])

  useEffect(() => {
  console.log("Attaching socket listeners", socket.id);

  socket.on("user-joined", handleNewUserJoined);
  console.log("Client socket ID:", socket.id);
  socket.on("incoming-call", handleIncomingCall);
  socket.on("call-accepted", handleCallAccepted);

  return () => {
    
    socket.off("incoming-call", handleIncomingCall);
    socket.off("call-accepted", handleCallAccepted);
  };
  
}, [socket, handleNewUserJoined, handleCallAccepted, handleIncomingCall]);

useEffect(() => {
getUserMediaStream()
},[])
  return (
    <div>
      <p>This is Room Page.</p>

      <video
        autoPlay
        playsInline
        muted
        ref={videoRef => {
          if (videoRef && myStream) {
            videoRef.srcObject = myStream;
          }
        }}
        style={{ width: "400px", border: "1px solid black" }}
      />
    </div>
  )
}
