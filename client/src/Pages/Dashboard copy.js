import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Styles/nav.css';

function Dashboard() {
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  // console.log(user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios({
          url: `http://localhost:5000/api/info?email=${location.state.email}`,
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
          url: `http://localhost:5000/api/transactions/history?userId=${location.state._id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setTransactions(response.data);
      } catch (error) {
        setMessage(error.response.data.msg);
      }
    };
    fetchTransactions();
  }, [location.state._id]);

  const navigateDeposit = () => {
    navigate(`/deposit`, { state: location.state });
  }
  const navigateTransfer = () => {
    navigate(`/transfer`, { state: location.state });
  }
  const navigateRequest = () => {
    navigate(`/request-funds`, { state: location.state });
  }

  const handleLogout = () => {
    // Clear token from localStorage or cookies
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  }

    return (
        <div className='flex items-center justify-center h-[100vh] w-[100%] bg-[#fff5ff] '>
          <div className='flex bg-white shadow-2xl '>

            {/* Nav */}
            <button className='nav_toggle' onClick={() => setNavOpen(!navOpen)}>Menu</button>
            {navOpen && (
              <div className='nav_menu'>
                <div className='w-[150px] h-[100vh] bg-[purple] flex flex-col gap-2 justify-center md:w-[240px] md:p-4 md:gap-5 '>
                  <div className='flex flex-col justify-center items-center '>
                    <img src={user.profileImg} alt='profile' className='rounded-full w-[80px] h-[80px] object-cover ' />
                    <h3 className='text-white font-bold text-[14px] '>{user.name}</h3>
                  </div>
                  <button className='nav_side' onClick={() => navigateDeposit()} >Deposit</button>
                  <button className='nav_side' onClick={() => navigateTransfer()} >Transfer</button>
                  <button className='nav_side' onClick={() => navigateRequest()} >Request Funds</button>
                  <button className='nav_side' onClick={() => handleLogout()}>Logout</button>
                </div>
              </div>
            )}

            <div className='md:w-[100%] px-1 md:px-[50px] my-5 '>
              <div>
                <h2 className='text-[25px] font-bold '>Welcome <span className='text-[purple]'>{user.name}</span></h2>
                <div className=''>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Account Number:</strong> {user.accountNumber}</p>
                  <p><strong>Account Balance:</strong> ₦ {user.balance}</p>
                </div>
              </div>

              {/* Transaction History */}
              <div className='bg-[purple] p-4 w-[350px] text-white mt-10 overflow-scroll overflow-x-hidden '>
                <h3 className='font-bold text-[18px] '>Transaction History</h3>
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                {transactions.length > 0 ? (
                  <ul className='grid gap-2'>
                    {transactions.map((transaction, index) => (
                      <li key={index} className='flex justify-between p-2 text-[12px] border-b border-[#ffffff50] '>
                        <div className='flex gap-2'>
                          <div className='flex items-center justify-center w-[35px] h-[35px] bg-[white] rounded-full text-[] '>
                            <img src={`./images/${transaction.type}.svg`} alt='img' className='w-[15px] ' />
                          </div>
                          <div>
                            <p>{transaction.type} - {transaction.description}</p>
                            <p>{new Date(transaction.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <p><strong>₦ {transaction.amount.toLocaleString()}</strong></p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No transactions found.{message}</p>
                )}
              </div>
            </div>
          </div>

        </div>
    )
}

export default Dashboard