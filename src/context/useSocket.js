import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSocket } from '../utils/socket';

const SocketContext = createContext();

export const SocketProvider = ({ children, userInfo }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userInfo?.id) {
      const newSocket = initSocket();
      newSocket.emit("userLoggedIn", {
        username: userInfo.username,
        userId: userInfo.id,
      });
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
