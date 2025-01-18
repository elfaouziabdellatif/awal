import React from "react";
import { FaUserAlt, FaUsers, FaCalendarAlt, FaHeart, FaThumbsUp, FaUserPlus } from "react-icons/fa";

const LeftSidebar = ({userInfo}) => {
  

  const onlineUsers = [
    { name: "Michael Johnson", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Sarah Lee", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "David Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];

  const friendCount = 250;
  const postCount = 120;
  const likeCount = 750;

  const friendSuggestions = [
    { name: "Alice Smith", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Robert Green", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Emily White", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  ];

  return (
    <div className="flex-col w-1/3 hidden lg:w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg lg:block ">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
        <img src={userInfo.profilePicture} alt="User Avatar" className="w-12 h-12 rounded-full" />
        <div>
          <span className="font-semibold text-lg">{userInfo.username}</span>
          <p className="text-gray-500 text-sm cursor-pointer hover:text-blue-500 transition">View Profile</p>
        </div>
      </div>

      {/* Stats (Not Clickable) */}
      <div className="mt-6 space-y-4">
        <div className="relative group flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition">
          <FaUserAlt size={20} className="text-gray-500" />
          <span className="text-sm">{friendCount} Friends</span>
          <div className="absolute hidden z-10 group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 -bottom-6 right-5 mt-1 transition delay-100">
            Total friends in your network.
          </div>
        </div>
        <div className="flex relative group items-center space-x-2 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition">
          <FaHeart size={20} className="text-gray-500" />
          <span className="text-sm">{likeCount} Likes</span>
          <div className="absolute hidden z-10 group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 -bottom-6 right-5 mt-1 transition delay-100">
            Total friends in your network.
          </div>
        </div>
        <div className="flex relative group items-center space-x-2 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition">
          <FaThumbsUp size={20} className="text-gray-500" />
          <span className="text-sm">{postCount} Posts</span>
          <div className="absolute hidden z-10 group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 -bottom-6 right-5 mt-1 transition delay-100">
            Total friends in your network.
          </div>
        </div>
      </div>

      {/* Friend Suggestions */}
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-lg text-gray-700">Friend Suggestions</h3>
        <div className="space-y-3">
          {friendSuggestions.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition">
              <div className="flex items-center space-x-2">
                <img src={user.avatar} alt="Suggested Friend Avatar" className="w-10 h-10 rounded-full" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600 transition">
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-md cursor-pointer transition">
          <FaUsers size={20} />
          <span className="text-sm">Groups</span>
        </div>
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-md cursor-pointer transition">
          <FaCalendarAlt size={20} />
          <span className="text-sm">Events</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
