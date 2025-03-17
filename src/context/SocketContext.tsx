"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { socket } from "@/lib/socket";

interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log("SocketProvider mounted, attempting to connect...");
  
    socket.connect();
  
    socket.on("connect", () => {
      console.log("Connected to WebSocket Server");
      setIsConnected(true);
    });
  
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection failed:", error.message);
    });
  
    return () => {
      socket.disconnect();
      console.log("Disconnected from WebSocket Server");
    };
  }, []);
  

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};