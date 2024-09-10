import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        axios.post('https://solibank.onrender.com/api/users/login', {
            email,
            password,
        })
        .then((res) => {
            setMessage('Login successful!');
            setIsSuccess(true);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard', { state: res.data.userDto });
            console.log(res.data.userDto)
        })
        .catch((error) => {
            setMessage(error.response.data.message);
            setIsSuccess(false);
            console.log(error.response.data);
        });
    };

    return (
        <div className='flex items-center justify-center h-[100vh] w-[100%] bg-[#d0bbd0] '>
            <div className='flex flex-col gap-2 justify-center h-[350px] w-[300px] p-6 bg-white '>
                <h2 className='text-[30px] font-medium '>Login</h2>
                <form onSubmit={handleLogin} className='grid gap-2'>
                    <div>
                        <label>Email:</label>
                        <input
                            className='w-[250px] p-2 border '
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            className='w-[250px] p-2 border '
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className='bg-[purple] p-2 rounded text-white text-[18px] '>Login</button>
                </form>
                <p className={`text-[14px] text-[${isSuccess ? 'green' : 'red'}]`}>{message}</p>
                <p className={`text-[#666] text-[14px] ${isSuccess ? 'hidden':'block'} `}>Don't have an account? <Link to='/register' className='font-bold text-[purple]'>Sign up</Link></p>
            </div>

            <div className='md:bg-[purple] md:h-[350px] md:w-[300px] md:flex flex-col md:gap-5 md:items-center md:justify-center hidden '>
                <p className='text-white text-[20px] font-medium '>Welcome to SoliBank</p>
                <img src='./images/login.png' className='w-[200px] ' alt='img'/>
            </div>
        </div>
    );
};

export default Login;
