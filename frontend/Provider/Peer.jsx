import React,{useMemo, createContext, useEffect, useState} from 'react'

const GlobalContext = createContext(null)

export const usePeer = () => {
  return React.useContext(GlobalContext)
}

export default function PeerProvider({children}) {
  const [remoteStream, setRemoteStream] = useState(null)
  
  const Peer = useMemo(
    () => 
        new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ]
  }),[])

  const createOffer = async () => {
    const offer = await Peer.createOffer();
    await Peer.setLocalDescription(offer);
    return offer;
  }

  const createAnswer = async (offer) => {
    await Peer.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await Peer.createAnswer();
    await Peer.setLocalDescription(answer)
    return answer
  }

  const setRemoteAnswer = async(ans) => {
    await Peer.setRemoteDescription(new RTCSessionDescription(ans));
  }

  const sendStream = async (stream) => {
  if (!stream) return;

  stream.getTracks().forEach(track => {
    const alreadyAdded = Peer.getSenders().some(sender => sender.track === track);
    if (!alreadyAdded) {
      Peer.addTrack(track, stream);
    }
  });
};


  const handleTrackEvent = (ev) => {
      const streams = ev.streams
      setRemoteStream(streams[0])
    }
  
  

  useEffect(() => {
    Peer.addEventListener('track', handleTrackEvent)
    

    return () => {
      Peer.removeEventListener('track', handleTrackEvent)
    }
  })
  return <GlobalContext.Provider value={{Peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream, setRemoteStream}}>
    {children}
  </GlobalContext.Provider>
}
