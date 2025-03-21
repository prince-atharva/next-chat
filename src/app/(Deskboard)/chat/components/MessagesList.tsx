"use client";

import React, { useRef, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";

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
  profileImage: string;
  messages: EmailMessage[];
}

const MessagesList: React.FC<{ thread: EmailThread | null; loading: boolean; error: string | null }> = ({ thread, loading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const myEmail = "prince.khant@atharvasystem.com";

  // Auto-scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [thread]);

  const formatDaySeparator = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "EEEE, MMM d");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-4">
      {/* Loading & Error States */}
      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && !thread && <p>No messages found.</p>}

      {/* Show Messages */}
      {thread?.messages.map((msg, index) => {
        const isMyMessage = thread.email.toLowerCase() === myEmail.toLowerCase();

        return (
          <React.Fragment key={msg.messageId}>
            {index === 0 ||
              (format(thread.messages[index - 1].date, "yyyy-MM-dd") !==
                format(msg.date, "yyyy-MM-dd") && (
                  <div className="text-center text-sm font-semibold text-gray-600 my-4">
                    {formatDaySeparator(msg.date)}
                  </div>
                ))}

            <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} gap-2`}>
              {/* Message Bubble */}
              <div
                className={`p-3 max-w-[70%] rounded-lg shadow text-sm w-full break-words overflow-hidden ${isMyMessage ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                  }`}
              >
                <div className="text-xs text-gray-500">{format(new Date(msg.date), "hh:mm a")}</div>

                {/* Ensure HTML content does not affect outside elements */}
                <div
                  className="mt-2 w-full overflow-auto max-w-full"
                  style={{ wordBreak: "break-word", maxWidth: "100%" }}
                >
                  <div
                    className="w-full max-w-full"
                    style={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                </div>
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
