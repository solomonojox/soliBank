import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuBar from '../Components/MenuBar';
import '../Styles/isLoading.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  // const [error, setError] = useState('')

  const location = useLocation();
  const navigate = useNavigate();
  let timeoutId;

  useEffect(() => {
    setIsLoading(true)
    axios.get(`https://solibank.onrender.com/api/info?email=${location.state.email}`)
      .then(response => {
        setUser(response.data.userDto)
        setProfileImg(response.data.userDto.profileImg);
      })
      .catch(error => {
        console.error('Error fetching user data', 
          // error
        )
      })
      .finally(() => {
        setIsLoading(false)
      }
      )
  }, [location.state.email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImg({ profileImg: file });

    // Preview the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImg(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault()
    setShowPasswordPopup(true)
  }

  const handlePasswordPopupSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      name,
      email,
      username,
      password,
      profileImg,
      currentPassword
    };

    try {
      const response = await axios.put(`https://solibank.onrender.com/api/profile/${location.state._id}`, updateData)
      console.log('Profile updated successfully', response.data);
      alert('Profile updated successfully');
      setShowPasswordPopup(false);
    } catch (error) {
      console.error('Error updating profile', error);
      alert(error.response.data.message);
      // setError(error.response.data.message)
    }
  };

  const handleLogout = (showAlert = true) => {
    localStorage.removeItem('token');
    if(showAlert){
      alert('You have been logged out due to inactivity');
    }
    navigate('/login', {replace: true});
  };

  // Reset the inactivity timer
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleLogout, 1800000000);
  };

  // Set up event listeners to detect user activity
  const setupInactivityTimer = () => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
  };

  useEffect(() => {
    // Initialize the inactivity timer when component mounts
    resetTimer();
    setupInactivityTimer();

    // Cleanup event listeners and timer when component unmounts
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  });

  const handleShowNotification = () => {
    if (showNotification) {
      setShowNotification(false)
    } else{
      setShowNotification(true)
    }
  }

  return (
    <div className="profile-page px-4 ">
      {isLoading && (
        <div className='overlay'>
          <div className='spinner'></div>
        </div>
      )}
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

      <h2 className='text-[25px] font-medium '>Profile Details</h2>
      <div>
        <div className='flex justify-between p-1 '>
          <p>Name:</p>
          <span>{user.name}</span>
        </div>
        <div className='flex justify-between p-1 '>
          <p>Username:</p>
          <span>{user.username}</span>
        </div>
        <div className='flex justify-between p-1 '>
          <p>Email:</p>
          <span>{user.email}</span>
        </div>
        <div className='flex justify-between p-1 '>
          <p>Account Number:</p>
          <span>{location.state.accountNumber}</span>
        </div>
      </div>

      {/* Update */}
      <h2 className='text-[25px] font-medium mt-5 '>Update Profile</h2>
      <form id='profileForm'>
        <div className='mt-4 px-2 flex items-center justify-between border rounded-lg'>
          <label htmlFor='name'>Name:</label>
          <input
            className='outline-none p-2'
            type="text"
            name="name"
            autoComplete='name'
            placeholder={user.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='mt-4 px-2 flex items-center justify-between border rounded-lg'>
          <label htmlFor='email'>Email:</label>
          <input
            className='outline-none p-2'
            type="email"
            name="email"
            autoComplete='email'
            value={user.email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='mt-4 px-2 flex items-center justify-between border rounded-lg'>
          <label htmlFor='username'>Username:</label>
          <input
            className='outline-none p-2'
            type="text"
            name="username"
            autoComplete='username'
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className='mt-4 px-2 flex items-center justify-between border rounded-lg'>
          <label htmlFor='password'>Password:</label>
          <input
          className='outline-none p-2'
            type="password"
            name="password"
            autoComplete='password'
            // value=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='profileImg'>Profile Picture:</label>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
          />
          <img src={profileImg} alt="Profile Preview" className='rounded-full w-[30px] h-[30px] object-cover mt-2' /> 
        </div>

        <button className='mt-4 mb-20 bg-[purple] p-2 rounded text-white text-[18px] ' onClick={handleUpdateClick}>Update Profile</button> 
      </form>

      <div>
        {/* Password Popup */}
        {showPasswordPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Enter Current Password</h3>
              {/* {error && <p className="text-red-500 mb-2">{error}</p>} */}
              <form onSubmit={handlePasswordPopupSubmit}>
                <div className="mt-4 flex flex-col">
                  <label htmlFor="currentPassword">Current Password:</label>
                  <input
                    className="outline-none p-2 border rounded mt-1"
                    type="password"
                    name="currentPassword"
                    autoComplete="current-password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="flex mt-6">
                  <button
                    className="bg-[purple] p-2 rounded text-white text-[18px] mr-2"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    className="bg-gray-500 p-2 rounded text-white text-[18px]"
                    type="button"
                    onClick={() => setShowPasswordPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;