import React, { useState } from 'react'
import { RiMenu5Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';

function Navb() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    if (isOpen == false){
      setIsOpen(true)
    } else{
      setIsOpen(false)
    }
  }
  return (
    <div className='absolute top-0 left-0 bg-white flex'>
      <RiMenu5Fill className='text-[20px] ' onClick={() => handleOpen()}/>

      {/* {isOpen ? '' : ''} */}
      <div className={`bg-[purple] w-[200px] flex items-center justify-center p-10 left-[20px] absolute ${isOpen ? 'block' : 'hidden'} `}>
        <nav className='flex flex-col gap-4 text-white font-medium '>
          <Link to='/'>Home</Link>
          <Link to='/'>Home</Link>
          <Link to='/'>Home</Link>
          <Link to='/'>Home</Link>
        </nav>
      </div>
    </div>
  )
}

export default Navb