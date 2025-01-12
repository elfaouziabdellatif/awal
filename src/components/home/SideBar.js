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
}) => {
  const handleUserSelect = (user) => {
    setSelectedUser(user);

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
    <div className="w-1/3 h-screen bg-gray-800 text-white p-4 overflow-y-auto">
      <Navbar userInfo={userInfo} handleLogout={handleLogout} />
      <h2 className="text-2xl font-semibold mt-6 mb-4">Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const isOnline = onlineUsers.some(
            (onlineUser) => onlineUser.id === user._id
          );

          // Determine whether to show the "New" badge
          const showNotificationBadge =
            notification &&
            notification.sender === user._id &&
            (!selectedUser || selectedUser._id !== user._id);

          return (
            <div
              key={user._id}
              className={`flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer transition-all
                ${selectedUser && selectedUser._id === user._id ? "bg-yellow-600" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              <p className="text-lg font-semibold">{user.username}</p>

              {/* Show "New" badge only if not currently chatting with the sender */}
              {showNotificationBadge && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                  New
                </span>
              )}

              {/* Online status indicator */}
              <span
                className={`w-3 h-3 rounded-full ${user.isOnline ? "bg-green-500" : "bg-red-500"}`}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
