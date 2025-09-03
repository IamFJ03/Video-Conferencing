import React,{createContext, useMemo} from 'react'
import { io } from 'socket.io-client'

export const GlobalContext = createContext(null)

export const useSocket = () => {
  return React.useContext(GlobalContext)
}

export default function Socket({children}) {
  const socket = useMemo(() => io("http://localhost:8001"), [])
  return <GlobalContext.Provider
  value={{ socket }}
  >
    {children}
  </GlobalContext.Provider>
}
