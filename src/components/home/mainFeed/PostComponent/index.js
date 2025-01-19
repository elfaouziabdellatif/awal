import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import Image from "next/image";
import { motion } from "framer-motion"; 
import { createPost } from "../../../../utils/api";

const PostComponent = ({ userInfo }) => {
  const [postContent, setPostContent] = useState({
    content: "",
    image: null,
  });

  const [thoughtsActif,setToughtsActif] = useState(false)

  const handleChange = (e) => {
    const { value } = e.target;
    setPostContent((prevContent) => ({
      ...prevContent,
      content: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // Limit size to 2MB
      alert("File size exceeds 2MB. Please select a smaller file.");
      return;
    }
    setPostContent((prevContent) => ({
      ...prevContent,
      image: file,
    }));
  };

  useEffect (() => {
    if(postContent.content.length > 0){
      setToughtsActif(true)
    }
    else{
      setToughtsActif(false)
    }
  },[postContent.content])
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", postContent.content);
    formData.append("image", postContent.image);
    formData.append("userId", userInfo.id);
    console.log(userInfo.id)
    const response = await createPost(formData);
    if(response.status === 201){
      alert("Post created successfully!");
    setPostContent({ content: "", image: null });
    }else if(response.status === 500){
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full  mx-auto p-6 bg-white rounded-lg  mt-6 hover:shadow-lg hover:duration-200 border border-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image and Input Area */}
        <div className="flex items-start space-x-3">
        <div
  className="w-12 h-10 relative rounded-full z-10"
  style={{
    boxShadow: "0 0px 8px rgba(0, 0, 0, 0.4)", // Custom shadow
  }}
>
  <img
    src={userInfo.profilePicture}
    alt="User"
    className="w-12 h-10 rounded-full object-cover"
    style={{
      boxShadow: "0 0px 8px rgba(0, 0, 0, 0.4)", // Slight shadow for image
    }}
  />
           
           <motion.div
  className="absolute -top-7 -right-10 flex items-center justify-center z-20 "
  initial={{ opacity: 0, scale: 0.8 }}
  animate={thoughtsActif ? { opacity: 1, scale: 1 ,right:-35} : { opacity: -10, scale: 0.5 ,right:-15}}
  transition={{
    duration: 0.5,
    stiffness: 200,
  }}
>
<img
  src={'/assets/images/YMXw.gif'}
  alt="Animated GIF"
  className="w-12 h-12 rounded-full object-cover "
/>

  {/* Dots container */}
  <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex space-x-1 z-20">
    {[...Array(3)].map((_, index) => (
      <motion.div
        key={index}
        className="w-1 h-1 bg-gray-800 rounded-full mb-3 "
        animate={{
          y: [0, -5, 0], // Up and down motion
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: index * 0.2, // Stagger the animations
        }}
      />
    ))}
  </div>
</motion.div>

          </div>
          
          {/* Post Content Area */}
          <div className="w-full flex flex-col gap-0 border rounded-xl bg-gray-50 shadow-md">
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
            <div className="flex items-center justify-end py-2 gap-2  bg-grey-100 rounded-b-xl mr-2">
              {/* Image Upload Icon with Tooltip */}
              <label
                htmlFor="file-input"
                className="relative group text-xs  cursor-pointer flex items-center p-2 rounded-3xl bg-green-300 text-white  hover:text-blue-500 transition-all"
              >
                <i className="fa-solid fa-upload"></i>
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
                className="relative group text-xs text-gray-500 cursor-pointer bg-blue-500 rounded-3xl flex items-center  hover:text-blue-500 transition-all"
                >
              <button
  type="submit"
  disabled={!postContent.content && !postContent.image} // Disable if no content or image
  className={`relative flex items-center space-x-2 max-w-fit p-2 text-white rounded-3xl transition-all ${
    !postContent.content && !postContent.image
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"
  }`}
>
  <i className="fa-regular fa-paper-plane"></i>
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
