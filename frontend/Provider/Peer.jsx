import React,{ createContext, useContext, useRef } from 'react'

const GlobalContext = createContext(null)

export const usePeer = () => useContext(GlobalContext)

export default function PeerProvider({ children }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

  return (
    <GlobalContext.Provider value={{ videoRef, streamRef }}>
      {children}
    </GlobalContext.Provider>
  )
}
