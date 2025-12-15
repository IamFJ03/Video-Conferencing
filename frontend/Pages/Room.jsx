import React, { useEffect, useCallback, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Provider/Socket";
import { usePeer } from "../Provider/Peer";
import { useUserContext } from "../Provider/UserContext";

function RemoteVideo({ stream }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return <video ref={ref} autoPlay playsInline width={400} className="rounded-2xl" />;
}

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
    setRemoteStreams(prev => ({ ...prev, [email]: stream }));

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
      if (!myStream) return;

      console.log("Existing User")
      createPeer(email, socket, myStream, handleTrack);
    },
    [createPeer, socket, myStream, handleTrack, user.email]
  );

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      if (!myStream) return;

      console.log("New User")
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
      <video ref={localVideoRef} autoPlay muted playsInline width={500} className="rounded-2xl mb-5 md:ml-[25%]" />
      <div className="flex gap-10 flex-wrap">
        {Object.entries(remoteStreams).map(([email, stream]) => (
          <RemoteVideo key={email} stream={stream} />
        ))}

      </div>
    </div>
  );
}
