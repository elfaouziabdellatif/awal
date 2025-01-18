import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const PostComponent = ({ userInfo }) => {
  const [postContent, setPostContent] = useState({
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setPostContent((prevContent) => ({
      ...prevContent,
      content: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostContent((prevContent) => ({
      ...prevContent,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post Submitted:", postContent);
    setPostContent({ content: "", image: null });
  };

  return (
    <div className="w-full  mx-auto p-6 bg-white rounded-lg  mt-6 hover:shadow-lg hover:duration-200 border border-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image and Input Area */}
        <div className="flex items-start space-x-3">
          <img
            src={userInfo.profilePicture}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Post Content Area */}
          <div className="w-full flex flex-col gap-0 border rounded-xl bg-gray-50">
            <textarea
              value={postContent.content}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows="3"
              className="w-full bg-gray-100 rounded-t-xl p-3 text-sm text-gray-700 focus:outline-none  resize-none"
            />
            {/* Image Preview (if any) */}
            {postContent.image && (
              <div className="flex pl-3 pb-2 bg-gray-100">
                <img
                  src={URL.createObjectURL(postContent.image)}
                  alt="Preview"
                  className="w-16 h-16 rounded-md object-cover border-2 border-gray-300"
                />
              </div>
            )}
            <div className="flex items-center justify-end py-2  bg-grey-100 rounded-b-xl">
              {/* Image Upload Icon with Tooltip */}
              <label
                htmlFor="file-input"
                className="relative group text-xs text-gray-500 cursor-pointer flex items-center  hover:text-blue-500 transition-all"
              >
                <FaImage size={20} />
                <input
                  type="file"
                  id="file-input"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 w-max bg-black text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Add Image
                </div>
              </label>

              {/* Publish Button Icon with Tooltip */}
              <label 
                htmlFor="file-input"
                className="relative group text-xs text-gray-500 cursor-pointer flex items-center  hover:text-blue-500 transition-all"
                >
              <button
                type="submit"
                className="relative flex items-center space-x-2  text-blue-800 px-4  rounded-lg hover:text-black transition-all"
              >
                <IoMdSend size={20} />
                {/* Tooltip */}
                <div className="absolute left-1/2 transform z-10 -translate-x-1/2 bottom-8 w-max bg-black text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Post
                </div>
              </button>
                </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostComponent;
