import { FaBell } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const RightSide = ({ onlineUsers }) => {
  const [isOnlineOpen, setIsOnlineOpen] = useState(true);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

  const friendRequestes = [
    { name: "Alice Smith", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Robert Green", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Emily White", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  ];

  return (
    <div className="flex flex-col w-1/5 bg-gray-100 p-4 rounded-lg shadow-lg">
      {/* Collapsible Online Users */}
      <div className="cursor-pointer" onClick={() => setIsOnlineOpen(!isOnlineOpen)}>
        <h3 className="font-semibold flex items-center justify-between">
          Online Users
          <span className="text-sm text-gray-600">
            {isOnlineOpen ? "Hide" : "Show"}
          </span>
        </h3>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOnlineOpen ? 1 : 0, height: isOnlineOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {onlineUsers.map((user) => (
          <div key={user.name} className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-md relative">
            <div className="relative">
             <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>

            </div>
            
            <span>{user.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Collapsible Requests Section */}
      <div
        className="mt-6 flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsRequestsOpen(!isRequestsOpen)}
      >
        <FaBell size={20} />
        <span>Requests</span>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isRequestsOpen ? 1 : 0, height: isRequestsOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-md"
      >
        {isRequestsOpen && (
          <div className="pt-4">
            {friendRequestes.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:bg-gray-50 transition relative">
                <div className="flex items-center space-x-2">
                  <img src={user.avatar} alt="Suggested Friend Avatar" className="w-10 h-10 rounded-full" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600 transition">
                    Accept
                  </button>
                  <button className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600 transition">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RightSide;
