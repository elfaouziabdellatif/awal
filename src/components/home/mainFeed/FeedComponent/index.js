import React, { useState } from "react";
import { FaRegThumbsUp, FaCommentDots } from "react-icons/fa";
import { likePost, commentPost } from "../../../../utils/api";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const FeedComponent = ({ posts, setPosts, userInfo, socket }) => {
  const [newComments, setNewComments] = useState({}); // State for the new comment input
  const [expandedPosts, setExpandedPosts] = useState({}); // Track expanded state for each post

  const toggleComments = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleLike = async (postId) => {
    try {
      const resp = await likePost(postId, userInfo.id); // Await the API response
      if (resp.status === 200 || resp.status === 201) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(userInfo.id);
              return {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== userInfo.id)
                  : [...post.likes, userInfo.id],
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (postId) => {
    const comment = newComments[postId];
    if (!comment) return;
    try {
      const resp = await commentPost(postId, userInfo.id, comment);
      if (resp.status === 200 || resp.status === 201) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                comments: [...post.comments, { user: userInfo, comment, createdAt: new Date() }],
              };
            }
            return post;
          })
        );

        setNewComments((prev) => ({
          ...prev,
          [postId]: "",
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (postId, text) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  return (
    <div className="w-full space-y-4 mt-3">
      {posts.map((post, postIndex) => (
        <div
          key={postIndex}
          className="w-full p-4 border-2 bg-white rounded-lg shadow-sm transition-all"
        >
          {/* User Info Section */}
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
            <img
              src={post?.userdata?.profilePicture}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{post?.userdata?.username}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>

          {/* Post Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-72 object-contain mt-4 rounded-lg"
            />
          )}

          {/* Likes and Comments */}
          <div className="flex items-center justify-between mt-4 border-t pt-4">
            <div className="flex items-center space-x-4 text-gray-500">
              <button
                className={`flex items-center space-x-1 ${
                  post.likes.includes(userInfo.id) && "text-blue-600"
                }`}
                onClick={() => handleLike(post._id)}
              >
                <FaRegThumbsUp size={18} />
                <span>{post.likes.length > 0 && post.likes.length}</span>
              </button>
              <div className="flex items-center space-x-1">
                <FaCommentDots size={18} />
                <span>{post.comments.length}</span>
              </div>
            </div>
            <button
              className="text-blue-500 text-sm"
              onClick={() => toggleComments(post._id)}
            >
              {expandedPosts[post._id] ? "Show Less" : "Show More"}
            </button>
          </div>

          {/* Comments Section */}
<div className="mt-4">
  {/* Scrollable container when expanded */}
  <div
    className={`${
      expandedPosts[post._id] ? "max-h-72 overflow-y-auto custom-scrollbar" : ""
    } space-y-2`}
  >
    {post.comments.slice(
        expandedPosts[post._id] ? 0 : Math.max(0, post.comments.length - 2),
        post.comments.length
      )
          .map((comment, commentIndex) => (
            <motion.div
              key={commentIndex}
              className="flex items-start space-x-2 border-t pt-4"
              initial={{ opacity: 0 ,height:'auto'}}
              animate={{ opacity: 1 ,height:'auto'}}
              exit={{ opacity: 0 ,height:'auto'}}
              transition={{  ease:'easeIn' , duration:0.5}}
            >
              <img
                src={comment.user.profilePicture}
                alt="Comment User"
                className="w-8 h-8 mt-2 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold cursor-pointer w-fit hover:underline">
                  {comment.user.username}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {comment.comment}
                  </span>{" "}
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
  </div>

  

  {/* Add Comment Input */}
  <div className="mt-4 flex items-center space-x-2">
    <input
      type="text"
      className="flex-1 p-2 border rounded-md"
      placeholder="Write a comment..."
      value={newComments[post._id] || ""}
      onChange={(e) => handleCommentChange(post._id, e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
    />
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={() => handleAddComment(post._id)}
    >
      Comment
    </button>
  </div>
</div>

        </div>
      ))}
    </div>
  );
};

export default FeedComponent;
