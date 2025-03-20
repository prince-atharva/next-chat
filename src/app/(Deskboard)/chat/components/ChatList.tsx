import { Plus } from "lucide-react";
import React from "react";
import Searchbar from "./Searchbar";
import FriendList from "./FriendList";

const ChatList = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center border-gray-200 border-b-2 border-r-2 justify-between p-4">
        <div className="font-semibold text-xl flex items-center gap-2">
          Messages
          <span className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-sm">
            10
          </span>
        </div>
        <Plus className="bg-blue-700 text-white rounded-full p-1 size-8 cursor-pointer hover:bg-blue-800 transition" />
      </div>

      {/* Searchbar & Friend List (Scrollable) */}
      <div className="flex flex-col flex-grow border-r-2 border-gray-200 overflow-hidden">
        <div className="p-4">
          <Searchbar />
        </div>

        {/* Scrollable Friend List */}
        <div className="flex-grow overflow-y-auto p-2">
          <FriendList />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
