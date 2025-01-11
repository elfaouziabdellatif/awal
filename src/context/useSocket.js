import React, { createContext, useContext, useEffect, useState } from "react";
import { initSocket, disconnectSocket } from "../utils/socket";

const SocketContext = createContext();

export const SocketProvider = ({ children, token}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      
      const newSocket = initSocket(token);
      newSocket.connect(); // Connect only after initializing with the token
      setSocket(newSocket);

      // Cleanup on unmount or logout
      return () => {
        disconnectSocket();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
