import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../Provider/Socket";
import { usePeer } from "../Provider/Peer";

export default function Room() {
    const [myStream, setMyStream] = useState(null);
    const [remoteEmail, setRemoteEmail] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const { socket } = useSocket();
    const { Peer } = usePeer();

    const sendOffer = useCallback(async (email) => {
        if (!email) {
            console.error("Cannot send offer: Remote email is missing.");
            return;
        }

        console.log(`Manually creating and sending Offer to ${email}`);
        const offer = await Peer.createOffer();
        await Peer.setLocalDescription(offer);
        socket.emit("call-user", { email, offer });
    }, [Peer, socket]);

    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);

        stream.getTracks().forEach((track) => Peer.addTrack(track, stream));
    }, [Peer]);

    const handleNewUserJoined = useCallback(
        async ({ email }) => {
            console.log("New User ", email, " joined. Starting call process.");
            setRemoteEmail(email);
            sendOffer(email);
        },
        [sendOffer]
    );

    const handleIncomingCall = useCallback(
        async ({ from, offer }) => {
            console.log("Incoming Call from:", from);
            setRemoteEmail(from);

            await Peer.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await Peer.createAnswer();
            await Peer.setLocalDescription(answer);

            socket.emit("call-accepted", { email: from, ans: answer });
        },
        [Peer, socket]
    );

    const handleCallAccepted = useCallback(
        async ({ ans }) => {
            console.log("Call got accepted");
            await Peer.setRemoteDescription(new RTCSessionDescription(ans));
        },
        [Peer]
    );

    useEffect(() => {
        const handleNegotiation = async () => {
            console.warn("negotiationneeded for RENEGOTIATION.");
           
            if (remoteEmail) {
                await sendOffer(remoteEmail);
            } else {
                console.error("Renegotiation needed, but remoteEmail is missing.");
            }
        };

        Peer.addEventListener("negotiationneeded", handleNegotiation);
        return () => {
            Peer.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [Peer, remoteEmail, sendOffer]); 

    useEffect(() => {
        Peer.ontrack = (ev) => {
            console.log("Remote track received:", ev.streams[0]);
            setRemoteStream(ev.streams[0]);
        };
    }, [Peer]);

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

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log("Binding remoteStream to video element", remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current
                .play()
                .catch((err) => console.error("Remote video play error:", err));
        }
    }, [remoteStream]);


    return (
        <div>
            <p>This is Room Page.</p>
            <h4>You are connected to {remoteEmail}</h4>

            <video
                autoPlay
                playsInline
                muted
                ref={localVideoRef}
                style={{ width: "400px", border: "1px solid black" }}
            />

            <video
                autoPlay
                playsInline
                ref={remoteVideoRef}
                style={{ width: "400px", border: "1px solid black" }}
            />
        </div>
    );
}