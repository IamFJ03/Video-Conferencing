import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import { useSocket } from "../Provider/Socket";
import { useUserContext } from "../Provider/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Video, Mic, VideoOff, MicOff } from "lucide-react";

export default function Home() {
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const {socket} = useSocket();

  const { code } = location.state || {};
  const [roomId, setRoomId] = useState(code || "");
  const [myStream, setMyStream] = useState(null);
  const [vid, setVid] = useState(true);
  const [mic, setMic] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Media error:", err);
      }
    };
    fetchStream();
  }, []);

  const toggleVideo = () => {
    const track = myStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVid(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = myStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMic(track.enabled);
    }
  };

  const handleJoin = () => {
    socket.emit("join-room", { email: user.email, roomId });
  };
  const handleJoinedRoom = useCallback(({roomId}) => {
    navigate(`/room/${roomId}`)
  }, [navigate]);

  useEffect(() => {
    socket.on("joined-room", handleJoinedRoom);
    return () => socket.off("joined-room", handleJoinedRoom)
  }, [socket, handleJoinedRoom])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="flex flex-col items-center">
            <video
              autoPlay
              muted
              playsInline
              ref={videoRef}
              className="w-full max-w-md rounded-xl bg-black"
            />

            <div className="flex gap-6 mt-6">
              <button onClick={toggleVideo}>
                {vid ? <Video /> : <VideoOff />}
              </button>
              <button onClick={toggleMic}>
                {mic ? <Mic /> : <MicOff />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow relative">
            <h1 className="text-2xl font-bold mb-4">Join Room</h1>

            <input
              value={user.email ? user.email : "Login required"}
              disabled
              className="w-full mb-4 p-2 bg-gray-100 text-gray-500"
            />

            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="w-full mb-4 p-2 border"
            />

            <button
              onClick={handleJoin}
              className="w-full bg-black text-white py-3 rounded"
            >
              Join
            </button>
            <div className="text-left ml-2 my-7">
            <p>Turn Audio On<input type="checkbox" className="ml-10" onClick={toggleMic} checked={mic}/></p>
            <p className="mt-5">Turn Video On<input type="checkbox" className="ml-10" onClick={toggleVideo} checked={vid}/></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
