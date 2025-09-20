import React from 'react';
import { FaHome, FaUsers, FaCalendar, FaCode, FaHeart, FaComment } from 'react-icons/fa';

const HomePageLoader = () => {
  return (
    <div className="flex  w-auto">
      {/* Main Feed Loader */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          
          {/* Main Loading Animation */}
          <div className="relative mb-8">
            {/* Rotating outer ring */}
            <div className="w-24 h-24 border-4 border-transparent border-r-blue-500 border-t-purple-500 border-l-pink-500 rounded-full animate-spin"></div>
            
            {/* Pulsing inner circle */}
            <div className="absolute inset-2 w-16 h-16 m-auto bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <FaHome className="text-white text-xl animate-bounce" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-80" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Loading Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-pulse">
              Loading Your Feed
            </h2>
            <p className="text-gray-600 text-sm animate-fade-in-out">
              Fetching posts, events, and projects...
            </p>
          </div>

          {/* Content Type Icons */}
          <div className="flex space-x-8 mb-12">
            <div className="flex flex-col items-center animate-float">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <FaUsers className="text-white text-lg" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Posts</span>
            </div>
            
            <div className="flex flex-col items-center animate-float" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <FaCalendar className="text-white text-lg" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Events</span>
            </div>
            
            <div className="flex flex-col items-center animate-float" style={{animationDelay: '0.6s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <FaCode className="text-white text-lg" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: 200px 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-out {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePageLoader;