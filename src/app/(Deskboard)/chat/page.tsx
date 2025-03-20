import React from 'react'
import ChatList from './components/ChatList'
import Image from 'next/image'

export default function Chat() {
  return (
    <>
      <div className='p-2 h-screen flex items-center justify-center'>
        <Image src="/Animation - 1742373757643.gif" alt='email' width={100} height={100} />
      </div>
    </>
  )
}