  import Navbar from "../components/layout/navbar";
  import { useSelector } from "react-redux";
  import protectedRoute from "../utils/protectedRouter";
  import {  FaBell, FaCommentDots } from "react-icons/fa";
import LeftSide from "../components/home/leftSide";
import { Main } from "next/document";
import MainFeed from "../components/home/mainFeed";


  const Home = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    

    const onlineUsers = [
      { name: "Michael Johnson", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { name: "Sarah Lee", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { name: "David Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    ];

    return (
      <div className="flex gap-6 px-8 mx-auto mt-10 ">
        
      
  <LeftSide userInfo={userInfo} />
  <MainFeed userInfo={userInfo} />


        

        {/* Right Section (Online Users & Notifications) */}
        <div className="flex flex-col w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4">Online Users</h3>
          {onlineUsers.map((user) => (
            <div key={user.name} className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-md">
              <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
              <span>{user.name}</span>
            </div>
          ))}
          <div className="mt-6 flex items-center space-x-2 cursor-pointer">
            <FaBell size={20} />
            <span>Notifications</span>
          </div>
        </div>
      </div>
      
    );
  };

  export default protectedRoute(Home);
