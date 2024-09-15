import React from 'react';
// menu buttons
import { IoMdHome } from "react-icons/io";
import { GiCash } from "react-icons/gi";
import { IoIosGift } from "react-icons/io";
import { FaUserCircle, FaIdCard } from "react-icons/fa";

function MenuBar() {
  return (
    <div className='fixed bottom-0 left-0 h-[65px] w-[100%] bg-[white] flex items-center justify-center p-4 ' >
      <div className='flex justify-between w-[100%] '>
        <div className='flex flex-col items-center text-[12px]'>
          <IoMdHome className='text-[25px] text-[purple] '/>
          home
        </div>
        <div className='flex flex-col items-center text-[12px]'>
          <GiCash className='text-[25px] text-[purple] '/>
          loan
        </div>
        <div className='flex flex-col items-center text-[12px]'>
          <FaIdCard className='text-[25px] text-[purple] '/>
          cards
        </div>
        <div className='flex flex-col items-center text-[12px]'>
          <IoIosGift className='text-[25px] text-[purple] '/>
          rewards
        </div>
        <div className='flex flex-col items-center text-[12px]'>
          <FaUserCircle className='text-[25px] text-[purple] '/>
          user
        </div>
      </div>
    </div>
  )
}

export default MenuBar