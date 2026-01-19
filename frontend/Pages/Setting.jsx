import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import axios from 'axios';

export default function Setting() {
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [contact, setContact] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => setProfilePicture(e.target.files[0]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('nickname', nickName);
    formData.append('gender', gender);
    formData.append('country', country);
    formData.append('language', language);
    formData.append('contact', contact);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/saveUser`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <div className="space-y-3">
                <Input label="Full Name" value={fullName} setValue={setFullName} />
                <Input label="Nick Name" value={nickName} setValue={setNickName} />
                <Input label="Gender" value={gender} setValue={setGender} />
                <Input label="Country" value={country} setValue={setCountry} />
                <Input label="Language" value={language} setValue={setLanguage} />
                <Input label="Contact" value={contact} setValue={setContact} />
              </div>
            </div>

            {/* Security */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-3">
                  <input className="w-full rounded p-2" placeholder="Current Password" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="rounded p-2" placeholder="New Password" />
                    <input className="rounded p-2" placeholder="Confirm Password" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Save
            </button>
            <button className="bg-gray-300 px-6 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded p-2"
      />
    </div>
  );
}
