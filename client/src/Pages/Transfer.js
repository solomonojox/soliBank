import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Transfer() {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
//   console.log(location.state)

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/transactions/transfer', {
            fromAccount: location.state.accountNumber,
            toAccount,
            amount,
            description,
        });

        setMessage(`${response.data.msg}, Your balance is ₦ ${response.data.senderBalance}`);
        alert(`${response.data.msg}, Your balance is ₦ ${response.data.senderBalance}`);
        console.log(response.data)
        setIsSuccess(true);
    } catch (error) {
        setMessage(error.response.data.msg);
        setIsSuccess(false);
        console.log(error.response.data)
    }
  };

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  };

  return (
    <div className='flex items-center justify-center h-[100vh] bg-[#fff5ff] '>
      <div className='w-[450px] bg-white p-8 '>
        <div className='border-b py-4 mb-10 '>
            <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-1 px-4 rounded-lg hover:bg-[#a617a6] '>Dashboard</button>
        </div>
        <h2 className='text-[30px] font-medium mb-4 '>Transfer Funds</h2>
        <form onSubmit={handleTransfer}>
          <div>
              <label>To Account:</label>
              <input
                  className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
                  type="text"
                  name="toAccount"
                  onChange={(e) => setToAccount((e.target.value))}
              />
          </div>
          <div>
              <label>Amount:</label>
              <input
                  className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
                  type="number"
                  name="amount"
                  onChange={(e) => setAmount(parseInt(e.target.value))}
              />
          </div>
          <div>
              <label>Description:</label>
              <input
                  className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
                  type="text"
                  name="description"
                //   value={this.state.description}
                  onChange={(e) => setDescription(e.target.value)}
              />
          </div>
          <button type="submit" className='bg-[purple] text-white py-1 px-4 hover:bg-[#a617a6] '>Transfer</button>
        </form>
        <p className={`text-[${isSuccess ? 'green':'red'}] ${isSuccess ? 'hidden':'block'}`}>{message}</p>
      </div>
  </div>
  )
}

export default Transfer