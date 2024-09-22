import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/isLoading.css'

const RequestFunds = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('')
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  let timeoutId;

  useEffect(() => {
    // Fetch incoming requests
    setIsLoading(true);
    axios.get(`https://solibank.onrender.com/api/transactions/recipient/${location.state.email}`)
      .then((res) => {
          setRequests(res.data.requests);
          // console.log(res.data.requests);
      })
      .catch((err) => {
          console.error('Error fetching requests:', err);
          // setError('Failed to load requests. Please try again later.');
      })
      .finally(() => {
          setIsLoading(false);
      });
  }, [location.state.email]);

  const handleRequestMoney = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post('https://solibank.onrender.com/api/transactions/request', {
        requesterEmail: location.state.email,
        recipientEmail,
        amount: parseFloat(amount),
        description
      });
      setMessage(response.data.msg);
      // console.log(response.data);
      alert(response.data.msg);
      setIsSuccess(true);
      setIsLoading(false)
    } catch (err) {
      // console.error('Error requesting money:', err.response.data);
      setMessage(err.response.data.msg);
      setIsLoading(false)
      setIsSuccess(false);
    }

    // Clear the form fields
    setRecipientEmail('');
    setAmount('');
    setDescription('');

  };

  const handleAcceptRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://solibank.onrender.com/api/transactions/accept/${requestId}`);
      if (response.data.msg === 'Request accepted successfully') {
          setRequests(requests.filter(request => request._id !== requestId));
          alert('Request accepted successfully!');
          // console.log(response)
        }
        setIsLoading(false)
        // console.log(response)
    } catch (err) {
      // console.error('Error accepting request:', err);
      alert('Failed to accept request. Please try again later.'); 
      setIsLoading(false)
    }
  };

  const handleRejectRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://solibank.onrender.com/api/transactions/reject/${requestId}`);
      if (response.data.msg === 'Request rejected successfully') {
          setRequests(requests.filter(request => request._id !== requestId));
          // console.log(response)
          alert('Request rejected successfully!');
      }
      setIsLoading(false)
    } catch (err) {
      // console.error('Error rejecting request:', err);
      alert('Failed to reject request. Please try again later.');
      setIsLoading(false)
    }
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
    <div className='items-center justify-center bg-[#fff5ff] '>
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

      <div className=' bg-[white] p-8 '>
        <div className='border-b py-4 mb-10 '>
          <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
            <img src='../images/back-arrow.svg' alt='icon' className='w-[20px] ' />
            Dashboard
          </button>
        </div>
        <h2 className='text-[30px] font-medium mb-4 '>Request Money</h2>
        <form onSubmit={handleRequestMoney}>
          <div>
            <label>Recipient's Email<span className='text-[red]'>*</span></label><br />
            <input
                className='p-4 bg-[#e8f0fe] w-[100%] mb-4 rounded border border-[purple] '
                type="email"
                name="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
            />
          </div>
          <div>
            <label>Amount<span className='text-[red]'>*</span></label><br />
            <input
                className='p-4 bg-[#e8f0fe] w-[100%] mb-4 rounded border border-[purple] '
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
          </div>
          <div>
            <label>Description<span className='text-[red]'>*</span></label><br />
            <input
                className='p-4 bg-[#e8f0fe] w-[100%] mb-4 rounded border border-[purple] '
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
          </div>
          <button type="submit" className='bg-[purple] text-white py-2 px-4 hover:bg-[#a617a6] rounded-md'>Request Money</button>
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
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between '>
                      <span className='font-medium' >{request.requester.name}</span>
                      <span>requested</span>
                      <span className='font-medium '>₦{request.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    <p>{request.description}</p>
                    <div className='flex gap-4 '>
                      <div>
                        {request.status === 'accepted' && (
                            <span className='text-[green] '>{request.status}</span>
                        )}
                        {request.status === 'rejected' && (
                            <span className='text-[red] '>{request.status}</span>
                        )}
                        {request.status === 'pending' && (
                            <span className='text-[#dc9f05] '>{request.status}</span>
                        )}
                      </div>
                      <div className='md:ml-4'>
                        {request.status === 'pending' && (
                          <div className='flex gap-2'>
                            <button onClick={() => handleAcceptRequest(request._id)} className='bg-[purple] rounded p-2 text-[12px] text-[white] '>Accept</button>
                            <button onClick={() => handleRejectRequest(request._id)} className='bg-[red] rounded p-2 text-[12px] text-[white] '>Reject</button>
                          </div>
                        )}
                      </div>
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