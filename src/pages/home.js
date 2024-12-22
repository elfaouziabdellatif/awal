import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearUserInfo } from "../store/userSlice";
import { initSocket } from "../utils/socket"; 
import Sidebar from "../components/home/SideBar";
import protectedRoute from "../utils/protectedRouter";
import ChatArea from "../components/home/ChatArea";
import Navbar from "../components/layout/navbar";
import { fetchUsers } from "../utils/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Home() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(); 
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetchUsers(userInfo);
        setUsers(response.data); // Assume response.data contains the user list
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (userInfo?.id) {
      loadUsers();
    }
  }, [userInfo]);

  useEffect(() => {
    const initializeSocket = () => {
      const socket = initSocket();

      socket.emit("userLoggedIn", {
        username: userInfo.username,
        userId: userInfo.id,
      });

      socket.on("updateOnlineUsers", (updatedOnlineUsers) => {
        setOnlineUsers(updatedOnlineUsers);
        setIsLoading(false);
      });

      socket.on('receiveMessage', (message) => {
        const { senderId, receiverId ,content} = message;
        console.log('message received from ', senderId, 'content:', content);
        
        if( userInfo.id === receiverId){
          console.log("you've received a message from " , senderId , ': ',content)
          setNotification({senderId, content});
        }
      });

      return () => {
        socket.disconnect();
      };
    };

    if (userInfo.id) {
      const cleanupSocket = initializeSocket();
      return cleanupSocket;
    }
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(clearUserInfo());
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex h-full">
        <Sidebar 
          users={users} 
          onlineUsers={onlineUsers} 
          setSelectedUser={setSelectedUser} 
          userInfo={userInfo}
          handleLogout={handleLogout}
          notification={notification}
        />
        <ChatArea 
          userInfo={userInfo} 
          selectedUser={selectedUser} 
        />
      </div>
    </div>
  );
}

export default protectedRoute(Home);
