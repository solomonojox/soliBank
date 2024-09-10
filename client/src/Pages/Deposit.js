import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Deposit() {

  // const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  console.log(location.state)

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  }


  const handleDeposit = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('https://solibank.onrender.com/api/transactions/deposit', {
        accountNumber: location.state.accountNumber,
        amount,
        description
      })
        setMessage(`${response.data.msg}, New balance: ₦ ${response.data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
        alert(`${response.data.msg}, New balance: ₦ ${response.data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
        setIsSuccess(true)
        console.log(response)
    } catch (error){
      setMessage(error.response.data.msg)
      console.log(error.response.data)
    }
  }

  return (
    <div className='flex items-center justify-center h-[100vh] bg-[#fff5ff] '>
      <div className='w-[450px] bg-white p-8 '>
        <div className='border-b py-4 mb-10 '>
            <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-1 px-4 rounded-lg hover:bg-[#a617a6] '>Dashboard</button>
        </div>
        <h2 className='text-[30px] font-medium mb-4 '>Deposit Funds</h2>
        <form onSubmit={handleDeposit}>
          {/* <div>
            <label>Account Number:</label>
            <input
              type="text"
              name="accountNumber"
              value={this.state.accountNumber}
              onChange={this.handleChange}
            />
          </div> */}
          <div>
            <label>Amount<span className='text-[red]'>*</span></label><br/>
            <input
              className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
              type="number"
              name="amount"
              // value={this.state.amount}
              onChange={(e) => setAmount(parseInt(e.target.value), 10)}
            />
          </div>
          <div>
            <label>Description<span className='text-[red]'>*</span></label>
            <input
              className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
              type="text"
              name="description"
              // value={this.state.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className='bg-[purple] text-white py-1 px-4 hover:bg-[#a617a6]'>Deposit</button>
        </form>
        <p className={`text-[${isSuccess ? 'green' : 'red'}] ${isSuccess ? 'hidden':'block'}`}>{message}</p>
      </div>

    </div>
  )
}

export default Deposit