import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { acceptFriendRequest, blockUser,  fetchFriendRequests, rejectFriendRequest } from "../../../utils/api";
import { MoreVertical } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const RightSide = ({ onlineUsers, userInfo }) => {
  const [isOnlineOpen, setIsOnlineOpen] = useState(true);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null); // Track which dropdown is open

  const [friendRequestes, setFriendRequestes] = useState([
    { name: "Alice Smith", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Robert Green", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Emily White", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  ]);

  const [slectedRequest, setslectedRequest] = useState(null); // Track the request being accepted

  useEffect(() => {
    const handleFetchFriendRequests = async () => {
      try {
        const response = await fetchFriendRequests(userInfo.id); // Assuming userInfo contains the current user's ID
        if (response.status === 200) {
          setFriendRequestes(response.data); // Assuming the API returns an array of friend requests
        } else if (response.status === 201) {
          setFriendRequestes([]); // No friend requests
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    handleFetchFriendRequests();
  }, []);

  const handleClickOutside = (event) => {
    const target = event.target.closest(".dropdown-menu-request-actions");
    if (!target) {
      setOpenMenuIndex(null); // Close the dropdown if clicked outside
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  

  const handleRequestAction = async (action, requesterId) => {
    let response;
    
    // Perform the appropriate action based on the passed action type
    if (action === 'accept') {
      response = await acceptFriendRequest(userInfo.id, requesterId);
    } else if (action === 'reject') {
      response = await rejectFriendRequest(userInfo.id, requesterId);
    } else if (action === 'block') {
      response = await blockUser(userInfo.id, requesterId);
    }
  
    if (response.status === 200) {
      setslectedRequest(requesterId); // Set the request to accept
  
      // Remove the request after the animation
      setTimeout(() => {
        setFriendRequestes((prevRequests) =>
          prevRequests.filter((request) => request.requester._id !== requesterId)
        );
        setslectedRequest(null); // Reset the request to accept
      }, 500); // Delay removing the request to allow animation to complete
    }
  
    setOpenMenuIndex(null); // Close the dropdown after the action
  };
  return (
    <div className="flex flex-col w-[25%] bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
      {/* Collapsible Online Users */}
      <div className="cursor-pointer" onClick={() => setIsOnlineOpen(!isOnlineOpen)}>
        <h3 className="font-semibold flex items-center justify-between text-lg text-gray-800">
          Online Users
          <span className="text-sm text-gray-600">{isOnlineOpen ? "Hide" : "Show"}</span>
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
              <img src={user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="text-lg text-gray-800">{user.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Collapsible Requests Section */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsRequestsOpen(!isRequestsOpen)}>
        <FaBell size={20} />
        <span className="text-lg text-gray-800">Requests</span>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isRequestsOpen ? 1 : 0, height: isRequestsOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-md"
      >
        {isRequestsOpen && (
          <div className="pt-2 space-y-1">
            <AnimatePresence>
              {friendRequestes.map((request, index) => {
                const mutuals = request.requester.mutualFriends || [{ username: "John Doe" }, { username: "Jane Smith" }, { username: "Alice Johnson" }];
                const mutualCount = mutuals.length;

                let mutualText = "";
                if (mutualCount === 1) {
                  mutualText = <span className="text-sm text-gray-500 mt-1">Mutual friend: <span className="font-semibold">{mutuals[0].username}</span></span>;
                } else if (mutualCount === 2) {
                  mutualText = <span className="text-sm text-gray-500 mt-1">Mutual friends: <span className="font-semibold">{mutuals[0].username}</span> and <span className="font-semibold">{mutuals[1].username}</span></span>;
                } else if (mutualCount > 2) {
                  mutualText = <span className="text-sm text-gray-500 mt-1">Mutual friends: <span className="font-semibold">{mutuals[0].username}</span>, <span className="font-semibold">{mutuals[1].username}</span> and {mutualCount - 2} others</span>;
                }

                return (
                  <motion.div
                    key={request.requester._id }
                    initial={{ opacity: 0, y: -10 }} // Initial position above
                    animate={{ 
                      opacity: slectedRequest === request.requester._id ? 0 : 1, // Fade out if accepted
                      x: slectedRequest === request.requester._id ? -30 : 0, // Slide out if accepted
                      transition: { duration: 0.4}, // Duration of the fade-in effect
                       y: 0 
                      }} // Move to normal position
                    transition={{
                      delay: slectedRequest === request.requester._id ? 0 : index * 0.1, // Delay sliding of other requests
                    }}
                    className={`flex items-center justify-between pb-2 ${friendRequestes.length !== index + 1 && 'border-b-2'} hover:shadow-sm rounded-lg transition-all duration-300 hover:scale-[1.015] relative`}
                  >
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                      <img
                        src={request.requester.profilePicture}
                        alt="Friend Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-base font-semibold text-gray-900">{request.requester.username}</p>
                        {mutualCount > 0 && (
                          <p className="text-sm text-gray-500">{mutualText}</p>
                        )}
                      </div>
                    </div>

                    {/* Dropdown Button */}
                    <div className="absolute right-0 ">
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="rounded-full p-1 hover:bg-gray-100 transition dropdown-menu-request-actions"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 z-40" />
                      </button>

                      <AnimatePresence>
                        {openMenuIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-50 right-0 mt-0 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                          >
                            <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                              <li>
                                <button
                                  className="w-full px-4 py-2 hover:bg-green-50 text-left text-green-600 font-medium"
                                  onClick={() => handleRequestAction('accept', request.requester._id)}
                                >
                                  ✅ Accept
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full px-4 py-2 hover:bg-yellow-50 text-left text-yellow-600 font-medium"
                                  onClick={() => handleRequestAction('reject', request.requester._id)}
                                >
                                  ❌ Decline
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full px-4 py-2 hover:bg-red-50 text-left text-red-600 font-medium"
                                  onClick={() => handleRequestAction('block', request.requester._id)}
                                >
                                  🚫 Block
                                </button>
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RightSide;
