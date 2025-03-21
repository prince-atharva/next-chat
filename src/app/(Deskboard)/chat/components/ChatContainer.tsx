"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import Button from "@/ui/Button";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";

interface EmailMessage {
  messageId: string;
  date: string;
  content: string;
}

interface EmailThread {
  threadId: string;
  subject: string;
  name: string;
  email: string;
  from: string;
  profileImage: string;
  messages: EmailMessage[];
}

const ChatContainer = () => {
  const { id: emailid } = useParams();
  const [thread, setThread] = useState<EmailThread | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(thread)
  useEffect(() => {
    if (!emailid) return;

    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/email/${emailid}`);
        setThread(response.data);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [emailid]);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <ChatHeader from={thread?.from || ""} profileImage={thread?.profileImage || ""} subject={thread?.subject || ""} />

      {/* Messages List */}
      <MessagesList thread={thread} loading={loading} error={error} />

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