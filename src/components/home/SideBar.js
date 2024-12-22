import React from "react";
import Navbar from "../layout/navbar";

const Sidebar = ({ users, onlineUsers, setSelectedUser,userInfo,handleLogout ,notification}) => {
  return (
    <div className="w-1/3 h-screen bg-gray-800 text-white p-4 overflow-y-auto ">
      <Navbar userInfo={userInfo} handleLogout={handleLogout} />
      <h2 className="text-2xl font-semibold mt-6 mb-4">Users</h2>
      <div className="flex flex-col gap-4 ">
        {users.map((user) => {
          const isOnline = onlineUsers.some((onlineUser) => onlineUser.userId === user._id);
          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer transition-all"
              onClick={() => setSelectedUser(user)}
            >
              <p className="text-lg font-semibold">{user.username}</p>
              {notification && notification.senderId === user._id && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">New</span>
              )}
              <span
                className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
