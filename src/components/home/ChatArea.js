import React, { useEffect, useRef, useState } from "react";
import { fetchMessages,markMessagesAsRead } from "../../utils/api";
import MessageInput from "./MessageInput";
import { useSocket } from "../../context/useSocket";
import { tr } from "framer-motion/client";

const ChatArea = ({ socket , selectedUser, userInfo ,messagesInstantly,setMessagesInstantly,visibilityApp}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [read, setRead] = useState(false);
  const [scrollToUnviewedMessages, setScrollToUnviewedMessages] = useState(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

 
  useEffect(() => {
    if (socket) {
    socket.on("read-receipt", ({ sender, recipient }) => {
      if ( recipient === userInfo.id) {
        
        // Update the `read` status of the messages
        const updatedMessages = messagesRef.current.map((msg) =>
          msg.sender === recipient && msg.recipient === sender
            ? { ...msg, isSeen: true }
            : msg
        );
  
        // Update the ref with the new messages
        setMessages(updatedMessages);
      }
    });
    
  
    return () => socket.off("read-receipt");
  }
  }, [socket]);


  // useEffect(() => {
  //   if (selectedUser) {
  //     console.log(messagesRef)
  //     // Check if the last message to the selected user is not delivered
  //     const lastMessage = messages
  //       .filter((msg) => msg.sender === userInfo.id && msg.recipient === selectedUser._id)
  //       .slice(-1)[0]; // Get the last message sent by the current user to the selected user
  
  //     console.log("Last message:", lastMessage);
  //     if (lastMessage && !lastMessage.isDelivered) {
  //       socket.emit("checkDeliveredMessages", { recipient: selectedUser._id });
  //     }
  //   }
  // }, [selectedUser, socket, userInfo.id , messages]);
  

  // useEffect(() => {
  //   if (selectedUser) {
  //     // Emit to check delivered messages for the selected user
      
  //     // Define the handler function
  //     const handleDeliveredMessagesUpdate = ({ delivredStatus }) => {
  //       if (delivredStatus.delivered) {
  
  //         // Update messages where the sender is the current user and recipient is the selected user
  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) =>
  //             msg.sender === userInfo.id && msg.recipient === selectedUser._id
  //               ? { ...msg, isDelivered: delivredStatus.delivered, deliveredAt: delivredStatus.deliveredAt }
  //               : msg
  //           )
  //         );
  //       }
  //     };
  
  //     // Attach the listener
  //     socket.on("deliveredMessagesUpdate", handleDeliveredMessagesUpdate);
  
  //     // Cleanup the listener on unmount or dependency change
  //     return () => {
  //       socket.off("deliveredMessagesUpdate", handleDeliveredMessagesUpdate);
  //     };
  //   }
  // }, [socket]);
  

  


  useEffect(() => {
    if (selectedUser ) {
      const isImmediateMessage =
        messagesInstantly?.sender === selectedUser._id &&
        messagesInstantly?.recipient === userInfo.id;
      const isLastMessageForCurrentUser =
        messages[messages.length - 1]?.recipient === userInfo.id;
  
      if (isImmediateMessage || isLastMessageForCurrentUser) {
        const readPayload = {
          recipient: userInfo.id,
          sender: selectedUser._id,
          recivedmessage: isImmediateMessage ? messagesInstantly : undefined,
        };
  
  
        socket.emit("markAsRead", readPayload);
        markMessagesAsRead(userInfo.id, selectedUser._id);
      }
    }
  }, [selectedUser, messagesInstantly,messages.length]);
  

  useEffect(() => {
    if (selectedUser) {

      setPage(1);
      setMessages([]);
      loadMessages(1, true, () => {
        // Scroll to bottom after the first messages are loaded
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        
      
    } );
    
    
    }

  }, [selectedUser]);

  useEffect(() => {
    if (page === 1 && messages.length > 0) {
      // Only scroll to the bottom on the first page
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    

  }, [ messages,page]);
  
  useEffect(() => {
    if (messagesInstantly && selectedUser) {
      if (
        messagesInstantly.sender === selectedUser._id &&
        messagesInstantly.recipient === userInfo.id
      ) {
         if(page > 1 && messages.length > 0 && !scrollToUnviewedMessages)  
          {
            setScrollToUnviewedMessages(true);
          }
        setMessages((prev) => [...prev, { ...messagesInstantly, isSeen: true }]);
        setMessagesInstantly(null)

      
      }
    }
  }, [messagesInstantly, selectedUser]);
  
  
  

  const  loadMessages =  (page, reset = false, callback) => {
    setLoading(true);
     // Save the current scroll position before loading messages
    const prevScrollTop = chatContainerRef.current.scrollHeight;

    // Simulate loading delay for better UX
    setTimeout(() => {
      fetchMessages(selectedUser._id, userInfo.id, page)
        .then((response) => {
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
            setMessages((prevMessages) =>
              reset ? response.data : [...response.data, ...prevMessages]
            );
            setHasMore(true);
            
            // if (selectedUser && visibilityApp) {
            //   handleMarkAsRead(response.data);
            // }
            
          }
          setScrollHeight(chatContainerRef.current.scrollHeight);
          // Trigger the callback after messages are added
          if (callback) callback(prevScrollTop);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        }).finally(() => {
          setLoading(false);
          // Restore the scroll position after loading messages
          // if(page > 1)
          // {
          //   chatContainerRef.current.scrollTop = scrollPosition;
          // }else{
          //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          // }

        });
          
    }, 500); // Optional: Add delay to improve UX
  };

  

  const handleScroll = () => {
    const scrollTop = chatContainerRef.current.scrollTop;
  
    // If the user scrolls to the top, load more messages
    if (scrollTop === 0 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
  
      loadMessages(page + 1, false, (prevScrollTop) => {
        const newScrollHeight = chatContainerRef.current.scrollHeight;
  
        // Use console.table for comparing old and new scroll values
       
  
        chatContainerRef.current.scrollTop = newScrollHeight- scrollHeight ;
      });
    }
  };
  
  
  

  const scrollToBottom = () => {

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    
    setScrollToUnviewedMessages(false)
  };

  return (
    <div className="chatarea-container flex flex-col w-full h-full relative">
      {/* Chat Header */}
      <div className="selecteduser-container bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white shadow-lg flex items-center">
        {selectedUser ? (
          <>
            <div className="w-10 h-10 bg-white text-teal-500 rounded-full flex items-center justify-center mr-4">
              {selectedUser?.username[0]?.toUpperCase()}
            </div>
            <h6 className="text-2xl font-semibold">{selectedUser.username}</h6>
          </>
        ) : (
          <h6 className="text-2xl font-semibold">Select a user to chat with</h6>
        )}
      </div>
  
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="messages-container overflow-y-auto p-4 bg-gray-50 flex-grow relative"
        onScroll={handleScroll}
      >
        {loading && (
          <div className="loading-spinner text-center py-2 sticky top-0">
            <p className="text-sm text-gray-500">Loading older messages...</p>
            <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
  
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => {
            const isSender = message.sender === userInfo.id;
            const messageAlignment = isSender ? 'self-end' : 'self-start';
            const bubbleColor = isSender ? 'bg-teal-100' : 'bg-white';
            const textColor = 'text-gray-800';
            const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
            return (
              <div key={index} className={`flex flex-col ${messageAlignment} max-w-xs md:max-w-md`}>
                <div className={`p-3 rounded-lg shadow-md ${bubbleColor} ${textColor}`}>
                  <p>{message.message}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1 text-xs text-gray-500">
                    <span>{time}</span>
                    {
                      isSender ?
                       message.isDelivered ?  (
                      <>
                        <i className={`fas fa-check ${message.isSeen ? 'text-blue-500' : ''}`}></i>
                        <i className={`fas fa-check ${message.isSeen ? 'text-blue-500' : ''}`}></i>
                      </>
                    ) : (
                      <i className={`fas fa-check text-gray-500`}></i>
                    )
                      : null
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  
      {/* Scroll-to-Bottom Button */}
      {/* Scroll-to-Bottom Button */}
{scrollToUnviewedMessages && (
  <div
    className="absolute bottom-24 left-0 right-0 flex justify-center items-center"
  >
    <button
      onClick={scrollToBottom}
      className="bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 z-10"
    >
      <i className="fas fa-arrow-down text-lg"></i>
    </button>
  </div>
)}


  
      {/* Message Input */}
      {selectedUser && (
        <div className="bg-white p-4 border-t border-gray-200 relative">
          <MessageInput
            selectedUser={selectedUser}
            userInfo={userInfo}
            setMessages={setMessages}
            setRead={setRead}
          />
        </div>
      )}
    </div>
  );
  
  
  
  
  
};

export default ChatArea;
