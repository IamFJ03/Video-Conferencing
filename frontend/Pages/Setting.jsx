import React,{useState} from 'react';
import Sidebar from '../components/sidebar';
import axios from 'axios';
export default function Setting() {
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [contact, setContact] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0])
  }

  const handleSave = async () => {
    const token = await localStorage.getItem('token');
  const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('nickname', nickName);
    formData.append('gender', gender);
    formData.append('country', country);
    formData.append('language', language);
    formData.append('contact', contact);
    if(profilePicture)
      formData.append('profilePicture', profilePicture);
    
    const data = {};
formData.forEach((value, key) => {
  data[key] = value;
});
console.log(data);
try{
  const response = await axios.post('http://localhost:8000/api/user/saveUser', formData,{
    headers:{
      "Authorization": `Bearer ${token}`
    }
  });
  if(response.data.message==="User Updated")
    console.log("Updated:", response.data.user)
  else
    console.log("Created Succesfully", response.data.user);
}
catch(e){

}
  }

  return (
    <div>
      <div className='flex'>
        <div>
          <Sidebar />
        </div>
        <div>
          <div className='w-270 h-160 bg-white rounded-3xl shadow-2xl ml-[-50px] relative'>
            <p className='text-left text-2xl pt-5 ml-20 font-bold'>Accounts Setting</p>
            <div className='flex items-center justify-between px-20'>
            <div className=' text-left mt-10'>
              <p className='text-xl'>Edit Profile</p>
              <form className=' h-120 px-5 mt-5 rounded bg-gray-200 shadow-2xl'>
                 <p className='text-lg pt-5'>Full Name:</p>
                 <input className='rounded w-100 bg-white' value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                 <p className='mt-5 text-lg'>Nick Name:</p>
                 <input className='rounded w-100 bg-white' value={nickName} onChange={(e) => setNickName(e.target.value)}/>
                 <p className='mt-5 text-lg'>Gender:</p>
                 <input className='rounded w-100 bg-white' value={gender} onChange={(e) => setGender(e.target.value)}/>
                 <p className='mt-5 text-lg'>Country:</p>
                 <input className='rounded w-100 bg-white' value={country} onChange={(e) => setCountry(e.target.value)}/>
                 <p className='mt-5 text-lg'>Language:</p>
                 <input className='rounded w-100 bg-white' value={language} onChange={(e) => setLanguage(e.target.value)}/>
                 <p className='mt-5 text-lg'>Contact:</p>
                 <input className='rounded w-100 bg-white' value={contact} onChange={(e) => setContact(e.target.value)}/>
              </form>
            </div>
            <div>
            <form className='rounded w-110 p-10 bg-gray-200'>
                <p className='text-left text-xl'>Upload Profile Picture</p>
                <input type='file' accept='image/*' onChange={handleFileChange} />
              </form>
              <p className='text-xl mb-5 text-left'>Change Password</p>
              <form className='rounded w-110 py-10 bg-gray-200'>
                <p className='text-lg text-left px-5'>Current Password:</p>
                 <input className='rounded w-100 bg-white'/>
                 <div className='flex px-5'>
                  <div>
                 <p className='mt-5 text-lg text-left'>New Password:</p>
                 <input className='rounded w-47 bg-white'/>
                 </div>
                 <div className='ml-5'>
                 <p className='mt-5 text-lg text-left'>Confirm Password:</p>
                 <input className='rounded w-47 bg-white'/>
                 </div>
                 </div>
              </form>
            </div>
            
            </div>
            <div className='right-20 bottom-10 absolute'>
              <button className='bg-black text-white py-1 px-5 mr-5 rounded hover:cursor-pointer' onClick={() => handleSave()}>Save</button>
              <button className='bg-black text-white py-1 px-5 rounded hover:cursor-pointer'>Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
