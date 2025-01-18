import React, { useState } from "react";
import { FaBell, FaEnvelope, FaSearch , FaComment, FaHeart , FaShareAlt ,FaCommentDots} from "react-icons/fa";
import { useSocket } from "../../context/useSocket";
import { clearUserInfo } from "../../store/userSlice";
import { useDispatch } from "react-redux";
const Navbar = ({ userInfo }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const socket = useSocket();
  const dispatch = useDispatch();
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

   // Example notification data
   const notifications = [
    {
      id: 1,
      sender: "John Doe",
      type: "like",
      action: "liked your post",
      time: "2 hours ago",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      sender: "Jane Smith",
      type: "comment",
      action: "commented on your photo",
      time: "5 hours ago",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 3,
      sender: "Michael Johnson",
      type: "share",
      action: "shared your post",
      time: "1 day ago",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  ];

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <FaHeart size={16} className="text-pink-500" />;
      case "comment":
        return <FaCommentDots size={16} className="text-blue-500" />;
      case "share":
        return <FaShareAlt size={16} className="text-green-500" />;
      default:
        return null;
    }
  };
  const handlenavigateToDiscussions = () => {
    window.location.href = "/discussions";
  };

  const handleLogout = async() => {
    if(socket)
    {
      await socket.emit("userLoggedOut");
    }
    
    dispatch(clearUserInfo());
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - Logo or App Name */}
        <div className="flex items-center space-x-6">
          <div className="text-white text-3xl font-extrabold tracking-wide cursor-pointer hover:opacity-80"
          onClick={() => window.location.href = "/home"}>
            Socialize {/* Replace with your app's name */}
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex items-center justify-center w-1/3 max-w-lg mx-auto">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-3 pl-12 pr-4 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 ease-in-out"
              placeholder="Search posts, users..."
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Right - Notifications, Messages, Profile */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative text-white cursor-pointer hover:opacity-100" onClick={toggleNotifications}>
            <FaBell size={24} />

            {/* Notifications Dropdown */}
            {notificationsVisible && (
              <div className="absolute right-0 mt-3 w-96 bg-white text-black rounded-lg shadow-2xl p-5 max-h-96 overflow-y-auto opacity-100 transform scale-100 transition-all z-50 custom-scrollbar">
                <div className="flex flex-col space-y-4">
                  <h3 className="font-semibold text-xl text-gray-800 mb-3">Recent Notifications</h3>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-lg hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
                    >
                      <img
                        src={notification.avatar}
                        alt="Sender Avatar"
                        className="w-12 h-12 rounded-full border-4 border-white"
                      />
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-md text-gray-800">{notification.sender}</span>
                          {renderNotificationIcon(notification.type)}
                        </div>
                        <p className="text-sm text-gray-700">{notification.action}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}

                  {/* See All Button */}
                  <div className="text-center mt-3">
                    <button className="text-sm text-blue-600 hover:underline font-semibold">
                      See all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Messages */}
          <div className="relative text-white cursor-pointer hover:opacity-80">
            <FaEnvelope size={24} onClick={handlenavigateToDiscussions}/>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              5 {/* Example message count */}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            {/* Profile Picture */}
            <div className="flex items-center cursor-pointer group" onClick={toggleDropdown}>
              <img
                src={userInfo.profilePicture}
                alt="User Profile"
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownVisible && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg p-2 opacity-100 transform scale-100 transition-all">
                <div className="flex flex-col">
                  <a href="#" className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm">
                    View Profile
                  </a>
                  <a href="#" className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm">
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
