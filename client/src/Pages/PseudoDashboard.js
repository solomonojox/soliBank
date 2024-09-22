import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PseudoDashboard() {
  // const location = useLocation();
  const navigate = useNavigate();
  const location = useLocation()

  // Automatically navigate to dashboard after 4seconds
  useEffect(() => {
    setTimeout(() => {
      navigate(`/dashboard`, { state: location.state });
    }, 4000);
  });

  return (
    <div className='grid justify-center items-center h-[100vh]'>
      <div className="loader-container">
        <div className=''>
          <div className='ball'>
            <div className='ball1'></div>
            <div className='ball2'></div>
            <div className='ball3'></div>
            <div className='ball4'></div>
          </div>
        </div>
        <div className='foot flex gap-4'>
          <img src='../images/cbn.png' className='w-[20px]' alt='icon'/>
          <p className='text-[12px]'>licensed by CBN</p>
        </div>
      </div>
    </div>
  )
}

export default PseudoDashboard