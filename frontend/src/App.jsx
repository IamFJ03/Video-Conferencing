import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Authentication from '../Pages/Authentication';
import Verification from '../Pages/Verification';
import Dashboard from '../Pages/Dashboard';
import Home from '../Pages/Home';
import Room from '../Pages/Room';
import Profile from '../Pages/Profile';
import Schedule from '../Pages/Schedule';
import Socket from '../Provider/Socket'
import PeerProvider from '../Provider/Peer'
import {UserContext} from '../Provider/UserContext';
function App() {
  
  return (
    <Socket>
      <PeerProvider>
        <UserContext>
          <Routes>
            <Route path='/' element={<Authentication />} />
            <Route path='/verification' element={<Verification />} />
            <Route path='/join-meeting' element={<Home />} />
            <Route path='/home' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/room/:roomId' element={<Room />} />
          </Routes>
        </UserContext>
      </PeerProvider>
    </Socket>
  )
}

export default App
