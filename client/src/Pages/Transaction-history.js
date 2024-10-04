import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/isLoading.css';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  let timeoutId;

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          url: `https://solibank.onrender.com/api/transactions/history?userId=${location.state._id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setTransactions(response.data);
        setIsLoading(false);
        // console.log(response.data);
      } catch (error) {
        setMessage(error.response.data.msg);
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [location.state._id]);

  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const indexOfLastItem = currentPage * transactionsPerPage;
  const indexOfFirstItem = indexOfLastItem - transactionsPerPage
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem)

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

  const pageNumber = []
  for(let i =1; i <= Math.ceil(transactions.length / transactionsPerPage); i++){
    pageNumber.push(i)
  }

  return (
    <div className='p-4'>
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
      
      <div className='border-b py-4 mb-10 '>
        <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
          <img src='../images/back-arrow.svg' alt='icon' className='w-[20px] ' />
          Dashboard
        </button>
      </div>

      <div className='w-[100%] px-1 md:px-[50px] my-5 '>
        <h3 className='font-bold text-[25px] p-4 '>Transaction History</h3>
        {/* Transaction History */}
        <div className='py-4 md:w-[350px] md:h-[200px]  md:overflow-scroll md:overflow-x-hidden rounded-lg md:rounded-none  '>
          {transactions.length > 0 ? (
            <div>
              <ul className='grid gap-2 text-white '>
                {currentTransactions.map((transaction, index) => (
                  <li key={index} className='flex justify-between p-2 text-[12px] border-b border-[#ffffff50] bg-[purple] '>
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

              <div className='flex gap-5 mt-6 justify-center bg-[#fadffa] font-medium py-2 '>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === pageNumber[0]}
                  style={currentPage === pageNumber[0] ? {
                    cursor: 'not-allowed',
                    opacity: '50%'
                  } : null}>Prev
                </button>
                {pageNumber.map((number, index) =>
                  <button
                    key={index}
                    onClick={() => setCurrentPage(number)}
                    style={currentPage === number ? {
                      backgroundColor: 'purple',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10%',
                      padding: '2px 5px'
                    } : null}>{number}</button>
                )}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pageNumber.length}
                  style={currentPage === pageNumber.length ? {
                    cursor: 'not-allowed',
                    opacity: '50%'
                  } : null}>Next
                </button>
              </div>
            </div>
          ) : (
            <p>No transactions found.{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory