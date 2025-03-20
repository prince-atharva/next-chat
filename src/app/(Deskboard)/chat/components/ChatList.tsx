"use client"; // Required if using Next.js (remove if using CRA)

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import FriendList from "./FriendList";
import axios from "axios";

const ChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "67da7e0cc33483e9d8b6db6e"; // Replace with dynamic user ID

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/chats/recent/${userId}`);
        console.log(response.data)
        setChats(response.data);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center border-gray-200 border-b-2 border-r-2 justify-between p-4">
        <div className="font-semibold text-xl flex items-center gap-2">
          Messages
          <span className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-sm">
            {chats.length}
          </span>
        </div>
        <div>
          <Plus className="bg-blue-700 text-white rounded-full p-1 size-8 cursor-pointer hover:bg-blue-800 transition" />
        </div>
      </div>

      {/* Searchbar & Friend List (Scrollable) */}
      <div className="flex flex-col flex-grow border-r-2 border-gray-200 overflow-hidden">
        <div className="p-4">
          <Searchbar />
        </div>

        {/* Scrollable Friend List */}
        <div className="flex-grow overflow-y-auto p-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading chats...</p>
          ) : (
            <FriendList chats={chats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
