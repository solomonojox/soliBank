import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuBar from '../Components/MenuBar';

import { CgLogOut } from 'react-icons/cg';
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [showNotification, setShowNotification] = useState(false)

  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();

  const [previewImg, setPreviewImg] = useState(null);
  // useEffect(() => {
  //   if (location.state) {
  //     setPreviewImg(location.state.profileImg)
  //   }
  // }, [location.state])

  useEffect(() => {
    // Fetch user details to display initially
    axios.get(`https://solibank.onrender.com/api/info?email=${location.state.email}`)
      .then(response => {
        setUser(response.data.userDto)
        setPreviewImg(response.data.userDto.profileImg);  // Preview profile image
        console.log(response.data.userDto);
      })
      .catch(error => console.error('Error fetching user data', error));
  }, [location.state.email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImg({ profileImg: file });

    // Preview the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formDataToSubmit = new FormData();
    // formDataToSubmit.append('name', formData.name);
    // formDataToSubmit.append('email', formData.email);
    // if (location.state.password) formDataToSubmit.append('password', formData.password);
    // if (location.state.profileImg) formDataToSubmit.append('profileImg', formData.profileImg);

    const updateData = {
      name,
      email,
      username,
      password,
      profileImg
    };

    try {
      const response = await axios.put(`https://solibank.onrender.com/api/profile/${location.state._id}`, updateData)
      console.log('Profile updated successfully', response.data);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleLogout = (showAlert = true) => {
    localStorage.removeItem('token');
    if(showAlert){
      alert('You have been logged out due to inactivity');
    }
    navigate('/login', {replace: true});
  };

  const handleShowNotification = () => {
    if (showNotification) {
      setShowNotification(false)
    } else{
      setShowNotification(true)
    }
  }

  return (
    <div className="profile-page px-4 ">
      {/* Menu buttons */}
      <MenuBar
        profile={<div className='flex flex-col items-center text-[12px] text-[purple] font-bold '>
          <FaUserCircle className='text-[25px] text-[purple] '/>
          Me
        </div>}
      />

      {/* Profile welcome */}
      <div className='py-4 px-1 flex justify-between items-start md:hidden bg-white ' style={{ position: 'sticky', top: 0 }}>
        <div className='flex items-center gap-1 md:hidden'>
          <img src={user.profileImg} alt='profile' className='rounded-full w-[50px] h-[50px] object-cover ' />
          <div className='w-[200px] '>
            <h3 className='text-[14px] font-bold '>{user.name}</h3>
            <p className='text-[12px] my-[-3px] text-[purple] '>account no - {user.accountNumber}</p>
            <p className='text-[12px] my-[-3px] text-[purple] '>{user.email}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='text-[purple] font-bold rounded-lg ' onClick={() => handleLogout(false)}>
            <CgLogOut className='text-[20px] ' />
            <p className='text-[6px]'>Logout</p>
          </div>
          <div className='relative'>
            <IoNotifications className='text-[purple] text-[25px] ' onClick={() => handleShowNotification()}/>
            {/* Notification box */}
            <div className={`bg-[#f1f1f1] w-[180px] rounded-b-2xl rounded-tl-2xl absolute left-[-160px] top-[30px] p-2 ${showNotification ? 'block' : 'hidden'} shadow-2xl `}> 
              <ul>
                <li><p className='text-[12px] border-b py-1 '>Solomon rejected your request</p></li>
                <li><p className='text-[12px] border-b py-1 '>Solomon rejected your request</p></li>
                <li><p className='text-[12px] border-b py-1 '>Solomon rejected your request</p></li>
                <li><p className='text-[12px] border-b py-1 '>Solomon rejected your request</p></li>
                <li><p className='text-[12px] border-b py-1 '>Solomon rejected your request</p></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2 className='text-[25px] font-medium '>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className='mt-4 flex justify-between border p-2 rounded-lg'>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder={user.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Display Account Number */}
        <div className='mt-4 flex justify-between border p-2 rounded-lg'>
          <p>Account Number:</p>
          <span>{location.state.accountNumber}</span>
        </div>

        <div className='mt-4 flex justify-between border p-2 rounded-lg'>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='mt-4 flex justify-between border p-2 rounded-lg'>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className='mt-4 flex justify-between border p-2 rounded-lg'>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            // value=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='mt-4'>
          <label>Profile Picture:</label>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
          />
          <img src={previewImg} alt="Profile Preview" className='rounded-full w-[30px] h-[30px] object-cover ' /> 
        </div>

        <button className='mt-4 mb-20 bg-[purple] p-2 rounded text-white text-[18px] ' type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;