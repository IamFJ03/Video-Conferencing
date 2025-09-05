import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../Provider/Socket'
import { usePeer } from '../Provider/Peer';

export default function Room() {
  const [myStream, setMyStream] = useState(null)
  const [remoteEmail, setRemoteEmail] = useState(null)

  const { socket } = useSocket()
  const { Peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream, setRemoteStream } = usePeer()

  // --- socket event handlers ---
  const handleNewUserJoined = useCallback(async ({ email }) => {
    console.log("New User ", email, " joined")
    const offer = await createOffer();
    socket.emit("call-user", { email, offer })
    setRemoteEmail(email)
  }, [createOffer, socket])

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data
    console.log("Incoming Call from:", from)
    const ans = await createAnswer(offer)
    socket.emit("call-accepted", { email: from, ans })
    setRemoteEmail(from)
  }, [socket, createAnswer])

  const handleCallAccepted = useCallback(async (data) => {
    const { ans } = data
    console.log("Call got accepted", ans)
    await setRemoteAnswer(ans)
  }, [setRemoteAnswer])

  const handleNegotiation = () => {
    const localOffer = Peer.localDescription
    socket.emit('call-user', { email: remoteEmail, offer: localOffer })
  }

  // --- local media setup ---
  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    setMyStream(stream)
    sendStream(stream)   // attach tracks immediately
  }, [sendStream])

  // --- socket listeners ---
  useEffect(() => {
    console.log("Attaching socket listeners", socket.id);

    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleCallAccepted, handleIncomingCall])

  // --- init local stream ---
  useEffect(() => {
    getUserMediaStream()
  }, [])

  // --- negotiationneeded ---
  useEffect(() => {
    Peer.addEventListener('negotiationneeded', handleNegotiation)
    return () => {
      Peer.removeEventListener('negotiationneeded', handleNegotiation)
    }
  })

  // --- remote stream setup ---
  
  return (
    <div>
      <p>This is Room Page.</p>
      <h4>You are connected to {remoteEmail}</h4>

      <video
        autoPlay
        playsInline
        muted   // local video muted to avoid echo
        ref={videoRef => {
          if (videoRef && myStream) {
            videoRef.srcObject = myStream;
          }
        }}
        style={{ width: "400px", border: "1px solid black" }}
      />

      <video
        autoPlay
        playsInline
        ref={videoRef => {
          if (videoRef && remoteStream) {
            videoRef.srcObject = remoteStream;
          }
        }}
        style={{ width: "400px", border: "1px solid black" }}
      />
    </div>
  )
}
