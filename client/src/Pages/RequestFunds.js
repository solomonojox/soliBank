import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const RequestFunds = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch incoming requests
    axios.get(`http://localhost:5000/api/transactions/recipient/${location.state.email}`)
      .then((res) => {
          setRequests(res.data.requests);
      })
      .catch((err) => {
          console.error('Error fetching requests:', err);
          // setError('Failed to load requests. Please try again later.');
      });
  }, [location.state.email]);

  const handleRequestMoney = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/transactions/request', {
        requesterEmail: location.state.email,
        recipientEmail,
        amount: parseFloat(amount),
      });
      setMessage(response.data.msg);
      alert(response.data.msg);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error requesting money:', err.response.data);
      setMessage(err.response.data.msg);
      setIsSuccess(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/transactions/accept/${requestId}`);
      if (response.data.msg === 'Request accepted successfully') {
          setRequests(requests.filter(request => request._id !== requestId));
          alert('Request accepted successfully!');
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      setMessage('Failed to accept request. Please try again later.');
    }
  };

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  };

  return (
    <div className='flex items-center justify-center bg-[#fff5ff] '>
      <div className=' bg-white p-8 '>
        <div className='border-b py-4 mb-10 '>
            <button onClick={navigateDashboard} className='bg-[purple] text-white py-1 px-4 rounded-lg hover:bg-[#a617a6] '>Dashboard</button>
        </div>
        <h2 className='text-[30px] font-medium mb-4 '>Request Money</h2>
        <form onSubmit={handleRequestMoney}>
          <div>
            <label>Recipient's Email:</label><br />
            <input
                className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
                type="email"
                name="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
            />
          </div>
          <div>
            <label>Amount:</label><br />
            <input
                className='p-1 bg-[#e8f0fe] w-[100%] mb-4 rounded '
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
          </div>
          <button type="submit" className='bg-[purple] text-white py-1 px-4 hover:bg-[#a617a6]'>Request Money</button>
          <p className={`text-[${isSuccess ? 'green' : 'red'}] ${isSuccess ? 'hidden':'block'}` }>{message}</p>
        </form>

        {/* Incoming Request/History */}
        <h2 className='mt-10 font-bold text-[18px] border-t pt-6 '>Incoming Money Requests</h2>
        <div>
          {requests.length === 0 ? (
            <p>No incoming requests at the moment.</p>
          ) : (
            <ul>
              {requests.map(request => (
                <li key={request._id} className='bg-[white] p-2 shadow-lg my-2 rounded'>
                  <div className='flex'>
                    <div className='font-medium w-[150px] '>{request.requester.name}</div> <span className='w-[100px] '>requested</span>
                    <div className='font-medium w-[80px] '> ₦{request.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    <div>
                      {request.status === 'accepted' && (
                          <span className='text-[green] '>{request.status}</span>
                      )}
                      {request.status === 'pending' && (
                          <span className='text-[#dc9f05] '>{request.status}</span>
                      )}
                    </div>
                    <div className='ml-4'>
                      {request.status === 'pending' && (
                        <button onClick={() => handleAcceptRequest(request._id)} className='bg-[purple] rounded px-2 text-[12px] text-[white] '>Accept Request</button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestFunds;