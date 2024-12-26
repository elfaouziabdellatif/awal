import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../store/userSlice";
import { fetchUsers } from "../utils/api";
import Sidebar from "../components/home/SideBar";
import protectedRoute from "../utils/protectedRouter";
import ChatArea from "../components/home/ChatArea";
import { useSocket } from "../context/useSocket";

function Home() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(); 
  const [messagesInstantly, setMessagesInstantly] = useState([]);
  
  // Access socket from context
  const socket = useSocket();

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
    if (socket && userInfo?.id) {
      socket.emit("userLoggedIn", {
        username: userInfo.username,
        userId: userInfo.id,
      });

      socket.on("updateOnlineUsers", (updatedOnlineUsers) => {
        setOnlineUsers(updatedOnlineUsers);
        setIsLoading(false);
      });

      socket.on("receiveMessage", (data) => {
        const { sender, recipient, message } = data;
        console.log("Message received from", sender, "message:", message);

        if (userInfo.id === recipient) {
          console.log("You've received a message from", sender, ": ", message);
          setNotification({ sender, message });
          setMessagesInstantly(data);
        }
      });

      // Cleanup on unmount
      return () => {
        socket.off("updateOnlineUsers");
        socket.off("receiveMessage");
      };
    }
  }, [socket, userInfo]);

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
          messagesInstantly={messagesInstantly}
        />
      </div>
    </div>
  );
}

export default protectedRoute(Home);
