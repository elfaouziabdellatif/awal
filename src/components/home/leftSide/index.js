import React, { useEffect,useState } from "react";
import { FaUserAlt, FaUsers, FaCalendarAlt, FaHeart, FaThumbsUp, FaUserPlus } from "react-icons/fa";
import { cancelFriendRequest, fetchSuggestionUsers } from "../../../utils/api";
import { motion } from "framer-motion";
import { sendFriendRequest } from "../../../utils/api";
import { Loader2 } from "lucide-react"; // Lucide spinner icon
const LeftSidebar = ({userInfo}) => {
  const [loadingRequest, setLoadingRequest] = useState({status:false,friendId:""});
  const [friendSuggestions, setFriendSuggestions] = useState([
  ]);
  
  const [showMoreModal, setShowMoreModal] = useState(false);
 

  const handleShowMore = () => {
    setShowMoreModal(true);
   
  };


  const onlineUsers = [
    { name: "Michael Johnson", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Sarah Lee", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "David Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];

  const friendCount = 250;
  const postCount = 120;
  const likeCount = 750;

  
  useEffect(() => {
   
    const fetchSuggestions = async () => {
      try {
        const resp = await fetchSuggestionUsers(userInfo.id);
        console.log(resp);
        if (resp.status === 200) {
          setFriendSuggestions(resp.data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }
    fetchSuggestions();
  }, []);

  const handleAddFriend = async (friendId) => {
    // Logic to send a friend request
    setLoadingRequest({status:true,friendId:friendId});
    const response = await sendFriendRequest(userInfo.id, friendId);
    if (response.status === 200) {
      console.log("Friend request sent successfully!");
      setFriendSuggestions((prev) =>
        prev.map((user) =>
          user._id === friendId ? { ...user, friendshipStatus: "pending" } : user
        )

      );
      setTimeout(() => {
        
        setLoadingRequest({status:false,friendId:""});
      }, 200);
    } else {
      console.error("Error sending friend request:", response.data);
       setTimeout(() => {
        
        setLoadingRequest({status:false,friendId:""});
      }, 200);
    }
  };

  const handleCancelRequest = async (friendId) => {
    // Logic to cancel a friend request
    setLoadingRequest({status:true,friendId:friendId});
    const response = await cancelFriendRequest(userInfo.id, friendId);
    if (response.status === 200) {
      console.log("Friend request canceled successfully!");
      setFriendSuggestions((prev) =>
        prev.map((user) =>
          user._id === friendId ? { ...user, friendshipStatus: "no request" } : user
        )
      );
       setTimeout(() => {
        
        setLoadingRequest({status:false,friendId:""});
      }, 200);
    } else {
      console.error("Error canceling friend request:", response.data);
       setTimeout(() => {
        
        setLoadingRequest({status:false,friendId:""});
      }, 200);
    }
  }
  return (
    <div className="flex-col w-2/5 hidden lg:w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg lg:block ">
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
     

<div className="space-y-4">
  {friendSuggestions.slice(0,5).map((user, index) => {
    const isLoading = loadingRequest.friendId === user._id && loadingRequest.status;
    const isPending = user.friendshipStatus === "pending";

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.015]"
      >
        {/* Left: User Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt="Suggested Friend Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-500 mt-0.5">Mutual friend: John Doe</p>
          </div>
        </div>

        {/* Right: Button */}
        <button
  className={`w-[80px] h-[32px] text-xs rounded-md font-semibold flex items-center justify-center gap-1
    transition-all duration-300 focus:outline-none
    ${
      isPending
        ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
        : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
    }
  `}
  onClick={() => {
    if (isPending) {
      handleCancelRequest(user._id);
    } else {
      handleAddFriend(user._id);
    }
  }}
>
  {isLoading ? (
    <Loader2 className="animate-spin w-4 h-4" />
  ) : isPending ? (
    "Cancel"
  ) : (
    "Add"
  )}
</button>

      </motion.div>
    );
  })}
</div>



      <button
        onClick={handleShowMore}
        className="mt-4 w-full bg-gray-200 text-gray-700 text-sm py-2 rounded-full hover:bg-gray-300 transition"
      >
        Show More
      </button>
    </div>
{/* Friend Suggestions Modal */}
{showMoreModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6"
    >
      {/* Close Button */}
      <button
        onClick={() => setShowMoreModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">People You May Know</h2>

      <div className="space-y-4">
        {friendSuggestions.map((user, index) => {
          const isLoading = loadingRequest.friendId === user._id && loadingRequest.status;
          const isPending = user.friendshipStatus === "pending";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between px-5 py-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.profilePicture}
                    alt="Suggested Friend Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mutual friend: John Doe</p>
                </div>
              </div>

              <button
                className={`w-[80px] h-[32px] text-xs rounded-md font-semibold flex items-center justify-center gap-1
                  transition-all duration-300 focus:outline-none
                  ${
                    isPending
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                  }
                `}
                onClick={() => {
                  if (isPending) {
                    handleCancelRequest(user._id);
                  } else {
                    handleAddFriend(user._id);
                  }
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : isPending ? (
                  "Cancel"
                ) : (
                  "Add"
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  </div>
)}

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
