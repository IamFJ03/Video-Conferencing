import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { useUserContext } from '../Provider/UserContext';
import { UserCircle2Icon, MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [userData, setUserData] = useState({});
  const { user } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/fetchData`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.message === 'User Data Fetched') {
          setUserData(response.data.user);
        }
      } catch (e) {}
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {userData.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/profile-picture/${userData.profilePicture}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserCircle2Icon size={56} />
              )}
              <div>
                <p className="font-bold text-lg">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <Link
              to="/setting"
              className="bg-black text-white px-5 py-2 rounded text-center"
            >
              Edit Profile
            </Link>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Info label="Full Name" value={userData.fullName} />
            <Info label="Nick Name" value={userData.nickName} />
            <Info label="Gender" value={userData.gender} />
            <Info label="Country" value={userData.country} />
            <Info label="Language" value={userData.language} />
            <Info label="Contact No" value={userData.contact} />
          </div>

          {/* Email Section */}
          <div>
            <p className="text-xl font-bold mb-4">My Email Address</p>
            <div className="flex items-center gap-3 mb-4">
              <MailIcon size={28} />
              <p>{user.email}</p>
            </div>
            <button className="bg-black text-white px-5 py-2 rounded">
              Update Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <input
        disabled
        value={value ?? 'N/A'}
        className="w-full bg-gray-200 rounded px-4 py-2 text-gray-600"
      />
    </div>
  );
}
