import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../Provider/Socket";
import { usePeer } from "../Provider/Peer";

export default function Room() {
  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const localVideoRef = useRef(null);
  const { socket } = useSocket();
  const { createPeer, getPeer } = usePeer();

  // 1️⃣ Get camera + mic
  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (err) {
      console.error("Media error:", err);
    }
  }, []);

  // 2️⃣ Store remote streams (email → stream)
  const handleTrack = useCallback((email, stream) => {
    setRemoteStreams((prev) => ({
      ...prev,
      [email]: stream,
    }));
  }, []);

  // 3️⃣ When a new user joins the room
  const handleNewUserJoined = useCallback(
    ({ email }) => {
      console.log("User joined:", email);
      if (!myStream) return;

      createPeer(email, socket, myStream, handleTrack);
    },
    [createPeer, socket, myStream, handleTrack]
  );

  
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from);
      if (!myStream) return;

      const peer = createPeer(from, socket, myStream, handleTrack);

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("call-accepted", { email: from, ans: answer });
    },
    [createPeer, socket, myStream, handleTrack]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      console.log("Call accepted by:", from);

      const peer = getPeer(from);
      if (!peer) return;

      await peer.setRemoteDescription(new RTCSessionDescription(ans));
    },
    [getPeer]
  );

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  return (
    <div>
      <h2>Group Video Room</h2>

      <video
        autoPlay
        playsInline
        muted
        ref={localVideoRef}
        style={{ width: "400px", border: "2px solid black" }}
      />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
        {Object.entries(remoteStreams).map(([email, stream]) => (
          <video
            key={email}
            autoPlay
            playsInline
            ref={(el) => el && (el.srcObject = stream)}
            style={{ width: 300, border: "2px solid red" }}
          />
        ))}
      </div>
    </div>
  );
}
