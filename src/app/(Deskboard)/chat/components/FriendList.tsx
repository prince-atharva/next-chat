"use client";

import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";

interface FriendListProps {
  chats: {
    _id: string;
    type: "one-to-one" | "group";
    name: string;
    profilePicture: string;
    lastMessage: {
      content: string;
      sender?: string;
      time: string;
    } | null;
  }[];
}

const FriendList: React.FC<FriendListProps> = ({ chats }) => {
  const formatTime = (date: string) => {
    return formatDistanceToNowStrict(new Date(date))
      .replace(" seconds", "s")
      .replace(" second", "s")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" days", "d")
      .replace(" day", "d");
  };

  return (
    <div className="p-2 bg-white rounded-lg w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      <ul className="space-y-4">
        {chats.map((chat) => (
          <li key={chat._id} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
            {/* Profile Picture */}
            <Image
              src={chat.profilePicture}
              width={50}
              height={50}
              className="rounded-full"
              alt={chat.name}
            />

            {/* Chat Info */}
            <div className="flex-1">
              <h3 className="text-sm font-medium">{chat.name}</h3>
              <p className="text-xs text-gray-500">
                {chat.lastMessage
                  ? chat.type === "group"
                    ? `${chat.lastMessage.sender}: ${chat.lastMessage.content}`
                    : chat.lastMessage.content
                  : "No messages yet"}
              </p>
            </div>

            {/* Last Message Time */}
            <span className="text-xs text-gray-400">
              {chat.lastMessage ? formatTime(chat.lastMessage.time) : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;