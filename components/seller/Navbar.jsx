import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (

    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b  bg-white'>
      <Image onClick={()=>router.push('/')} className='cursor-pointer rounded-sm w-10 md:w-10 bg-gradient-to-r from-black to-green-800 p-0.5 ' src={assets.logo} alt="" />
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar