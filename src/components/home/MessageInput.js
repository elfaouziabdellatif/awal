import React, { useState } from "react";
import { sendMessage } from "../../utils/api";
import { initSocket } from "../../utils/socket";
import { tr } from "framer-motion/client";

const MessageInput = ({ selectedUser, userInfo ,setMessages ,setRead,setUsers}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim()) {
      const socket = initSocket();
      
       const response = await sendMessage({
        sender: userInfo.id,
        recipient: selectedUser._id,
        message,
      })
      
      if(response.status === 201 &&  socket)
      {
        
        await socket.emit("sendMessage", {
          id : crypto.randomUUID().toString(),
          sender: userInfo.id,
          recipient: selectedUser._id,
          message: message,
          timestamp: new Date().toISOString(),
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: userInfo.id,
            recipient: selectedUser._id,
            message: message,
            isDelivered:selectedUser.isOnline ? true : false,
            deliveredAt : null,
            timestamp: new Date().toISOString(),
            
          },
        ]);

        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === selectedUser._id) {
              return {
                ...user,
                lastMessage: { 
                  ...(user.lastMessage || {}),
                  sender:userInfo.id,
                  recipient: selectedUser._id,
                  message,
                  isDelivered:selectedUser.isOnline ? true : false,
                  isSeen: false,
                  timestamp: new Date().toISOString(),
                },
              };
            }
            
            return user;
          })
        )
        
        
      }
      
      
      setRead(false);
      setMessage(""); // Reset message input after sending
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handlekeydown}
      />
      <button
        onClick={handleSend}
        
        className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-all"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
