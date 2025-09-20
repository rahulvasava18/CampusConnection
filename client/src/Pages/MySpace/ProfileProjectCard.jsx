import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Eye,
  ArrowUpRight,
  User,
  Code,
  Image as ImageIcon,
  Clock,
  Database,
  Camera,
} from "lucide-react";

import { FaEllipsisH } from "react-icons/fa";

const ProfileProjectCard = ({ userId, project }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [upvotes, setUpvotes] = useState(project?.upvotes || 0);

  const handleUpvote = () => {
    setIsLiked(!isLiked);
    setUpvotes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // User data state
  const [user, setUser] = useState("");

  useEffect(() => {
    async function fetchUserHeaderData() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !userId) {
          console.warn("No token or userId found in localStorage");
          setUser(null);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        const response = await axios.get(
          `http://localhost:3000/api/user/headerdata/${userId}`,
          config
        );

        if (response.data) {
          console.log("User header data:", response.data);
          setUser(response.data);
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
      }
    }

    fetchUserHeaderData();
  }, []); // depends on `project`

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const formatFullDate = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleString();
  };

  const getTechStackColor = (tech) => {
    const colors = {
      React: "from-blue-500 to-cyan-400",
      "Node.js": "from-green-500 to-emerald-400",
      Python: "from-yellow-500 to-orange-400",
      TensorFlow: "from-orange-500 to-red-400",
      MongoDB: "from-green-600 to-teal-500",
      JavaScript: "from-yellow-400 to-orange-500",
      TypeScript: "from-blue-600 to-blue-400",
      Vue: "from-green-400 to-teal-500",
      Angular: "from-red-500 to-pink-500",
      Express: "from-gray-600 to-gray-400",
    };
    return colors[tech] || "from-gray-500 to-gray-400";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-transform ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-full">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username || "User avatar"}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user?.username
                      ? user.username.charAt(0).toUpperCase()
                      : ":)"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              {user.fullname || "Full Name"}
            </h4>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => alert('Follow feature coming soon!')}>
            Edit
          </button>
          <button className="text-xs bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => alert('Delete feature coming soon!')}>
            Delete
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-4">
          {/* Project Image */}
          <div className="relative overflow-hidden h-64 rounded-2xl">
            <img
              src={
                project?.image?.url ||
                "https://via.placeholder.com/600x300/f3f4f6/9ca3af?text=No+Image"
              }
              alt={project?.title || "Project Image"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            {project?.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-lg">
                  {project.category}
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              {project?.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
                  title="View Live Demo"
                >
                  <ExternalLink size={16} className="text-gray-700" />
                </a>
              )}
              {project?.repoLink && (
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
                  title="View Source Code"
                >
                  <Github size={16} className="text-gray-700" />
                </a>
              )}
            </div>
          </div>

          {/* Project Links */}
          {(project?.repoLink || project?.liveLink) && (
            <div className="flex gap-3">
              {project?.repoLink && (
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <Github size={16} />
                  Source Code
                </a>
              )}
              {project?.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          )}
          {/* Project Metadata */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Database size={16} />
              Project Metadata
            </h5>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project?.createdAt && (
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="text-gray-800 font-medium">
                      {formatFullDate(project.createdAt)}
                    </div>
                  </div>
                )}
                {project?.updatedAt && (
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <div className="text-gray-800 font-medium">
                      {formatFullDate(project.updatedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Project Details */}
        <div className="space-y-5">
          {/* Project Title and Description */}
          <div>
            <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
              {project?.title || "Untitled Project"}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {project?.description ||
                "No description provided for this project."}
            </p>
          </div>

          {/* Tech Stack */}
          {Array.isArray(project?.techStack) &&
            project.techStack.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Code size={16} />
                  Tech Stack
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${getTechStackColor(
                        tech
                      )} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Tags */}
          {Array.isArray(project?.tags) && project.tags.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Tag size={16} />
                Tags
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ArrowUpRight
                  size={16}
                  className={`transition-all duration-200 ${
                    isLiked ? "fill-current scale-110" : ""
                  }`}
                />
                {upvotes} Upvotes
              </button>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MessageCircle size={16} />
                {Array.isArray(project?.comments)
                  ? project.comments.length
                  : 0}{" "}
                Comments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProjectCard;
