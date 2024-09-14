import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/password.css'
import '../Styles/isLoading.css'

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // Upload photo to Cloudinary
        let photoUrl = '';
        if (photo) {
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('upload_preset', 'solibank'); // Replace with your Cloudinary upload preset
            formData.append('cloud_name', 'dpyezce56'); // Replace with your Cloudinary cloud name

            try {
                const res = await axios.post('https://api.cloudinary.com/v1_1/dpyezce56/image/upload', formData);
                console.log(res.data.secure_url)
                photoUrl = res.data.secure_url; // Get the URL of the uploaded photo
                console.log(photoUrl);
            } catch (error) {
                console.error('Photo upload failed:', error);
                setMessage('Photo upload failed. Please try again.');
                setIsSuccess(false);
                return;
            }
            
        }
        
        // Prepare form data to send to your backend
        const registrationData = {
            name,
            username,
            email,
            password,
            profileImg: photoUrl, // Pass the Cloudinary URL to your backend
        };
        // console.log(registrationData)

        try {
            const response = await axios.post('https://solibank.onrender.com/api/users/register', registrationData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setAccountNumber(response.data.accountNumber);
            setMessage('Registration successful!');
            setIsSuccess(true);

            // Store login token
            localStorage.setItem('token', response.data.token);

            setTimeout(() => {
                navigate('/login');
            }, 1500);

            console.log('Registration successful:', response.data);
        } catch (error) {
            setMessage(error.response.data.msg);
            console.log(error.response.data)
            setIsSuccess(false);
        }
    };

    return (
        <div className='bg-[#d0bbd0] w-[100%] flex flex-col items-center justify-center p-4 '>
            {isLoading && (
                <div className='overlay'>
                <div className='spinner'></div>
                </div>
            )}
            <div className='bg-[white] p-5 md:w-[400px] '>

                <h2 className='text-[30px] font-medium mb-4 '>Register</h2>
                <form onSubmit={handleRegister} encType='multipart/form-data'>
                    <div>
                        <label>Full name:</label> <br/>
                        <input
                            className='w-[100%] p-3 bg-[#e8f0fe66] rounded mb-4 border border-[purple] '
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Username:</label><br/>
                        <input
                            className='w-[100%] p-3 bg-[#e8f0fe66] rounded mb-4 border border-[purple] '
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email:</label><br/>
                        <input
                            className='w-[100%] p-3 bg-[#e8f0fe66] rounded mb-4 border border-[purple] '
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='password'>
                        <label>Password:</label><br/>
                        <input
                            className='w-[100%] p-3 bg-[#e8f0fe66] rounded mb-4 border border-[purple] '
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='password-display opacity-65' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ?
                                <img src='../images/closed-eye-black.svg' className='w-[20px]' alt='icon' />
                                :
                                <img src='../images/opened-eye-black.svg' className='w-[20px]' alt='icon' />
                            }
                            </div>
                    </div>
                    <div>
                        <label>Photo:</label><br/>
                        <input
                            className='w-[100%] p-3 bg-[#e8f0fe66] rounded mb-4 border border-[purple] '
                            type="file"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <div className='flex items-center gap-5'>
                        <button type="submit" className='bg-[purple] py-2 px-4 text-white font-medium '>Register</button>
                        <p className={`${isSuccess ? 'hidden' : 'block'} text-[14px]`}>Already registered? <Link to='/login' className='text-[green] font-bold '>Sign in</Link></p>
                    </div>
                </form>
                {message && <p className={`text-[${isSuccess ? 'green' : 'red'}]`}>{message}</p>}
                {accountNumber && <p>Your account number: {accountNumber} <Link to='/login' className='text-[green] font-bold'>Sign in</Link></p>}
            </div>
        </div>
    );
};

export default Register;
