import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import ProjectPost from "./ProjectPost";
import ProjectCard from "./ProjectCard";
import axios from "axios";

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myprojects");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Available categories for filtering
  const categories = [
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "Data Science",
    "AI/ML",
    "DevOps",
    "Other"
  ];

  // Fetch projects when My Projects tab is active
  useEffect(() => {
    if (activeTab === "myprojects") {
      fetchProjects();
    }
  }, [activeTab]);

  // Filter and sort projects when any criteria change
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(project => 
        project.category === categoryFilter
      );
    }
    
    // Apply sorting
    switch(sortBy) {
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
  }, [projects, searchQuery, categoryFilter, sortBy]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("/api/projects/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Normalize so projects is always an array
      const data = res.data;
      const projectsArray = Array.isArray(data) ? data : data.projects || [];
      setProjects(projectsArray);
      
      // If no data from API, use dummy data
      if (projectsArray.length === 0) {
        setProjects([
          {
            _id: "1",
            title: "AI Research Platform",
            description: "A project about AI-driven research tools with machine learning capabilities.",
            owner: { name: "Alice", avatar: "https://via.placeholder.com/40" },
            category: "AI/ML",
            status: "completed",
            createdAt: "2023-05-15",
            dueDate: "2023-06-30",
            team: [
              { name: "Alice", avatar: "https://via.placeholder.com/30" },
              { name: "Bob", avatar: "https://via.placeholder.com/30" },
              { name: "Charlie", avatar: "https://via.placeholder.com/30" }
            ]
          },
          {
            _id: "2",
            title: "E-commerce Website",
            description: "An online shop built with React & Node.js with payment integration.",
            owner: { name: "Bob", avatar: "https://via.placeholder.com/40" },
            category: "Web Development",
            status: "in-progress",
            createdAt: "2023-06-01",
            dueDate: "2023-07-15",
            team: [
              { name: "Bob", avatar: "https://via.placeholder.com/30" },
              { name: "Diana", avatar: "https://via.placeholder.com/30" }
            ]
          },
          {
            _id: "3",
            title: "Task Management App",
            description: "Trello-like app for managing tasks with team collaboration features.",
            owner: { name: "Charlie", avatar: "https://via.placeholder.com/40" },
            category: "Mobile App",
            status: "behind",
            createdAt: "2023-04-10",
            dueDate: "2023-05-30",
            team: [
              { name: "Charlie", avatar: "https://via.placeholder.com/30" },
              { name: "Eva", avatar: "https://via.placeholder.com/30" },
              { name: "Frank", avatar: "https://via.placeholder.com/30" },
              { name: "Grace", avatar: "https://via.placeholder.com/30" }
            ]
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Use dummy data if API fails
      setProjects([
        {
          _id: "1",
          title: "AI Research Platform",
          description: "A project about AI-driven research tools with machine learning capabilities.",
          owner: { name: "Alice", avatar: "https://via.placeholder.com/40" },
          category: "AI/ML",
          status: "completed",
          createdAt: "2023-05-15",
          dueDate: "2023-06-30",
          team: [
            { name: "Alice", avatar: "https://via.placeholder.com/30" },
            { name: "Bob", avatar: "https://via.placeholder.com/30" },
            { name: "Charlie", avatar: "https://via.placeholder.com/30" }
          ]
        },
        {
          _id: "2",
          title: "E-commerce Website",
          description: "An online shop built with React & Node.js with payment integration.",
          owner: { name: "Bob", avatar: "https://via.placeholder.com/40" },
          category: "Web Development",
          status: "in-progress",
          createdAt: "2023-06-01",
          dueDate: "2023-07-15",
          team: [
            { name: "Bob", avatar: "https://via.placeholder.com/30" },
            { name: "Diana", avatar: "https://via.placeholder.com/30" }
          ]
        },
        {
          _id: "3",
          title: "Task Management App",
          description: "Trello-like app for managing tasks with team collaboration features.",
          owner: { name: "Charlie", avatar: "https://via.placeholder.com/40" },
          category: "Mobile App",
          status: "behind",
          createdAt: "2023-04-10",
          dueDate: "2023-05-30",
          team: [
            { name: "Charlie", avatar: "https://via.placeholder.com/30" },
            { name: "Eva", avatar: "https://via.placeholder.com/30" },
            { name: "Frank", avatar: "https://via.placeholder.com/30" },
            { name: "Grace", avatar: "https://via.placeholder.com/30" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "behind": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      "Web Development": "bg-blue-100 text-blue-800",
      "Mobile App": "bg-purple-100 text-purple-800",
      "UI/UX Design": "bg-pink-100 text-pink-800",
      "Data Science": "bg-orange-100 text-orange-800",
      "AI/ML": "bg-teal-100 text-teal-800",
      "DevOps": "bg-indigo-100 text-indigo-800",
      "Other": "bg-gray-100 text-gray-800"
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  const getGradientClass = (category) => {
    const gradientMap = {
      "Web Development": "from-blue-400 to-indigo-600",
      "Mobile App": "from-green-400 to-teal-600",
      "UI/UX Design": "from-purple-400 to-pink-600",
      "Data Science": "from-orange-400 to-red-600",
      "AI/ML": "from-teal-400 to-blue-600",
      "DevOps": "from-indigo-400 to-purple-600",
      "Other": "from-gray-400 to-gray-600"
    };
    return gradientMap[category] || "from-gray-400 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Project Dashboard</h1>
            <p className="text-gray-600">Manage and organize your projects</p>
          </div>
          
        </header> */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Project Dashboard</h1>
          <div className="">
            {/* Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveTab("myprojects");
                    navigate("/projects/myproject");
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
              {activeTab === "myprojects" && (
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
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
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

            {/* Routes inside Dashboard */}
            <Routes>
              {/* My Projects */}
              <Route
                path="/myproject"
                element={
                  <>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <i className="fas fa-folder-open text-blue-600"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                            <p className="text-sm text-gray-600">Total Projects</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <i className="fas fa-check-circle text-green-600"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-2xl font-bold text-gray-800">
                              {projects.filter(p => p.status === "completed").length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <i className="fas fa-spinner text-yellow-600"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-2xl font-bold text-gray-800">
                              {projects.filter(p => p.status === "in-progress").length}
                            </p>
                            <p className="text-sm text-gray-600">In Progress</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full">
                            <i className="fas fa-exclamation-circle text-red-600"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-2xl font-bold text-gray-800">
                              {projects.filter(p => p.status === "behind").length}
                            </p>
                            <p className="text-sm text-gray-600">Behind Schedule</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
                            <div
                              key={project._id}
                              className="project-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                              <div className="relative">
                                <div className={`h-40 bg-gradient-to-r ${getGradientClass(project.category)}`}></div>
                                <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 project-card-hover:opacity-100">
                                  <button
                                    onClick={() => navigate(`/projects/edit/${project._id}`)}
                                    className="bg-white p-2 rounded-full shadow-md mr-2 hover:bg-blue-50"
                                  >
                                    <i className="fas fa-edit text-blue-600"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(project._id)}
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-50"
                                  >
                                    <i className="fas fa-trash text-red-600"></i>
                                  </button>
                                </div>
                                <div className="absolute -bottom-6 left-6">
                                  <div className="bg-white p-1 rounded-full shadow-md">
                                    <img
                                      src={project.owner.avatar}
                                      alt="Avatar"
                                      className="w-12 h-12 rounded-full"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-8 pb-4 px-6">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                    {project.status === "in-progress" ? "In Progress" : 
                                     project.status === "behind" ? "Behind" : 
                                     project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(project.category)}`}>
                                    {project.category}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <i className="far fa-calendar text-gray-400 mr-2"></i>
                                    <span className="text-xs text-gray-500">
                                      Due: {new Date(project.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex -space-x-2">
                                    {project.team && project.team.slice(0, 3).map((member, index) => (
                                      <img
                                        key={index}
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-6 h-6 rounded-full border-2 border-white"
                                        title={member.name}
                                      />
                                    ))}
                                    {project.team && project.team.length > 3 && (
                                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                        +{project.team.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-12">
                            <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                            <p className="text-gray-600">No projects found. Try adjusting your search or filters.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
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