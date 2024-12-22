import React, { useState } from "react";
import { sendMessage } from "../../utils/api";
import { initSocket } from "../../utils/socket";

const MessageInput = ({ selectedUser, userInfo }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {

    if (message.trim()) {
      const socket = initSocket();
      
      sendMessage({
        sender: userInfo.id,
        recipient: selectedUser._id,
        message,
      });
      if(socket)
      {
        socket.emit("sendMessage", {
          senderId: userInfo.id,
          receiverId: selectedUser._id,
          content: message,
        });
        
      }
      
      setMessage(""); // Reset message input after sending
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
