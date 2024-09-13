import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Styles/nav.css';
import '../Styles/Loader.css';

function Dashboard() {
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [showBalance, setShowBalance] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  let timeoutId;
  // console.log(location.state.token)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios({
          url: `https://solibank.onrender.com/api/info?email=${location.state.email}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUser(response.data.userDto);
      } catch (error) {
        setMessage('Failed to load data. Please try again later.');
      }
    };
    fetchUser();
  }, [location.state.email]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios({
          url: `https://solibank.onrender.com/api/transactions/history?userId=${location.state._id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setTransactions(response.data);
        // console.log(response.data);
      } catch (error) {
        setMessage(error.response.data.msg);
      }
    };
    fetchTransactions();
  }, [location.state._id]);

  useEffect(() => {
    if (!location.state.token) {
      navigate('/login');
    }
  }) 

  const navigateDeposit = () => {
    navigate(`/deposit`, { state: location.state });
  }
  const navigateTransfer = () => {
    navigate(`/transfer`, { state: location.state });
  }
  const navigateRequest = () => {
    navigate(`/request-funds`, { state: location.state });
  }
  const navigateAirtime = () => {
    navigate(`/airtime`, { state: location.state });
  }
  const navigateData = () => {
    navigate(`/data`, { state: location.state });
  }

  // This function will log out the user
  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('token');
    alert('You have been logged out due to inactivity');
    navigate('/login', {replace: true}); // Redirect to login page
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
      <div>
        {loading ? (
          <div className="loader-container">
            <div className="loader">
              <div className="spinner"></div>
              <p>Please wait...</p>

              <div className='foot flex gap-4'>
                <img src='../images/cbn.png' className='w-[20px]' alt='icon'/>
                <p className='text-[12px]'>licensed by CBN</p>
              </div>
            </div>
          </div>
        ) : (

          <div className='flex items-center justify-center md:h-[100vh] w-[100%] bg-[#fff5ff] '>
            <div className='flex bg-[white] shadow-2xl w-[100%] md:w-[800px] md:h-[450px] p-4 '>

              {/* Nav */}
              <div className='hidden w-[240px] bg-[purple] md:flex flex-col gap-5 p-4 justify-center '>
                <div className='flex flex-col justify-center items-center '>
                  <img src={user.profileImg} alt='profile' className='rounded-full w-[60px] h-[60px] object-cover ' />
                  <h3 className='text-white font-bold text-[14px] text-center '>{user.name}</h3>
                </div>
                <button className='nav_side' onClick={() => navigateDeposit()} >Deposit</button>
                <button className='nav_side' onClick={() => navigateTransfer()} >Transfer</button>
                <button className='nav_side' onClick={() => navigateRequest()} >Request Funds</button>
                <button className='nav_side' onClick={() => handleLogout()}>Logout</button>
              </div>
              {/* \end */}

              <div className='w-[100%] px-1 md:px-[50px] my-5 '>
                {/* Profile welcome */}
                <div className='py-2 flex justify-between items-start md:hidden '>
                  <div className='flex items-center gap-1 md:hidden'>
                    <img src={user.profileImg} alt='profile' className='rounded-full w-[50px] h-[50px] object-cover ' />
                    <div className='w-[200px] '>
                      <h3 className='text-[14px] font-bold '>Welcome, {user.name}</h3>
                      <p className='text-[12px] my-[-5px] text-[purple] '>account no. - {user.accountNumber}</p>
                      <p className='text-[12px] my-[-5px] text-[purple] '>{user.email}</p>
                    </div>
                  </div>
                  <button className='bg-[#fff5ff] text-[purple] text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-[purple] hover:text-[#fff5ff] ' onClick={() => handleLogout()}>Logout</button>
                </div>

                {/* Balance */}
                <div className='bg-[purple] rounded-lg px-4 py-2 flex justify-between items-start text-white mt-5 md:hidden '>
                  <div>
                    <p className='font-bold flex gap-2'>
                      Available Balance
                      <span>
                        <button onClick={() => setShowBalance(!showBalance)} className='mt-1'>
                          {showBalance ?
                            <img src='../images/closed-eye.svg' className='w-[20px]' alt='icon' />
                            :
                            <img src='../images/opened-eye.svg' className='w-[20px]' alt='icon' />
                          }
                        </button>
                      </span>
                    </p>
                    {showBalance ? (
                      <h2 className='text-[20px] font-bold '>₦ {user.balance}</h2>
                    ) : (
                      <h2 className='text-[20px] font-bold '>
                        *****
                      </h2>
                    )}
                  </div>
                  <button className='bg-[#fff5ff] text-[purple] text-[12px] font-bold px-2 py-2 rounded-lg hover:bg-[purple] hover:text-[#fff5ff] ' onClick={() => navigateDeposit()}>Deposit</button>
                </div>

                {/* Tranfer, request, airtime and data */}
                <div className='bg-[purple] mt-10 py-4 px-5 grid gap-2 rounded-lg mb-5 md:hidden'>
                  <p className='text-white font-bold'>Transactions</p>
                  <div className='bg-[purple] w-[100%] text-white md:hidden flex justify-between '>
                    <div className='flex flex-col gap-2 items-center' onClick={() => navigateTransfer()}>
                      <img src='../images/transfer-icon.png' className='rounded-full bg-white w-[40px] ' alt='icon' />
                      <p className='text-[12px]'>Transfer</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center' onClick={() => navigateRequest()}>
                      <img src='../images/request.svg' className='rounded-full bg-white p-2 w-[40px] ' alt='icon' />
                      <p className='text-[12px]'>Request</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center' onClick={() => navigateAirtime()}>
                      <img src='../images/airtime.svg' className='rounded-full bg-white p-2 w-[40px] h-[40px] ' alt='icon' />
                      <p className='text-[12px]'>Airtime</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center' onClick={() => navigateData()}>
                      <img src='../images/data.svg' className='rounded-full bg-white p-2 w-[40px] h-[40px] ' alt='icon' />
                      <p className='text-[12px]'>Data</p>
                    </div>
                  </div>
                </div>

                <div className='hidden md:block'>
                  <h2 className='hidden text-[25px] font-bold md:block '>Welcome <span className='text-[purple]'>{user.name}</span></h2>
                  <div className=''>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Account Number:</strong> {user.accountNumber}</p>
                    <p><strong>Account Balance:</strong> ₦ {user.balance}</p>
                  </div>
                </div>

                {/* Transaction History */}
                <div className='bg-[purple] p md:w-[350px] md:h-[200px] text-white mt-10 md:overflow-scroll md:overflow-x-hidden rounded-lg md:rounded-none  '>
                  <h3 className='font-bold text-[18px] p-4 '>Transaction History</h3>
                  {transactions.length > 0 ? (
                    <div>
                      <ul className='grid gap-2'>
                        {transactions.slice(0, 4).map((transaction, index) => (
                          <li key={index} className='flex justify-between p-2 text-[12px] border-b border-[#ffffff50] '>
                            <div className='flex gap-2'>
                              <div className='flex items-center justify-center w-[35px] h-[35px] bg-[white] rounded-full '>
                                <img src={`./images/${transaction.type}.svg`} alt='img' className='w-[15px] ' />
                              </div>
                              <div className='w-[200px]'>
                                <p>{transaction.type} - {transaction.description}</p>
                                <p>{new Date(transaction.date).toLocaleString()}</p>
                              </div>
                            </div>
                            <p><strong>₦ {transaction.amount.toLocaleString()}</strong></p>
                          </li>
                        ))}
                      </ul>
                      {transactions.length > 4 ? (
                      <div className='border-t flex justify-end'>
                        <button
                          className=' text-[white] text-[14px] font-bold px-4 py-2 rounded-lg hover:bg-[purple] hover:text-[#fff5ff] '
                          onClick={() => navigate('/transaction-history', { state: location.state })}
                        >
                          Show More transactions >>
                        </button>
                      </div>
                      ):(
                        <div></div>
                      )}
                    </div>
                  ) : (
                    <p>No transactions found.{message}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    )
}

export default Dashboard