"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { format, isToday, isYesterday } from "date-fns";

const MessagesList = () => {
  const messages = [
    { id: 1, sender: "user", text: "Hey, how's it going?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 2, sender: "friend", text: "Hey! I'm good, how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you? how about you?", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000) }, // 2 days ago
    { id: 3, sender: "user", text: "Just working on a project.", time: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Yesterday
    { id: 4, sender: "friend", text: "That sounds cool!", time: new Date(Date.now() - 12 * 60 * 60 * 1000) }, // Today
    { id: 5, sender: "user", text: "Let's catch up soon!", time: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // Today
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format timestamps
  const formatTime = (date: Date) => format(date, "hh:mm a");

  // Function to check if a new day separator is needed
  const shouldShowDate = (index: number) => {
    if (index === 0) return true;
    const prevDate = format(messages[index - 1].time, "yyyy-MM-dd");
    const currentDate = format(messages[index].time, "yyyy-MM-dd");
    return prevDate !== currentDate;
  };

  // Function to format the day separator text
  const formatDaySeparator = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMM d");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-4">
      {messages.map((msg, index) => (
        <React.Fragment key={msg.id}>
          {/* Day Separator */}
          {shouldShowDate(index) && (
            <div className="text-center text-sm font-semibold text-gray-600 my-4">
              {formatDaySeparator(msg.time)}
            </div>
          )}

          <div className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {/* Profile Image (Left for friend, right for user) */}
            {msg.sender === "friend" && (
              <Image
                src="https://ui-avatars.com/api/?name=F+R"
                width={30}
                height={30}
                className="rounded-full"
                alt="Friend"
              />
            )}

            {/* Message Bubble with timestamp inside */}
            <div className="relative flex flex-col max-w-[60%]">
              <div
                className={`p-3 rounded-lg text-sm shadow relative break-words ${msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-black self-start"
                  }`}
              >
                <span className="inline-block break-words">{msg.text}</span>

                {/* Timestamp dynamically positioned */}
                <div className="w-full text-right font-medium mt-1 text-[10px]">
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>

            {/* Profile Image (Right for user) */}
            {msg.sender === "user" && (
              <Image
                src="https://ui-avatars.com/api/?name=p+k"
                width={30}
                height={30}
                className="rounded-full"
                alt="User"
              />
            )}
          </div>
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;