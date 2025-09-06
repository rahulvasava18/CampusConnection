import React from "react";
import { FaUserCircle } from "react-icons/fa";


const Navbar = () => {
  const username = localStorage.getItem("username") || "User";
  return (
    <div className="flex items-center justify-between bg-blue-400 px-6 py-3 shadow-md">
      {/* Logo */}
      <h1 className="text-white font-bold text-lg">CampusConnection</h1>

      {/* User info */}
      <div className="flex items-center space-x-2">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="user"
          className="w-10 h-10 rounded-full border"
        />
        <div className="text-white">
          <p className="font-semibold">{username}</p>
          <p className="text-sm text-black">online</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
