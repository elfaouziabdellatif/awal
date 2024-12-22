import React from "react";

const Navbar = ({ userInfo, handleLogout }) => {
  return (
    <div className=" text-white p-4 sticky top-0 shadow-lg">
      <div className="flex justify-between items-center ">
        <div className="text-2xl font-bold">{userInfo.username}</div>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md "
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
