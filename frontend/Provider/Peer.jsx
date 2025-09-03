import React,{useMemo, createContext} from 'react'

const GlobalContext = createContext(null)

export const usePeer = () => {
  return React.useContext(GlobalContext)
}

export default function PeerProvider({children}) {
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
    await Peer.setRemoteDescription(offer)
    const answer = await Peer.createAnswer();
    await Peer.setLocalDescription(answer)
    return answer
  }

  const setRemoteAnswer = async(ans) => {
    await Peer.setRemoteDescription(ans);
  }
  return <GlobalContext.Provider value={{Peer, createOffer, createAnswer, setRemoteAnswer}}>
    {children}
  </GlobalContext.Provider>
}
