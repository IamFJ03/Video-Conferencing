import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { useSocket } from "../Provider/Socket";

export default function Room() {
  const { socket } = useSocket();

  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const myStreamRef = useRef(null);
  const mediaReadyRef = useRef(null);
  const peersRef = useRef({});

  const localVideoRef = useRef(null);

  useEffect(() => {
    mediaReadyRef.current = navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myStreamRef.current = stream;
        setMyStream(stream);
        return stream;
      })
      .catch(console.error);
  }, []);

  const createPeer = useCallback((email) => {
    if (peersRef.current[email]) return peersRef.current[email];

    console.log("Creating Peer for", email);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleIceCandidate,
  ]);

  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

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
    </div>
  );
}
