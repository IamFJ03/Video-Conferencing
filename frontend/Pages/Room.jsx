import React, { useEffect } from 'react'
import { useSocket } from '../Provider/Socket'
import { usePeer} from '../Provider/Peer';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
export default function Room() {
    const {socket} = useSocket()
    const { Peer, createOffer, createAnswer, setRemoteAnswer} = usePeer()

    const handleNewUserJoined = useCallback(async ({email}) =>{
        console.log("New User ", email," joined")
        const offer = await createOffer();
        socket.emit("call-user",{email, offer})
    },[createOffer, socket])

    const handleIncomingCall = useCallback(async (data) => {
      const {from, offer} = data
      console.log("Incoming Call from:", from, offer)
      const ans = await createAnswer(offer)
      socket.emit("call-accepted",{ email: from, ans})
    }, [createAnswer, socket])

    const handleCallAccepted = useCallback(async (data) => {
      const {ans} = data
      console.log("Call got accepted", ans)
      await setRemoteAnswer(ans)

    }, [setRemoteAnswer])
    useEffect(() => {
        socket.on("user-joined", handleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall)
        socket.on("call-accepted", handleCallAccepted)

        return () => {
          socket.off('user-joined', handleNewUserJoined)
          socket.off('incoming-call', handleIncomingCall)
          socket.off('call-accepted', handleCallAccepted)
        }
    },[socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted])
  return (
    <div>
      <p>This is Room Page.</p>
    </div>
  )
}
