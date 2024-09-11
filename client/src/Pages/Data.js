import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 

function Data() {
  const location = useLocation()
  const navigate = useNavigate()
  console.log(location.state)

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  }
  return (
    <div className='grid justify-center items-center h-[100vh]'>
      <div>
        <div className='border-b py-4 '>
          <button onClick={() => navigateDashboard()} className='bg-[purple] text-white py-2 px-2 rounded-lg hover:bg-[#a617a6] flex gap-2 '>
            <img src='../images/back-arrow.svg' alt='icon' className='w-[20px] ' />
            Dashboard
          </button>
        </div>
        <p>Service coming soon...</p>
      </div>
    </div>
  )
}

export default Data