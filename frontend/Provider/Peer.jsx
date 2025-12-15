import React,{useMemo, createContext, useEffect, useState, useContext, useRef} from 'react'

const GlobalContext = createContext(null)

export const usePeer = () => {
  return useContext(GlobalContext)
}

export default function PeerProvider({children}) {
  const peerRef = useRef({});

  const createPeer = (email, socket, stream, onTrack) => {
    if(peerRef.current[email]) return peerRef.current[email];

    const Peer = new RTCPeerConnection({
      iceServers:[
        {urls:"stun:stun.l.google.com:19302" },
        {urls:"stun:global.stun.twilio.com:3478"}
      ]
    });

    stream.getTracks().forEach(
      track => {
        Peer.addTrack(track, stream);
      } 
    );

    Peer.ontrack = (ev) => {
      console.log("Email of User Joined:", email);
      console.log("Media Content", ev.streams[0]);
      onTrack(email, ev.streams[0])
    };

    Peer.onicecandidate = (e) => {
  if (e.candidate) {
    console.log("ICE →", email);
    socket.emit("ice-candidate", { to: email, candidate: e.candidate });
  }
};

    Peer.onnegotiationneeded = async () => {
        const offer = await Peer.createOffer();
        await Peer.setLocalDescription(offer);
        socket.emit("call-user", {email, offer});
    };

    peerRef.current[email] = Peer;
    return Peer;
  };

  const getPeer = (email) => peerRef.current[email]

  return <GlobalContext.Provider value={{createPeer, getPeer, peerRef}}>
    {children}
  </GlobalContext.Provider>
}