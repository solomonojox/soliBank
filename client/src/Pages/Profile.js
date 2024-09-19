import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuBar from '../Components/MenuBar';

import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    profileImg: ''
  });

  // const navigate = useNavigate();
  const location = useLocation();

  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    // Fetch user details to display initially
    axios.get(`http://localhost:5000/api/info?email=${location.state.email}`)
      .then(response => {
        setFormData({
          name: response.data.userDto.name,
          email: response.data.userDto.email,
          username: response.data.userDto.username,
          password: response.data.userDto.password,
          profileImg: response.data.userDto.profileImg
        });
        setPreviewImg(response.data.userDto.profileImg);  // Preview profile image
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching user data', error));
  }, [location.state.email]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImg: file });

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

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    if (formData.password) formDataToSubmit.append('password', formData.password);
    if (formData.profileImg) formDataToSubmit.append('profileImg', formData.profileImg);

    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${location.state._id}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
            placeholder={formData.name} 
            onChange={handleInputChange}
          />
        </div>

        {/* Display Account Number */}
        <p>Account Number: {location.state.accountNumber}</p>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder={formData.username}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            // value=""
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
          />
          <img src={previewImg} alt="Profile Preview" width="100" />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;