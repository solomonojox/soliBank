import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

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
        console.log(response.data);
      } catch (error) {
        setMessage(error.response.data.msg);
      }
    };
    fetchTransactions();
  }, [location.state._id]);

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  };
  return (
    <div className='p-4'>
      <div className='border-b py-4 mb-10 '>
        <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
          <img src='../images/back-arrow.svg' alt='icon' className='w-[20px] ' />
          Dashboard
        </button>
      </div>

      <div className='w-[100%] px-1 md:px-[50px] my-5 '>
        <h3 className='font-bold text-[25px] p-4 '>Transaction History</h3>
        {/* Transaction History */}
        <div className='bg-[purple] py-4 md:w-[350px] md:h-[200px] text-white md:overflow-scroll md:overflow-x-hidden rounded-lg md:rounded-none  '>
          {transactions.length > 0 ? (
            <div>
              <ul className='grid gap-2'>
                {transactions.map((transaction, index) => (
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
  )
}

export default TransactionHistory