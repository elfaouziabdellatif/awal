import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL; // Use your backend's Socket.IO endpoint
let socket = null;

// Initialize socket connection
export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true, // Reconnect automatically
      reconnectionAttempts: 5, // Try reconnecting 5 times
      autoConnect: true,
      reconnectionDelay: 1000,  // Delay between reconnection attempts
      reconnectionDelayMax: 5000 // Try to reconnect 5 times 
    });

    // Debugging
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

// Access the socket instance
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first!");
  }
  return socket;
};
