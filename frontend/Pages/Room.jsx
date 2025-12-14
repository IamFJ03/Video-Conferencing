import React, { useEffect, useCallback, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Provider/Socket";
import { usePeer } from "../Provider/Peer";
import { useUserContext } from "../Provider/UserContext";

export default function Room() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { user } = useUserContext();
  const { createPeer, getPeer } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const localVideoRef = useRef(null);
  const joinedRef = useRef(false);

  const handleTrack = useCallback((email, stream) => {
    setRemoteStreams((prev) => {
      if (prev[email]) return prev;
      return { ...prev, [email]: stream };
    });
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  useEffect(() => {
  if (!socket) return;

  socket.on("ice-candidate", async ({ from, candidate }) => {
    const peer = getPeer(from);
    if (peer && candidate) {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  return () => {
    socket.off("ice-candidate");
  };
}, [socket, getPeer]);


  useEffect(() => {
    if (!socket || !myStream || joinedRef.current) return;

    socket.emit("join-room", {
      email: user.email,
      roomId,
    });

    joinedRef.current = true;
  }, [socket, myStream, roomId, user.email]);

  const handleUserJoined = useCallback(
    ({ email }) => {
      if (email === user.email) return;
      createPeer(email, socket, myStream, handleTrack, true);
    },
    [createPeer, socket, myStream, handleTrack, user.email]
  );

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const peer = createPeer(from, socket, myStream, handleTrack, false);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("call-accepted", { email: from, ans: answer });
    },
    [createPeer, socket, myStream, handleTrack]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      const peer = getPeer(from);
      if (!peer) return;
      await peer.setRemoteDescription(new RTCSessionDescription(ans));
    },
    [getPeer]
  );

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline width={400} />
      <div style={{ display: "flex", gap: 20 }}>
        {Object.entries(remoteStreams).map(([email, stream]) => (
          <video
            key={email}
            autoPlay
            playsInline
            ref={(el) => el && (el.srcObject = stream)}
            width={300}
          />
        ))}
      </div>
    </div>
  );
}
