import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Authentication from '../Pages/Authentication';
import Verification from '../Pages/Verification';
import Dashboard from '../Pages/Dashboard';
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
          <Route path='/' element={<Authentication />} />
          <Route path='/verification' element={<Verification />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </PeerProvider>
    </Socket>
  )
}

export default App
