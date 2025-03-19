"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";

const FriendList = () => {
  const list = [
    {
      image: "https://ui-avatars.com/api/?name=J+D",
      name: "John Doe",
      lastMessage: "See you later!",
      lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      image: "https://ui-avatars.com/api/?name=S+K",
      name: "Sarah Khan",
      lastMessage: "Let's catch up soon!",
      lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      image: "https://ui-avatars.com/api/?name=A+P",
      name: "Alice Patel",
      lastMessage: "Great work!",
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  // Function to format time (auto-detects seconds, minutes, hours, days)
  const formatTime = (date: Date) => {
    const formatted = formatDistanceToNowStrict(date, { addSuffix: false });

    return formatted
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
      <h2 className="text-lg font-semibold mb-4">Friends</h2>

      <ul className="space-y-4">
        {list.map((friend, index) => (
          <li key={index} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer gap-y-2">
            <Image
              src={friend.image}
              width={50}
              height={50}
              className="rounded-full"
              alt={friend.name}
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium">{friend.name}</h3>
              <p className="text-xs text-gray-500">{friend.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{formatTime(friend.lastSeen)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;