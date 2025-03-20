"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { format, isToday, isYesterday } from "date-fns";

interface EmailMessage {
  messageId: string;
  subject: string;
  from: string;
  date: string;
  content: string; // HTML formatted content
}

const MessagesList: React.FC = () => {
  const { id: emailid } = useParams();
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const myEmail = "Prince Khant <prince.khant@atharvasystem.com>";
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!emailid) return;

    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/email/${emailid}`);
        setMessages(response.data);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [emailid]);

  // Auto-scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDaySeparator = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "EEEE, MMM d");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-4">
      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && messages.length === 0 && <p>No messages found.</p>}

      {messages.map((msg, index) => {
        const isMyMessage = msg.from.toLowerCase() === myEmail.toLowerCase();

        return (
          <React.Fragment key={msg.messageId}>
            {index === 0 ||
              (format(messages[index - 1].date, "yyyy-MM-dd") !==
                format(msg.date, "yyyy-MM-dd") && (
                  <div className="text-center text-sm font-semibold text-gray-600 my-4">
                    {formatDaySeparator(msg.date)}
                  </div>
                ))}

            <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} gap-2`}>
              {/* Message Bubble */}
              <div
                className={`p-3 max-w-[70%] rounded-lg shadow text-sm break-words ${isMyMessage ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                  }`}
              >
                <div className="font-semibold">{msg.from}</div>
                <div className="text-xs text-gray-500">{format(new Date(msg.date), "hh:mm a")}</div>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
