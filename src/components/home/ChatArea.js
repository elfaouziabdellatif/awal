import React, { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../../utils/api";
import MessageInput from "./MessageInput";

const ChatArea = ({ selectedUser, userInfo }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

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

  // Scroll to the bottom when the component is first loaded or messages change
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [ selectedUser]);

  const loadMessages = (page, reset = false, callback) => {
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
  useEffect(() => {
    if (page === 1 && messages.length > 0) {
      // Only scroll to the bottom on the first page
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, page]);
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
    chatContainerRef.current.scrollToBottom = 0
    setIsAtBottom(true);
  };

  return (
    <div className="chatarea-container flex flex-col w-full ">
      {/* Chat header */}
      <div className="selecteduser-container bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white shadow-lg">
        {selectedUser ? (
          <h6 className="text-2xl font-semibold">{selectedUser.username}</h6>
        ) : (
          <h6 className="text-2xl font-semibold">Select a user to chat with</h6>
        )}
      </div>

      {/* Messages container */}
      <div
        ref={chatContainerRef}
        className="messages-container overflow-y-auto p-4 bg-gray-100 relative"
        onScroll={handleScroll}
      >
        {loading && (
          <div className="loading-spinner text-center py-2 sticky top-0">
            <p className="text-sm text-gray-500">Loading older messages...</p>
            <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div
        className="flex flex-col gap-4"
        >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg shadow-md ${
              message.sender === userInfo.id
                ? "bg-teal-200 text-right"
                : "bg-white text-left"
            }`}
          >
            <p>{message.message}</p>
          </div>
        ))}
        </div>
        
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="scroll-to-bottom fixed bottom-16 right-8 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
        >
          ⬇ Scroll to Latest
        </button>
      )}

      {/* Message input */}
      {selectedUser && (
        <div className="bg-white p-4 border-t border-gray-200">
          <MessageInput selectedUser={selectedUser} userInfo={userInfo} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
