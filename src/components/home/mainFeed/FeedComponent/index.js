import React, { useState } from "react";
import { FaRegThumbsUp, FaCommentDots } from "react-icons/fa";

const FeedComponent = ({ posts }) => {
  return (
    <div className="w-full space-y-4 mt-3">
      {posts.map((post, index) => {
        const [showComments, setShowComments] = useState(false);

        const toggleComments = () => {
          setShowComments(!showComments);
        };

        return (
          <div key={index} className="w-full p-4 border-2 bg-white rounded-lg shadow-sm transition-all">
            {/* User Info Section */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
              <img
                src={post?.userdata?.profilePicture}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{post?.userdata?.username}</h3>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Post Content */}
            <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-3">{post.content}</p>

            {/* Post Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl} // Show image from online source
                alt="Post"
                className="w-full h-72 object-contain mt-4 rounded-lg" // Fixed height and responsive width with object-contain
              />
            )}

            {/* Likes and Comments */}
            <div className="flex items-center justify-between mt-4 border-t pt-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex items-center space-x-1">
                  <FaRegThumbsUp size={18} />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaCommentDots size={18} />
                  <span>{post.comments.length}</span>
                </div>
              </div>
              <button className="text-blue-500 text-sm" onClick={toggleComments}>
                {showComments ? "Show Less" : "Show More"}
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-4 space-y-2 ">
              {post.comments.slice(0, showComments ? post.comments.length : 1).map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 border-t pt-4">
                  <img
                    src={comment.user.profilePicture}
                    alt="Comment User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{comment.user.name}</p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeedComponent;
