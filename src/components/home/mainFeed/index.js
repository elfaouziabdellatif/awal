import { FaCommentDots } from 'react-icons/fa';
import PostComponent from './PostComponent';
import FeedComponent from './FeedComponent';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../../../utils/api';
import { s, tr } from 'framer-motion/client';
import { useSocket } from '../../../context/useSocket';
import { postLikeListener, postUnlikeListener } from '../../../utils/socketevents';
const MainFeed = ({userInfo}) => {
    // const [posts, setPosts] = useState([
    //     {
    //       title: "Amazing Sunset",
    //       content: "Just captured this beautiful sunset today! Nature at its best.",
    //       image: "https://picsum.photos/200/300?random=1",
    //       createdAt: "2025-01-18T10:20:30Z",
    //       userData: {
    //         username: "John Doe",
    //         profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    //       },
    //       likes: ["user1", "user2", "user3"],
    //       comments: [
    //         {
    //           user: { name: "Alice", profilePicture: "https://randomuser.me/api/portraits/men/2.jpg" },
    //           text: "Wow, this is stunning!",
    //         },
    //         {
    //           user: { name: "Bob", profilePicture: "https://randomuser.me/api/portraits/men/3.jpg" },
    //           text: "I love this photo!",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Mountain Adventure",
    //       content: "Had an amazing time hiking the mountain trails. The view was breathtaking!",
    //       image: "https://picsum.photos/200/300?random=2",
    //       createdAt: "2025-01-17T09:15:45Z",
    //       userData: {
    //         username: "Emily Rose",
    //         profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    //       },
    //       likes: ["user2", "user4", "user5"],
    //       comments: [
    //         {
    //           user: { name: "Charlie", profilePicture: "https://randomuser.me/api/portraits/men/4.jpg" },
    //           text: "I want to visit this place next summer!",
    //         },
    //         {
    //           user: { name: "Dave", profilePicture: "https://randomuser.me/api/portraits/men/5.jpg" },
    //           text: "This is on my bucket list for sure!",
    //         },
    //       ],
    //     },
    //     {
    //       title: "City Lights",
    //       content: "The city lights at night are always so mesmerizing. Can't get enough of this view!",
    //       image: "https://picsum.photos/200/300?random=3",
    //       createdAt: "2025-01-16T11:30:20Z",
    //       userData: {
    //         username: "Sophia Green",
    //         profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    //       },
    //       likes: ["user1", "user6", "user7"],
    //       comments: [
    //         {
    //           user: { name: "Olivia", profilePicture: "https://randomuser.me/api/portraits/women/3.jpg" },
    //           text: "This looks so beautiful, I love cityscapes!",
    //         },
    //         {
    //           user: { name: "Mia", profilePicture: "https://randomuser.me/api/portraits/women/4.jpg" },
    //           text: "I wish I could be there right now!",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Ocean Breeze",
    //       content: "Nothing beats the feeling of the ocean breeze on a warm day. Pure bliss.",
    //       image: "https://picsum.photos/200/300?random=4",
    //       createdAt: "2025-01-15T14:50:10Z",
    //       userData: {
    //         username: "Oliver Smith",
    //         profilePicture: "https://randomuser.me/api/portraits/men/6.jpg",
    //       },
    //       likes: ["user3", "user8", "user9"],
    //       comments: [
    //         {
    //           user: { name: "Jack", profilePicture: "https://randomuser.me/api/portraits/men/7.jpg" },
    //           text: "This is exactly what I need after a long week!",
    //         },
    //         {
    //           user: { name: "Lily", profilePicture: "https://randomuser.me/api/portraits/women/5.jpg" },
    //           text: "I can almost feel the breeze from here!",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Snowy Mountains",
    //       content: "Caught the first snow of the season. It’s always magical to see everything covered in white.",
    //       image: "https://picsum.photos/200/300?random=5",
    //       createdAt: "2025-01-14T16:45:55Z",
    //       userData: {
    //         username: "James Carter",
    //         profilePicture: "https://randomuser.me/api/portraits/men/8.jpg",
    //       },
    //       likes: ["user4", "user10", "user11"],
    //       comments: [
    //         {
    //           user: { name: "Sophie", profilePicture: "https://randomuser.me/api/portraits/women/6.jpg" },
    //           text: "This looks so peaceful and serene.",
    //         },
    //         {
    //           user: { name: "Michael", profilePicture: "https://randomuser.me/api/portraits/men/9.jpg" },
    //           text: "I love snow, it makes everything look so pure.",
    //         },
    //       ],
    //     },
    //   ]);
  
    const [posts, setPosts] = useState([]);
    const socket = useSocket(userInfo.token);
      useEffect(() => {

        const getPosts = async () => {
          try {
            const response = await fetchPosts();
            if(response.status === 200 && response.data.length > 0)
            {

              console.log(' post 4 ',response.data[0]);
               setPosts(response.data);
            }

          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        }

        getPosts();

        
       
      }, []);


      
      

    return (
        <div className="w-3/5 max-w-4xl mx-auto p-4">
        {/* Post Component */}
        <PostComponent userInfo={userInfo} />
  
        {/* Feed Component */}
        <FeedComponent posts={posts} setPosts={setPosts} userInfo={userInfo} socket={socket} />
      </div>
    );

}

export default MainFeed;