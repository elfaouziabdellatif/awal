import React from "react";
import Navbar from "../layout/navbar";

const Sidebar = ({
  users,
  onlineUsers,
  setSelectedUser,
  userInfo,
  handleLogout,
  notification,
  selectedUser,
  setNotification,
  setUsers,
  usersTyping,
}) => {
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // removing the icone that count the number of unread messages and modify it to 0 in users state 
    if (user.unreadMessages > 0) {
      const updatedUsers = users.map((u) => {
        if (u._id === user._id) {
          return {
             ...u,
              unreadMessages: 0,
              lastMessage: { 
                ...(u.lastMessage || {}),
                isSeen: true,
             },
        }
        }
        return u;

      });
      setUsers(updatedUsers);
    }

    // Clear notification if the selected user is the sender of the notification
    if (notification && notification.sender === user._id) {
      setNotification(null);
    }
  };

  // Clear notification automatically if already chatting with the sender
  React.useEffect(() => {
    if (
      notification &&
      selectedUser &&
      notification.sender === selectedUser._id
    ) {
      setNotification(null);
    }
  }, [notification, selectedUser, setNotification]);

  return (
    <div className="w-2/5 h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      <Navbar userInfo={userInfo} handleLogout={handleLogout} />
      <h2 className="text-2xl font-semibold mt-6 mb-4 border-b border-gray-700 pb-2">
        Chats
      </h2>
      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const isOnline = user.isOnline;
          const lastMessage = user.lastMessage;
          const isRecipient = lastMessage?.recipient === userInfo.id;
          const hasUnreadMessages =
            isRecipient && lastMessage?.isSeen === false;
          const isUserSelected = selectedUser && selectedUser._id === user._id;

          // Determine the message status icons for sent messages
          const getMessageStatusIcons = () => {
            if (lastMessage?.isDelivered) {
              return (
                <div className="flex items-center gap-1">
                  <i
                    className={`fas fa-check ${
                      lastMessage.isSeen ? "text-blue-500" : "text-gray-500"
                    }`}
                  ></i>
                  <i
                    className={`fas fa-check ${
                      lastMessage.isSeen ? "text-blue-500" : "text-gray-500"
                    }`}
                  ></i>
                </div>
              );
            }
            return (
              <i className="fas fa-check text-gray-500"></i> // Single check for sent but not delivered
            );
          };

          return (
            <div
              key={user._id}
              className={`flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-all shadow-md ${
                isUserSelected ? "border-l-4 border-yellow-500" : ""
              }`}
              onClick={(e) =>{e.preventDefault; handleUserSelect(user)}}
            >
              <div className="flex items-center gap-3 w-full">
                {/* Online status indicator */}
                <div
                  className={`w-4 h-4 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>

                {/* User Info */}
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-lg font-semibold truncate">
                      {user.username}
                    </p>
                    {hasUnreadMessages && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        { user?.unreadMessages } {/* Default to 1 if not provided */}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                  {usersTyping && usersTyping.includes(user._id) ? (
  <p className="transition-opacity duration-300 opacity-70 text-sm text-gray-400">Typing...</p>
) : (
  <p className="transition-opacity duration-300 opacity-60 text-sm text-gray-400 truncate">
    {lastMessage?.message || "No messages yet"}
  </p>
)}

                    <div className="flex items-center gap-2">
                      {lastMessage?.message && lastMessage && (
                        <p className="text-xs text-gray-500">
                          {new Date(lastMessage.timestamp).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      )}
                      {lastMessage?.message && lastMessage &&
                        !isRecipient && ( // Show status icons only if the user is the sender
                          <div className="flex items-center gap-1">
                            {getMessageStatusIcons()}
                          </div>
                        )}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
