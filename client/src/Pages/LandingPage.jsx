import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-blue-400 flex items-center justify-center text-white relative">

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 lg:px-6 py-3">
        {/* Brand Name */}
        <h1
          className="text-lg lg:text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="hidden lg:inline">CampusConnections</span>
          <span className="lg:hidden">CampusConnection</span>
        </h1>

        {/* Auth Buttons */}
        <div className="flex gap-2 lg:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-6 lg:px-4 lg:py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-500 transition text-sm lg:text-base"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-3 py-1 lg:px-4 lg:py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-500 transition text lg:text-base"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Centered Content */}
      <div className="text-center px-4 lg:px-6 max-w-3xl">
        <p className="text-base lg:text-lg text-blue-100 mb-2">Welcome to CampusConnections</p>

        <h1 className="text-2xl lg:text-5xl font-bold mb-4">
          Connecting Ideas, Skills & Students Across Campuses
        </h1>
        <p className="text-base lg:text-xl text-blue-100 mb-8">
          Share ideas, build teams, join hackathons, and learn from mentors —
          all in one innovative platform for students.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 lg:px-6 lg:py-3 bg-white text-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition text-sm lg:text-base"
          >
            Get Started <FaArrowRight />
          </button>
          <button
            onClick={() => navigate("/about")}
            className="px-5 py-2 lg:px-6 lg:py-3 border border-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm lg:text-base"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
