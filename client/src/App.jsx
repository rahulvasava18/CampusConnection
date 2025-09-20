import React from "react";
import { useEffect, useState } from "react";
import { FaLock, FaArrowRight } from "react-icons/fa";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout";

import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import Home from "./Pages/MySpace/Home";
import Profile from "./Pages/MySpace/Profile";
import Post from "./Pages/MySpace/Post";
import Chat from "./Pages/MySpace/Chat";
import Settings from "./Pages/MySpace/Settings";
import ProjectsDashboard from "./Pages/MySpace/ProjectDashboard";
import EventDashboard from "./Pages/MySpace/EventDashboard";

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowPopup(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => setRedirect(true), 3000);
    }
  }, [token]);

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  if (showPopup) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/30 via-black/40 to-black/50 backdrop-blur-sm z-50">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 animate-fade-in-up">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl opacity-50"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <FaLock className="text-white text-2xl" />
                </div>
                {/* Pulse animation ring */}
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 animate-ping"></div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Login Required
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              You need to login first to access this feature.
              <br />
              <span className="text-sm text-gray-500">
                Redirecting you to the login page...
              </span>
            </p>

            {/* Loading indicator */}
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 ml-3">Please wait...</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full animate-progress"></div>
            </div>
           
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-8 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float-delayed"></div>
          <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-float-slow"></div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes progress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes float-delayed {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out;
          }

          .animate-progress {
            animation: progress 3s ease-in-out infinite;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float-delayed 4s ease-in-out infinite;
            animation-delay: 0.5s;
          }

          .animate-float-slow {
            animation: float-slow 5s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}</style>
      </div>
    );
  }

  return children;
};

const App = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes with Layout */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post"
        element={
          <ProtectedRoute>
            <Layout>
              <Post />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/*"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectsDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/*"
        element={
          <ProtectedRoute>
            <Layout>
              <EventDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/message"
        element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
