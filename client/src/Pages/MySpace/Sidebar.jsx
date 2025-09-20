import React, { useState } from "react";
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
  FaTimes,
} from "react-icons/fa";

// Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-grey bg-opacity-50 backdrop-blur-xl"
        onClick={onCancel}
      ></div>

      {/* Confirmation Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <FaTimes size={20} />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Confirm Logout
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Are you sure you want to log out? You'll need to sign in again to
          access your account.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>

          {/* Logout Button */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
          >
            Log Out
            <span>
              <FaSignOutAlt className="text-white text-xl" />
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Navigation items configuration
  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/home" },
    { icon: <FaPaperPlane />, label: "Post", path: "/post" },
    { icon: <FaProjectDiagram />, label: "Projects", path: "/projects" },
    { icon: <FaMusic />, label: "Events", path: "/events/all" },
    { icon: <FaComment />, label: "Message", path: "/message" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
  ];

  // Handle logout button click - show confirmation modal
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Handle cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Handle confirm logout
  const handleConfirmLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");

    // Close modal
    setShowLogoutModal(false);
    alert("You have been logged out.");

    // Navigate to login page
    navigate("/");
  };

  // Navigation item styling
  const navItemClass = ({ isActive }) =>
    `flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-3 py-2 rounded-lg font-bold text-base transition-transform duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md text-white"
        : "bg-white text-gray-800"
    } hover:scale-105 hover:shadow-lg hover:bg-blue-100 text-blue-600 hover:text-black`;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col items-center bg-gray- w-64 h-screen p-6 pb-28 text-white shadow-xl fixed top-[64px] left-0">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md border-4 border-white">
            <img
              src={
                user?.url || "https://randomuser.me/api/portraits/men/32.jpg"
              }
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

        {/* Navigation Items */}
        <div className="flex flex-col space-y-4 w-full">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.path} className={navItemClass}>
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 bg-red-600 w-full py-2 px-2 rounded-lg font-bold text-white hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            <FaSignOutAlt />
            <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
