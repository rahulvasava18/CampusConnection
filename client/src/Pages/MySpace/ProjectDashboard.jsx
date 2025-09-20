import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import ProjectPost from "./ProjectPost";
import axios from "axios";

import {
  Heart,
  MessageCircle,
  ExternalLink,
  Github,
  Calendar,
  User,
  Tag,
  Code,
  Eye,
  ArrowUpRight,
  Star,
} from "lucide-react";

const ProjectCard = (project) => {
  const [isLiked, setIsLiked] = useState(false);
  const [upvotes, setUpvotes] = useState(247);

 
  const handleUpvote = () => {
    setIsLiked(!isLiked);
    setUpvotes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date"; // fallback
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date"; // invalid date string
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const getTechStackColor = (tech) => {
    const colors = {
      // Frontend
      React: "from-blue-500 to-cyan-400",
      Vue: "from-green-400 to-green-600",
      Angular: "from-red-500 to-red-700",
      Svelte: "from-orange-400 to-orange-600",
      jQuery: "from-indigo-400 to-indigo-600",
      HTML: "from-red-400 to-orange-400",
      CSS: "from-blue-400 to-indigo-600",
      TailwindCSS: "from-teal-400 to-cyan-600",
      Bootstrap: "from-purple-400 to-purple-600",

      // Backend
      Nodejs: "from-green-500 to-emerald-400",
      Express: "from-gray-600 to-gray-400",
      Django: "from-green-700 to-green-900",
      Flask: "from-gray-400 to-gray-600",
      Flutter: "from-red-400 to-red-600",
      Dart: "from-red-500 to-red-700",
      SpringBoot: "from-green-400 to-green-600",

      // Languages
      JavaScript: "from-yellow-400 to-yellow-600",
      TypeScript: "from-blue-400 to-blue-600",
      Python: "from-yellow-500 to-orange-400",
      Java: "from-red-600 to-red-800",
      Kotlin: "from-purple-500 to-purple-700",
      Swift: "from-orange-400 to-orange-600",
      PHP: "from-indigo-500 to-indigo-700",
      C: "from-gray-500 to-gray-700",
      "C++": "from-blue-500 to-blue-700",
      CSharp: "from-green-400 to-green-600",
      Go: "from-cyan-400 to-blue-600",
      Rust: "from-orange-500 to-red-600",

      // Databases
      MongoDB: "from-green-600 to-teal-500",
      PostgreSQL: "from-blue-700 to-blue-900",
      MySQL: "from-blue-500 to-blue-700",
      Redis: "from-red-400 to-red-600",
      SQLite: "from-gray-400 to-gray-600",

      // DevOps / Tools
      Docker: "from-blue-300 to-blue-500",
      Kubernetes: "from-blue-500 to-blue-700",
      Git: "from-red-400 to-red-600",
      GitHub: "from-gray-500 to-gray-700",
      Jenkins: "from-red-500 to-red-700",

      // AI / ML / Data
      TensorFlow: "from-orange-500 to-red-400",
      PyTorch: "from-red-500 to-red-700",
      Pandas: "from-green-400 to-green-600",
      NumPy: "from-blue-400 to-blue-600",
      ScikitLearn: "from-purple-400 to-purple-600",
      OpenCV: "from-gray-500 to-gray-700",

      // Misc / Emerging Tech
      GraphQL: "from-pink-400 to-pink-600",
      Firebase: "from-yellow-400 to-orange-500",
      AWS: "from-orange-400 to-red-500",
      Azure: "from-blue-400 to-indigo-600",
      GoogleCloud: "from-cyan-400 to-blue-500",
    };

    return colors[tech] || "from-gray-500 to-gray-400";
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group border border-gray-100">
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img
          src={project?.image?.url || "https://via.placeholder.com/400x250"}
          alt={""}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 ">
            {project?.category || "Uncategorized"}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <a
            href={project.liveLink}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
            title="View Live Demo"
          >
            <ExternalLink size={16} className="text-gray-700" />
          </a>
          <a
            href={project.repoLink}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
            title="View Source Code"
          >
            <Github size={16} className="text-gray-700" />
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTechStackColor(
                  tech
                )} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors duration-200"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Heart
                size={16}
                className={`transition-all duration-200 ${
                  isLiked ? "fill-current scale-110" : ""
                }`}
              />
              {upvotes}
            </button>

            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MessageCircle size={16} />
              {Array.isArray(project.comments) ? project.comments.length : 0}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Calendar size={12} />
              {formatDate(project.createdAt)}
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-50">
          <img
            src={project?.user?.avatar || "/default-avatar.png"} // fallback avatar
            alt={project?.user?.name || "Unknown User"}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">
              {project?.user?.name || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500">Project Creator</p>
          </div>

          <button className="group/btn flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
            <Eye size={14} />
            View
            <ArrowUpRight
              size={12}
              className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("allprojects");
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const categories = [
  { value: "all", label: "All Categories" },
  { value: "Web Application", label: "Web Application" },
  { value: "Mobile Application", label: "Mobile Application" },
  { value: "Desktop Application", label: "Desktop Application" },
  { value: "API/Backend", label: "API/Backend" },
  { value: "Game", label: "Game" },
  { value: "AI/Machine Learning", label: "AI/Machine Learning" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "IoT/Embedded Systems", label: "IoT/Embedded Systems" },
  { value: "Cloud/DevOps", label: "Cloud/DevOps" },
  { value: "Cybersecurity/Privacy", label: "Cybersecurity/Privacy" },
  { value: "AR/VR (Augmented/Virtual Reality)", label: "AR/VR (Augmented/Virtual Reality)" },
  { value: "Data Science/Analytics", label: "Data Science/Analytics" },
  { value: "Automation/Scripting", label: "Automation/Scripting" },
  { value: "CMS/Website Builder", label: "CMS/Website Builder" },
  { value: "Other", label: "Other" },
];


  // ✅ Fetch ALL projects once
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/project/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const projectsArray = Array.isArray(data) ? data : data.projects || [];
        setAllProjects(projectsArray);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setAllProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ✅ Apply search + filters
  useEffect(() => {
    let result = [...allProjects];

    const userId = localStorage.getItem("userId");

    // If in My Projects tab, filter by loggedInUserId
    if (activeTab === "myprojects" && userId) {
      result = result.filter((p) => p.user === userId);
    }

    // Search
    if (searchQuery) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter((project) => project.category === categoryFilter);
      console.log("After category filter:", result);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [
    allProjects,
    activeTab,
    searchQuery,
    categoryFilter,
    sortBy,
  ]);

  // 🔧 Add these inside ProjectDashboard component
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Project Dashboard
          </h1>
          <div className="">
            {/* Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveTab("allprojects");
                    navigate("/projects");
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === "allprojects"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Projects
                </button>
                <button
                  onClick={() => {
                    setActiveTab("myprojects");
                    navigate("/projects/myprojects");
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === "myprojects"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  My Projects
                </button>
                <button
                  onClick={() => {
                    setActiveTab("addproject");
                    navigate("/projects/create");
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === "addproject"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Add Project
                </button>
              </div>

              {/* Search and Filter - Only show when in My Projects tab */}
              {(activeTab === "myprojects" || activeTab === "allprojects") && (
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={handleCategoryFilterChange}
                      className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-3 text-gray-400 pointer-events-none">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="az">A-Z</option>
                      <option value="za">Z-A</option>
                    </select>
                    <div className="absolute right-2 top-3 text-gray-400 pointer-events-none">
                      <i className="fas fa-sort"></i>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Routes */}
            <Routes>
              {/* All Projects */}
              <Route
                path=""
                element={
                  loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-6xl gap-6">
                      {filteredProjects.map((project) => (
                        <ProjectCard
                          key={project._id}
                          {...project} // spread project properties into ProjectCard
                          showActions={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <i className="fas fa-folder-open text-4xl text-gray-300 mb-4 w-6xl gap-6"></i>
                      <p className="text-gray-600">
                        No projects found. Try adjusting your search or filters.
                      </p>
                    </div>
                  )
                }
              />

              {/* My Projects */}
              <Route
                path="/myprojects"
                element={
                  loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-6xl gap-6">
                      {filteredProjects.map((project) => (
                        <ProjectCard
                          key={project._id}
                          {...project} // spread project properties into ProjectCard
                          showActions={true}
                          navigate={navigate}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-600">
                        No projects found. Try adjusting your search or filters.
                      </p>
                    </div>
                  )
                }
              />

              {/* Add Project */}
              <Route path="/create" element={<ProjectPost />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
