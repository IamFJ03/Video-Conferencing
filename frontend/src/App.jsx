import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from '../Pages/Home'
import Room from '../Pages/Room'
import Socket from '../Provider/Socket'
import PeerProvider from '../Provider/Peer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Socket>
      <PeerProvider>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/room/:roomId' element={<Room/>} />
    </Routes>
    </PeerProvider>
    </Socket>
  )
}

export default App
