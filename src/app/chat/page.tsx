"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";

export default function ChatPage() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: string) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  // Send message (optimized with useCallback)
  const sendMessage = useCallback(() => {
    if (input.trim() && socket) {
      socket.emit("message", input);
      setInput("");
    }
  }, [input, socket]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Live Chat</h1>

      {/* Connection Status */}
      <div className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
        {isConnected ? "Connected ✅" : "Disconnected ❌"}
      </div>

      {/* Chat Messages */}
      <div className="border p-4 h-64 overflow-auto bg-gray-100 rounded-md mt-2">
        {messages.length === 0 && <p className="text-gray-500">No messages yet...</p>}
        {messages.map((msg, index) => (
          <p key={index} className="border-b py-1">{msg}</p>
        ))}
        <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 mt-4">
        <input
          className="border p-2 flex-grow rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key
        />
        <button
          className={`p-2 text-white rounded-md ${isConnected ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={sendMessage}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
}
