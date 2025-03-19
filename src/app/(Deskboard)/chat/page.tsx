import React from 'react'
import ChatList from './components/ChatList'
import ChatContainer from './components/ChatContainer'

export default function Chat() {
  return (
    <div className='w-full h-full flex'>
      <div className='w-full max-w-md'>
        <ChatList />
      </div>
      <div className='w-full'>
        <ChatContainer />
      </div>
    </div>
  )
}