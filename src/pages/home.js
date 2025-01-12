import React, { use, useEffect, useRef, useState } from "react";
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
  const [selectedUser, setSelectedUser] = useState();
  const [notification, setNotification] = useState();
  const [messagesInstantly, setMessagesInstantly] = useState([]);
  const [visibilityApp, setVisibilityApp] = useState(false);
  const [read, setRead] = useState();
  const selectedUserRef = useRef(selectedUser)
  // Access socket from context
  const socket = useSocket();
  useEffect(() => {
    selectedUserRef.current = selectedUser;
    setMessagesInstantly(null)
  }, [selectedUser]);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetchUsers(userInfo);
        setUsers(response.data);
        if(response.data.length > 0)
        {
          setSelectedUser(response.data[0]);
        }
         // Assume response.data contains the user list
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
    if (socket ) {

      socket.on("updateOnlineUsers", (updatedOnlineUsers) => {
        setOnlineUsers(updatedOnlineUsers);
        // Update users with the new online status
        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            isOnline: updatedOnlineUsers.some((onlineUser) => onlineUser.id === user._id),
          }))
        );
        console.log("Updated online users", updatedOnlineUsers);
      });
  
      socket.on("receiveMessage", (data) => {
        const { id,sender, recipient, message } = data;
  
        if (userInfo.id === recipient) {
          setNotification({ sender, message });
          
          if (selectedUserRef.current?._id === sender) {
            setMessagesInstantly(data);
          }
        }
      });
      socket.on('disconnect', (reason) => {
        console.log('Disconnected due to:', reason);
        // Optionally, try to reconnect here if needed
      });
      
      return () => {
        socket.off("updateOnlineUsers");
        socket.off("receiveMessage");
        socket.off("disconnect");
      };
    }
  }, [socket]);
  
  
  // useEffect(() => {
  //   // Check for socket connection on visibility change
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       setVisibilityApp(true);
  
  //       if (socket && !socket.connected) {
  //         socket.connect(); // Reconnect if the socket is not connected
  //         socket.emit("userLoggedIn", {
  //           username: userInfo.username,
  //           userId: userInfo.id,
  //         });
  //       }
  //     } else if (document.visibilityState === "hidden") {
  //       setVisibilityApp(false);
  //       if (socket && socket.connected) {
  //         // socket.disconnect(); // Disconnect the socket when the app is not visible
  //       }
  //     }
  //   };
  
  //   // Add the event listener for visibilitychange
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  
  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [socket]);
  

  
  

  const handleLogout = async() => {
    await socket.emit("userLoggedOut");
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
          selectedUser={selectedUser}
          userInfo={userInfo}
          handleLogout={handleLogout}
          notification={notification}
          setNotification={setNotification}
        />
        <ChatArea
          userInfo={userInfo}
          selectedUser={selectedUser}
          messagesInstantly={messagesInstantly}
          setMessagesInstantly={setMessagesInstantly}
          visibilityApp={visibilityApp}
        />
      </div>
    </div>
  );
}

export default protectedRoute(Home);
