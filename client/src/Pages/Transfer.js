import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Styles/isLoading.css'

function Transfer() {
  const [toAccount, setToAccount] = useState('');
  const [receiverName, setReceiverName] = useState('')
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  let timeoutId;
//   console.log(location.state)

  useEffect(() =>{
    if (toAccount.length >= 9){
      const fetchReceiversDetails = async () => {
        try {
          const response = await axios({
            url: `https://solibank.onrender.com/api/account?accountNumber=${toAccount}`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          setReceiverName(response.data);
          setIsSuccess(true)
          // console.log(response.data);
        } catch(error){
          setIsSuccess(false)
          if (error.response.data.msg === 'User not found'){
            setReceiverName(error.response.data.msg)
            setIsSuccess(true)
            // console.log(error.response.data)
          }
        }
      };
  
      fetchReceiversDetails();
    }
  }, [toAccount]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://solibank.onrender.com/api/transactions/transfer', {
        fromAccount: location.state.accountNumber,
        toAccount,
        amount,
        description,
      });

      setMessage(`${response.data.msg}, Your balance is ₦ ${response.data.senderBalance}`);
      alert(`${response.data.msg}, Your balance is ₦ ${response.data.senderBalance}`);
      // console.log(response.data)
      setIsSuccess(true);
      setIsLoading(false);
      
    } catch (error) {
      setMessage(error.response.data.msg);
      setIsLoading(false);
      setIsSuccess(false);
      // console.log(error.response.data)
    }

    // Clear the form fields
    setToAccount('');
    setAmount('');
    setDescription('');
  };

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  };

  // This function will log out the user
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
    timeoutId = setTimeout(handleLogout, 180000); // Set inactivity timer for 3 minute
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

  return (
    <div className='md:flex items-center justify-center h-[100vh] md:bg-[#fff5ff] '>
      {isLoading && (
        <div className='overlay'>
          {/* <div className='spinner'></div> */}
          <div className='ball'>
            <div className='ball1'></div>
            <div className='ball2'></div>
            <div className='ball3'></div>
            <div className='ball4'></div>
          </div>
        </div>
      )}
      <div className='md:w-[450px] bg-white p-8 '>
        <div className='border-b py-4 mb-10 '>
        <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
          <img src='../images/back-arrow.svg' alt='icon' className='w-[20px] ' />
          Dashboard</button>
        </div>
        <h2 className='text-[30px] font-medium mb-4 '>Transfer Funds</h2>
        <form onSubmit={handleTransfer}>
          <div>
            <label>To Account<span className='text-[red]'>*</span></label>
            <input
                className='p-4 bg-[#e8f0fe] w-[100%] rounded border border-[purple] '
                type="text"
                name="toAccount"
                onChange={(e) => setToAccount((e.target.value))}
            />
            <div className='mb-4'>
              <p className={` text-end text-[12px] text-[${receiverName === 'User not found' ? 'red' : 'purple'}] ${!isSuccess ? 'hidden':'block'} `}>{receiverName}</p>
            </div>
          </div>
          <div>
            <label>Amount<span className='text-[red]'>*</span></label>
            <input
                className='p-4 bg-[#e8f0fe] w-[100%] mb-4 rounded border border-[purple] '
                type="number"
                name="amount"
                onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </div>
          <div>
              <label>Description<span className='text-[red]'>*</span></label>
              <input
                  className='p-4 bg-[#e8f0fe] w-[100%] mb-4 rounded border border-[purple] '
                  type="text"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  required
              />
          </div>
          <button type="submit" className='bg-[purple] text-white py-2 px-4 hover:bg-[#a617a6] rounded-md '>Transfer</button>
        </form>
        <p className={`text-[${isSuccess ? 'green':'red'}] ${isSuccess ? 'hidden':'block'}`}>{message}</p>
      </div>
  </div>
  )
}

export default Transfer