  import Navbar from "../components/layout/navbar";
  import { useSelector } from "react-redux";
  import protectedRoute from "../utils/protectedRouter";
import LeftSide from "../components/home/leftSide";
import { Main } from "next/document";
import MainFeed from "../components/home/mainFeed";
import RightSide from "../components/home/rightSide";


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
  <RightSide onlineUsers={onlineUsers} userInfo={userInfo} />

        

        
      </div>
      
    );
  };

  export default protectedRoute(Home);
