import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../Provider/Socket";
import { usePeer } from "../Provider/Peer";

export default function Room() {
    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    const localVideoRef = useRef(null);
    const { socket } = useSocket();
    const { Peer } = usePeer();

    const getUserMediaStream = async () => {
        const stream = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setMyStream(stream);
    }

    const handleTrack = useCallback((email, stream) => {
        setRemoteStreams(prev => ({
            ...prev,
            [email]: stream
        }));
    }, []);

    const handleNewUserJoined = useCallback(
        async ({ email }) => {
            console.log("New User ", email, " joined. Starting call process.");
            createPeer(email, socket, myStream, handleTrack);
        },
        [createPeer, socket, myStream, handleTrack]
    );

    const handleIncomingCall = useCallback(
        async ({ from, offer }) => {
            console.log("Incoming Call from:", from);
            createPeer(email, socket, myStream, handleTrack);

            await Peer.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await Peer.createAnswer();
            await Peer.setLocalDescription(answer);

            socket.emit("call-accepted", { email: from, ans: answer });
        },
        [createPeer, socket, myStream, handleTrack]
    );

    const handleCallAccepted = useCallback(
        async ({ ans, from }) => {
            console.log("Call got accepted");
            const peer = getPeer(from);
            if (!peer) return;

            await Peer.setRemoteDescription(new RTCSessionDescription(ans));
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
            <h3>Group Video Room</h3>

            <video
                autoPlay
                playsInline
                muted
                ref={localVideoRef}
                style={{ width: "400px", border: "1px solid black" }}
            />

            <div className="flex flex-wrap gap-10">
                {Object.entries(remoteStreams).map(([email, stream]) => (
                    <video
                        key={email}
                        autoPlay
                        playsInline
                        ref={(el) => el && (el.srcObject = stream)}
                        style={{ width: 300, border: "1px solid red" }}
                    />
                ))}
            </div>
        </div>
    );
}