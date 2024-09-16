import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Styles/nav.css';
import '../Styles/Loader.css';

// React Icons
// import { CgProfile } from 'react-icons/cg';
// import { CgArrowUpO } from 'react-icons/cg';
import { CgLogOut } from 'react-icons/cg';
import { IoNotifications } from "react-icons/io5";

import { MdOutlineAccountBalanceWallet, MdOutlineLiveTv } from 'react-icons/md';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

import { PiPhoneTransferFill } from "react-icons/pi";
import { TbTransferIn, TbMobiledata } from "react-icons/tb";
import { IoFootballOutline } from "react-icons/io5";
import { LuUtilityPole } from "react-icons/lu";
import { CiCreditCard1 } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import MenuBar from '../Components/MenuBar';




function Dashboard() {
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [showNotification, setShowNotification] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  let timeoutId;
  // console.log(location.state.token)
  // console.log(transactions)

  // Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 seconds

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

  const handleShowNotification = () => {
    if (showNotification) {
      setShowNotification(false)
    } else{
      setShowNotification(true)
    }
  }

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
            <div className='flex shadow-2xl w-[100%] md:w-[800px] md:h-[450px] px-4 relative '>

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

              <div className='w-[100%] px-1 md:px-[50px] '>
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

                {/* Menu buttons */}
                <MenuBar/>
                <div className='fixed bottom-20 right-2 text-[50px] text-[green] rounded-full bg-[#fff5ff] p-3 '>
                  <IoChatbubbleEllipses className='text-[30px] text-[green] '/>
                </div>

                {/* Balance */}
                <div className='bg-[purple] rounded-lg p-4 flex justify-between items-start text-white mt-5 md:hidden '>
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
                  <button className='bg-[#fff5ff] text-[purple] text-[12px] font-bold px-3 py-2 rounded-2xl hover:bg-[purple] hover:text-[#fff5ff] ' onClick={() => navigateDeposit()}>Deposit</button>
                </div>

                {/* Tranfer, request */}
                <div className='bg-[white] mt-5 py-4 px-5 grid gap-2 rounded-lg mb-5 md:hidden'>
                  <p className='font-bold'>Transactions</p>
                  <div className=' w-[100%] md:hidden flex gap-10 '>
                    <div className='flex flex-col gap-1 items-center' onClick={() => navigateTransfer()}>
                      <TbTransferIn className='text-[40px] text-[purple] rounded-full bg-[#fae8fa] p-2 '/>
                      <p className='text-[12px]'>Transfer</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateRequest()}>
                      <VscGitPullRequestGoToChanges className='text-[40px] text-[purple] rounded-full bg-[#fae8fa] p-2 '/>
                      <p className='text-[12px]'>Request</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateAirtime()}>
                      <MdOutlineAccountBalanceWallet className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] '/>
                      <p className='text-[12px]'>Safe</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className='bg-[white] mt-5 py-4 grid gap-2 rounded-lg mb-5 md:hidden'>
                  <p className='font-bold ml-5'>Services</p>
                  <div className='md:hidden grid grid-cols-3 gap-5 '>

                    <div className='flex gap-1 flex-col items-center' onClick={() => navigateAirtime()}>
                      <PiPhoneTransferFill className='text-[purple] text-[40px] rounded-full bg-[#fae8fa] p-2 '/>
                      <p className='text-[12px]'>Airtime</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <TbMobiledata className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] ' />
                      <p className='text-[12px]'>Data</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <IoFootballOutline className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] '/>
                      <p className='text-[12px]'>Sport Betting</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <LuUtilityPole className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] '/>
                      <p className='text-[12px]'>Utilities</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <MdOutlineLiveTv className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] ' />
                      <p className='text-[12px]'>Tv/Cables</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <CiCreditCard1 className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] ' />
                      <p className='text-[12px]'>Debit card</p>
                    </div>
                    <div className='flex flex-col items-center' onClick={() => navigateData()}>
                      <GiTakeMyMoney className='text-[40px] rounded-full bg-[#fae8fa] p-2 text-[purple] ' />
                      <p className='text-[12px]'>Refer & earn</p>
                    </div>

                  </div>
                </div>

                {/* Account Details MD */}
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
                <div className='bg-[purple] p md:w-[350px] md:h-[200px] text-white md:overflow-scroll md:overflow-x-hidden rounded-lg md:rounded-none  '>
                  <div className='border-b flex justify-between items-center p-4'>
                   <h3 className='font-bold text-[18px] '>Transaction History</h3>
                   {transactions.length > 4 ? (
                      <div className='flex justify-end'>
                        <button
                          className=' flex items-center text-[white] text-[14px] font-bold rounded-lg hover:bg-[purple] hover:text-[#fff5ff] '
                          onClick={() => navigate('/transaction-history', { state: location.state })}
                        >
                          See More <MdKeyboardDoubleArrowRight/>
                        </button>
                      </div>
                    ):(
                      <div></div>
                    )}
                  </div>
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