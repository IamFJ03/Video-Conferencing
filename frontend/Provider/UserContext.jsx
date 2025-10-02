import React,{useState, createContext, useContext} from 'react';

const GlobalContext = createContext(null);

export const useUserContext = () => {
    return useContext(GlobalContext)
  }

export function UserContext({children}) {
  const [user, setUser] = useState("");
  return <GlobalContext.Provider 
  value={{user, setUser}}
  >
    {children}
  </GlobalContext.Provider>
}
