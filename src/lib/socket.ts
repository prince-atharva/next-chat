import { io, Socket } from "socket.io-client";

const socketInstance: Socket = io({
  autoConnect: false,
});

export const socket = socketInstance;