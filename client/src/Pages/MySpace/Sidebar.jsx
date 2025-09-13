import React from "react";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/home" },
    { icon: <FaPaperPlane />, label: "Post", path: "/post" },
    { icon: <FaProjectDiagram />, label: "Projects", path: "/projects/myproject" },
    { icon: <FaMusic />, label: "Events", path: "/events/all" },
    { icon: <FaComment />, label: "Message", path: "/message" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
  ];

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-3 py-2 rounded-lg font-bold text-base transition-transform duration-200
    ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md text-white" : "bg-white text-gray-800"}
    hover:scale-105 hover:shadow-lg hover:bg-blue-100 text-blue-600 hover:text-black`;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col items-center bg-white w-64 h-screen p-6 pb-28 text-white shadow-xl fixed top-[64px] left-0">
        {/* Profile */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md border-4 border-white">
            <img
              src={user?.url || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <NavLink
            to="/profile"
            className="px-4 py-2 flex flex-row items-center gap-3 w-full justify-center bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg font-bold hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            <FaUser /> <span>Profile</span>
          </NavLink>
        </div>

        <hr className="border-t border-[#c6c6c6] w-full mb-6" />

        <div className="flex flex-col space-y-4 w-full">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.path} className={navItemClass}>
              {item.icon} <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 bg-red-600 w-full py-2 px-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            <FaSignOutAlt /> <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white shadow-t border-t border-gray-200">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 py-2 flex flex-col items-center justify-center text-gray-600 ${
                isActive ? "text-blue-600" : ""
              }`
            }
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
