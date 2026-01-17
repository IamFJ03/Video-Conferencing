import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react"
import { useSocket } from "../Provider/Socket";
import { useUserContext } from "../Provider/UserContext";
import { useNavigate } from "react-router-dom";

export default function Room() {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [remoteStreams, setRemoteStreams] = useState({});
  const peersRef = useRef({});
  const [vid, setVid] = useState(true);
  const [mic, setMic] = useState(true);
  const myStreamRef = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const mediaReadyRef = useRef(null);
  const { user } = useUserContext()

  const localVideoRef = useRef(null);

  useEffect(() => {
    mediaReadyRef.current = navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myStreamRef.current = stream;
        setMyStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
        return stream;
      })
      .catch(console.error);
  }, []);

  const createPeer = useCallback((email) => {
    if (peersRef.current[email]) return peersRef.current[email];

    console.log("Creating Peer for", email);

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ],
    });

    pc.ontrack = (ev) => {
      console.log("ONTRACK FIRED from", email);
      setRemoteStreams((prev) => ({
        ...prev,
        [email]: ev.streams[0],
      }));
    };

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        socket.emit("ice-candidate", {
          to: email,
          candidate: ev.candidate,
        });
      }
    };

    peersRef.current[email] = pc;
    return pc;
  }, [socket]);

  const handleUserJoined = useCallback(async ({ email }) => {
    console.log("User joined:", email);

    const stream = await mediaReadyRef.current;
    const pc = createPeer(email);

    stream.getTracks().forEach((track) => {
      console.log("TRACK ADDED", track.kind, "to", email);
      pc.addTrack(track, stream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", { email, offer });
  }, [createPeer, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from", from);

      const stream = await mediaReadyRef.current;
      const pc = createPeer(from);

      await pc.setRemoteDescription(offer);

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call-accepted", {
        email: from,
        ans: answer,
      });
    },
    [createPeer, socket]
  );

  const handleCallAccepted = useCallback(async ({ from, ans }) => {
    console.log("Call accepted by", from);
    const pc = peersRef.current[from];
    if (!pc) return;
    await pc.setRemoteDescription(ans);
  }, []);

  const handleUserLeft = (email) => {
    const pc = peersRef.current[email];
    if(pc){
      pc.close();
      delete peersRef.current[email];
    }

    setRemoteStreams(prev => {
      const updated = {...prev};
      delete updated[email];
      return updated;
    })
  }

  const handleIceCandidate = useCallback(
    async ({ from, candidate }) => {
      const pc = peersRef.current[from];
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    },
    []
  );

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("userLeft", handleUserLeft);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleUserLeft,
    handleIceCandidate,
  ]);

  const handleEndCall = () => {
    Object.entries(peersRef.current).forEach(([email, pc]) => {
      pc.close();
      delete peersRef.current[email];
    });


    setRemoteStreams({});
    socket.emit("user-left", {email: user.email});

    navigate('/join-meeting')
  }

  const toggleMic = () => {
    const track = myStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMic(track.enabled);
    }
  }

  const toggleVideo = () => {
    const track = myStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVid(track.enabled);
    }
  }

  return (
    <div>
      <h2>Room</h2>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="rounded-2xl md:ml-[30%] mb-10"
        style={{ width: "400px" }}
      />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {Object.entries(remoteStreams).map(([email, stream]) => (
          <video
            key={email}
            autoPlay
            playsInline
            ref={(el) => el && (el.srcObject = stream)}
            className="rounded-2xl ml-[10%] md:ml-0"
            style={{ width: "300px" }}
          />
        ))}
      </div>
      <div className="flex items-center gap-10 mt-5 justify-center">
        <div className="bg-red-500 w-fit p-3 rounded-full cursor-pointer hover:bg-red-700 transition-all duration-500">
          <PhoneOff size={30} color="white" onClick={handleEndCall} />
        </div>
        <div className="bg-gray-200 w-fit p-3 rounded-full cursor-pointer" onClick={toggleVideo}>
          {
            vid
              ?
              <Video size={30} color="black" />
              :
              <VideoOff size={30} color="black" />
          }
        </div>
        <div className="bg-gray-200 w-fit p-3 rounded-full cursor-pointer" onClick={toggleMic}>
          {
            mic
              ?
              <Mic size={30} color="black" />
              :
              <MicOff size={30} color="black" />
          }
        </div>
      </div>
    </div>
  );
}
