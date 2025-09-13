import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPaperPlane,
  FaProjectDiagram,
  FaMusic,
  FaComment,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

const Sidebar = ({ user }) => {
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Button styling with hover + active effects
  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-2 rounded-lg font-bold text-base transition-transform duration-200 
    ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md text-white" : "bg-white  text-gray-800"} 
    hover:scale-105 hover:shadow-lg hover:bg-blue-100 text-blue-600  hover:text-black`;

  return (
    <div className="flex flex-col items-center bg-white w-64 h-screen p-6 pb-28 text-white shadow-xl">
      
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-4">
        {/* Profile Picture */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md border-4 border-white">
          <img
            src={user?.url || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Button */}
        <NavLink
          to="/profile"
          className="px-4 py-2 flex flex-row items-center gap-3 w-full justify-center bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg font-bold hover:scale-105 hover:shadow-lg transition-transform duration-200"
        >
          <FaUser /> <span>Profile</span>
        </NavLink>
      </div>

      {/* Separator line */}
      <hr className="border-t border-[#c6c6c6] w-full mb-6" />

      {/* Menu Items */}
      <div className="flex flex-col space-y-4 w-full ">
        <NavLink to="/home" className={navItemClass}>
          <FaHome /> <span>Home</span>
        </NavLink>
        <NavLink to="/post" className={navItemClass}>
          <FaPaperPlane /> <span>Post</span>
        </NavLink>
        <NavLink to="/projects/myproject" className={navItemClass}>
          <FaProjectDiagram /> <span>Projects</span>
        </NavLink>
        <NavLink to="/events/all" className={navItemClass}>
          <FaMusic /> <span>Events</span>
        </NavLink>
        <NavLink to="/message" className={navItemClass}>
          <FaComment /> <span>Message</span>
        </NavLink>
        <NavLink to="/settings" className={navItemClass}>
          <FaCog /> <span>Settings</span>
        </NavLink>
      </div>

      {/* Logout */}
      <div className="mt-auto w-full">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 bg-red-600 w-full py-2 px-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition-transform duration-200"
        >
          <FaSignOutAlt /> <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
