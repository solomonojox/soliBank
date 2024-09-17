import React from 'react';

// menu buttons
import { IoMdHome } from "react-icons/io";
import { GiCash } from "react-icons/gi";
import { IoIosGift } from "react-icons/io";
import { FaUserCircle, FaIdCard } from "react-icons/fa";
const { useNavigate, useLocation } = require('react-router-dom');

function MenuBar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateDashboard = () => {
    navigate(`/dashboard`, { state: location.state });
  }

  const navigateLoans = () => {
    navigate(`/loans`, { state: location.state });
  }

  const navigateCards = () => {
    navigate(`/cards`, { state: location.state });
  }

  const navigateRewards = () => {
    navigate(`/rewards`, { state: location.state });
  }

  return (
    <div className='fixed bottom-0 left-0 h-[65px] w-[100%] bg-[white] flex items-center justify-center p-4 ' >
      <div className='flex justify-between w-[100%] ' >
        <div className='flex flex-col items-center text-[12px]' onClick={() => navigateDashboard() }>
          {props.home ?
            (<>{props.home}</>)
              :
            (<><IoMdHome className='text-[25px] text-[grey] ' />Home</>)
          }
        </div>
        <div className='flex flex-col items-center text-[12px]' onClick={() => navigateLoans() }>
          {props.loan ?
            (<>{props.loan}</>)
              :
            (<><GiCash className='text-[25px] text-[grey] '/>Loan</>)
          }
        </div>
        <div className='flex flex-col items-center text-[12px]' onClick={() => navigateCards() }>
          {props.card ?
            (<>{props.card}</>)
              :
            (<><FaIdCard className='text-[25px] text-[grey] '/>Cards</>)
          }
        </div>
        <div className='flex flex-col items-center text-[12px]' onClick={() => navigateRewards() }>
          {props.reward ?
            (<>{props.reward}</>)
              :
            (<><IoIosGift className='text-[25px] text-[grey] '/>Rewards</>)
          }
        </div>
        <div className='flex flex-col items-center text-[12px]'>
          <FaUserCircle className='text-[25px] text-[grey] '/>
          Me
        </div>
      </div>
    </div>
  )
}

export default MenuBar