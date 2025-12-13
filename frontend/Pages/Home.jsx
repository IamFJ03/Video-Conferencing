import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../components/sidebar';
import { useSocket } from '../Provider/Socket';
import { useUserContext } from '../Provider/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Video, Mic, VideoOff, MicOff } from 'lucide-react';

export default function Home() {
  const { user } = useUserContext();
  const location = useLocation();
  const { code } = location.state || {};

  const [email] = useState(user.email || '');
  const [roomId, setRoomId] = useState(code || '');
  const [microphone, setMicrophone] = useState(true);
  const [vid, setVid] = useState(true);
  const [myStream, setMyStream] = useState(null);
  const videoRef = useRef(null);

  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error('Media error:', e);
      }
    };
    fetchStream();
  }, []);

  const handleJoinRoom = () => socket.emit('join-room', { email, roomId });

  const handleJoinedRoom = useCallback(({ roomId }) => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    socket.on('Joined-room', handleJoinedRoom);
    return () => socket.off('Joined-room', handleJoinedRoom);
  }, [socket, handleJoinedRoom]);

  const handleCamera = () => {
    if (!myStream) return;
    const track = myStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVid(track.enabled);
    }
  };

  const handleMicrophone = () => {
    if (!myStream) return;
    const track = myStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicrophone(track.enabled);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Video Preview */}
          <div className="flex flex-col items-center">
            <video
              autoPlay
              playsInline
              muted
              ref={videoRef}
              className="w-full max-w-md aspect-video rounded-xl shadow-xl bg-black"
            />

            <div className="flex gap-6 mt-6">
              <button
                onClick={handleCamera}
                className="bg-white p-3 rounded-full shadow"
              >
                {vid ? <Video size={28} /> : <VideoOff size={28} />}
              </button>

              <button
                onClick={handleMicrophone}
                className="bg-white p-3 rounded-full shadow"
              >
                {microphone ? <Mic size={28} /> : <MicOff size={28} />}
              </button>
            </div>
          </div>

          {/* Join Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Join Meeting</h1>

            <input
              type="email"
              value={email || 'Login Required'}
              disabled
              className="w-full mb-4 p-2 rounded bg-gray-100 text-gray-600"
            />

            <input
              type="text"
              value={roomId}
              onChange={e => !code && setRoomId(e.target.value)}
              disabled={!!code}
              placeholder="Enter Room ID"
              className="w-full mb-6 p-2 rounded border"
            />

            <button
              onClick={handleJoinRoom}
              className="w-full bg-black text-white py-3 rounded font-semibold mb-6"
            >
              Join Room
            </button>

            <div className="space-y-3 text-sm font-medium text-gray-700">
              <label className="flex items-center justify-between">
                Turn On Microphone
                <input type="checkbox" checked={microphone} onChange={handleMicrophone} />
              </label>
              <label className="flex items-center justify-between">
                Turn On Camera
                <input type="checkbox" checked={vid} onChange={handleCamera} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
