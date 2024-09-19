import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuBar from '../Components/MenuBar';

import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(null);

  // const navigate = useNavigate();
  const location = useLocation();

  const [previewImg, setPreviewImg] = useState(null);
  // useEffect(() => {
  //   if (location.state) {
  //     setPreviewImg(location.state.profileImg)
  //   }
  // }, [location.state])

  useEffect(() => {
    // Fetch user details to display initially
    axios.get(`http://localhost:5000/api/info?email=${location.state.email}`)
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
      const response = await axios.put(`http://localhost:5000/api/profile/${location.state._id}`, updateData)
      console.log('Profile updated successfully', response.data);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="profile-page">
      {/* Menu buttons */}
      <MenuBar
        profile={<div className='flex flex-col items-center text-[12px] text-[purple] font-bold '>
          <FaUserCircle className='text-[25px] text-[purple] '/>
          Me
        </div>}
      />
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder={user.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Display Account Number */}
        <p>Account Number: {location.state.accountNumber}</p>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            // value=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
          />
          <img src={user.profileImg} alt="Profile Preview" width="100" /> 
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;