import Image from "next/image";
import ChatList from "./components/ChatList";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-full flex'>
      <div className='w-full max-w-lg'>
        <ChatList />
      </div>
      <div className='w-full'>
        {children}
      </div>
    </div>
  )
}