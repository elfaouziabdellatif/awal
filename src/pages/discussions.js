import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../store/userSlice";
import { fetchUsers } from "../utils/api";
import Sidebar from "../components/discussions/SideBar";
import protectedRoute from "../utils/protectedRouter";
import ChatArea from "../components/discussions/ChatArea";
import { useSocket } from "../context/useSocket";
import { tr } from "framer-motion/client";

function Discussions() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [notification, setNotification] = useState();
  const [messagesInstantly, setMessagesInstantly] = useState([]);
  const [visibilityApp, setVisibilityApp] = useState(false);
  const [read, setRead] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);
  const selectedUserRef = useRef(selectedUser)
  
  // Access socket from context
  const socket = useSocket(token);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
    setMessagesInstantly(null)
  }, [selectedUser]);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetchUsers(userInfo);
        
        if(response.data.length > 0)

        {
          setUsers(response.data);
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

   


  useEffect( () => {
    if (socket ) {
      if(socket.connected === false)
      {
        socket.connect();
      }
      socket.emit("userLoggedIn", {
      });
      socket.on("updateOnlineUsers", (updatedOnlineUsers) => {
        if(updatedOnlineUsers !== onlineUsers){
          setOnlineUsers(updatedOnlineUsers);
          // Update users with the new online status
          setUsers((prevUsers) =>
            prevUsers.map((user) => ({
              ...user,
              isOnline: updatedOnlineUsers.some((onlineUser) => onlineUser.id === user._id),
              lastMessage: { 
                ...(user.lastMessage || {}),
                isDelivered : updatedOnlineUsers.some((onlineUser) => onlineUser.id === user._id) ? true : user.lastMessage?.isDelivered,
              },

            }))
            
          );
          setSelectedUser((prevSelectedUser) => {
            if (prevSelectedUser) {
              return {
                ...prevSelectedUser,
                isOnline: updatedOnlineUsers.some(
                  (onlineUser) => onlineUser.id === prevSelectedUser._id
                ),
              };
            }
            return prevSelectedUser;
          });
        }
        
      });
  
      socket.on("receiveMessage", (data) => {
        const { id,sender, recipient, message } = data;
        if (userInfo.id === recipient) {
          setNotification({ sender, message });
          
          if (selectedUserRef.current?._id === sender) {
            setMessagesInstantly(data);
          }
          
            setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user._id === sender) {
                console.log(user)
                return {
                  ...user,
                  unreadMessages:selectedUserRef.current?._id !== sender ? user.unreadMessages + 1 : null,
                  lastMessage: { 
                    ...(user.lastMessage || {}),
                    message,
                    sender,
                    recipient,
                    isSeen:selectedUserRef.current?._id === sender ? true : false,
                  },
                };
              }
              
              return user;
            })
          );
          
        }
      });
      socket.on("typing", (data) => {
        if(selectedUserRef.current?._id === data.userId){
          console.log('this user is typing');
          setIsTyping(true);
        }
        setUsersTyping((prev) => [...prev, data.userId]);
        console.log(usersTyping);
        
      });

      socket.on("stoppedTyping", (data) => {
        if(selectedUserRef.current?._id=== data.userId){
          setIsTyping(false);
        }
        setUsersTyping((prev) => prev.filter((userId) => userId !== data.userId));
      });



      socket.on('disconnect', (reason) => {
        console.log('Disconnected due to:', reason);
        // Optionally, try to reconnect here if needed
      });
      
      return () => {
        socket.off("updateOnlineUsers");
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("stoppedTyping");
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
          notification={notification}
          setNotification={setNotification}
          setUsers={setUsers}
          usersTyping = {usersTyping}
        />
        <ChatArea
          userInfo={userInfo}
          selectedUser={selectedUser}
          messagesInstantly={messagesInstantly}
          setMessagesInstantly={setMessagesInstantly}
          visibilityApp={visibilityApp}
          socket={socket}
          setUsers={setUsers}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

export default protectedRoute(Discussions);
