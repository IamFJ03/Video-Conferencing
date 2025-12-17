import React, { createContext, useContext, useRef } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext(null);

export const useSocket = () => useContext(GlobalContext);

export default function Socket({ children }) {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io("http://localhost:8001", {
      transports: ["websocket"],
    });
  }

  return (
    <GlobalContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </GlobalContext.Provider>
  );
}
