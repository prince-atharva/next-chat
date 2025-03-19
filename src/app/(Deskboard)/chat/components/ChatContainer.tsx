"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Button from "@/ui/Button";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";

const ChatContainer = () => {


  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <ChatHeader />

      {/* Messages List */}
      <MessagesList />

      {/* Message Input */}
      <div className="p-4 gap-3 border-t-2 border-gray-100 flex items-center bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <Button>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatContainer;
