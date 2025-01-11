import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
let socket = null;

// Initialize socket connection
export const initSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token }, // Send token during handshake
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: false, // Disable auto-connect
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Debugging
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
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

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
