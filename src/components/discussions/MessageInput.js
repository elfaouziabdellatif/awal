import React, { useEffect, useState } from "react";
import { sendMessage } from "../../utils/api";
import { initSocket } from "../../utils/socket";
import { input, tr } from "framer-motion/client";

const MessageInput = ({ selectedUser, userInfo ,setMessages ,setRead,setUsers,socket }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messagelentgh, setMessagelentgh] = useState(0);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if(selectedUser && inputRef.current){
      inputRef.current.focus();
      setMessage("");
    }
    
  }, [selectedUser]);

  const handleSend = async () => {
    if (message.trim()) {
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stoppedTyping", { recipient: selectedUser._id });
      }, 1);
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

  let typingTimeout; // Declare timeout for typing state
let deleteTimeout; // Declare timeout for deletion state
let stopTypingTimeout; // Declare timeout for stopped typing state


const handleIsTyping =  (e) => {
  const messageValue = e.target.value;
  setMessage(messageValue);
  
  // Emit "isTyping" if the user starts typing and the indicator isn't already visible
  if (messageValue.length > 0 && !isTyping) {
    clearTimeout(stopTypingTimeout);
    setMessagelentgh(messageValue.length);
    setIsTyping(true);
    socket.emit("isTyping", { recipient: selectedUser._id });
  }

  // Clear any existing typing timeout to prevent premature "stoppedTyping"
   
   

  // If the message is empty (user deleted text), set a shorter timeout before emitting "stoppedTyping"
  if (messageValue.length === 0 && isTyping) {
     clearTimeout(deleteTimeout); // Clear any previous delete timeout if the message is being re-typed

    // Trigger a stopped typing event after a short delay (e.g., 1 second after the deletion)
    deleteTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stoppedTyping", { recipient: selectedUser._id });
    }, 500); // 1-second delay for empty message (after deletion)
  }  // 10-second delay for stopped typing
  
};
  
useEffect(() => {
  if(message.length > 0){
    stopTypingTimeout = setTimeout(() => {
      if(message.length === messagelentgh){
      setIsTyping(false);
      socket.emit("stoppedTyping", { recipient: selectedUser._id });
    }
    }, 4000);
  }
}
, [messagelentgh]);



  return (
    <div className="flex items-center space-x-4">
      <input
      ref={inputRef}
        type="text"
        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 "
        placeholder="Type a message..."
        value={message}
        onChange={(e) => handleIsTyping(e)}
        onKeyDown={handlekeydown}
        autoFocus={selectedUser ? true : false}
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
