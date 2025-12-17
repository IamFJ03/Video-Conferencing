import React,{ createContext, useContext, useRef } from 'react'

const GlobalContext = createContext(null)

export const usePeer = () => useContext(GlobalContext)

export default function PeerProvider({ children }) {
    const Peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

  return (
    <GlobalContext.Provider value={{ Peer }}>
      {children}
    </GlobalContext.Provider>
  )
}
