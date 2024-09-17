import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

import MenuBar from '../Components/MenuBar';

function Rewards() {
  // const location = useLocation();
  const navigate = useNavigate();
  let timeoutId;

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
    <div className='grid justify-center items-center h-[100vh]'>
      {/* Menu buttons */}
      <MenuBar/>
      <div>
        <div className='border-b py-4 '>
          <div className='bg-[green] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
            Rewards
          </div>
        </div>
        <p>Service coming soon...</p>
      </div>
    </div>
  )
}

export default Rewards