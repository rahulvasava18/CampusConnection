import React, { useState, useRef, useCallback } from "react";
import {
  CloudUpload,
  Code,
  X,
  ArrowRight,
  ArrowLeft,
  Eye,
  Send,
  Check,
  Plus,
  GripVertical,
  Github,
  Globe,
  Star,
  Calendar,
  Settings,
} from "lucide-react";

import axios from "axios";

const ProjectPost = () => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("web-app");
  const [status, setStatus] = useState("completed");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const steps = [
    { number: 1, title: "Project Details", icon: Code },
    { number: 2, title: "Project Links", icon: CloudUpload },
    { number: 3, title: "Settings & Tags", icon: Settings },
    { number: 4, title: "Preview & Publish", icon: Eye },
  ];

  const nextStep = () => {
    if (currentStep === 1) {
      if (!title.trim() || !description.trim()) {
        setError("Title and Description are required to proceed.");
        return;
      }
      setError(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Optional validation for step 2
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Optional validation for step 3
      setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

;
const handleSubmit = async (e) => {
    e.preventDefault();  
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required.");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const techArray = techStack
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("repoLink", repoLink);
    formData.append("liveLink", liveLink);
    formData.append("category", category);
    formData.append("status", status);
    tagsArray.forEach((tag) => formData.append("tags[]", tag));
    techArray.forEach((tech) => formData.append("techStack[]", tech));
  
    try{
    const response = await axios.post("/api/projects", { timeout: 5000 } );

    if (response.status === 201 || response.status === 200) {
      setSuccess("Project created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setTechStack("");
      setRepoLink("");
      setLiveLink("");
      setTags("");
      setCategory("web-app");
      setStatus("completed");
      setImages([]);
      setCurrentStep(1);
    }
  } catch (err) {
    if (err.code === "ECONNRESET") {
      console.warn("Connection reset, retrying...");
      return fetchData();
    }
    console.error(err);
    setError("Failed to create project");
  } finally {
    setLoading(false);
  }
};


  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`flex items-center space-x-3 ${
              step.number === currentStep
                ? "text-blue-600"
                : step.number < currentStep
                ? "text-green-500"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.number === currentStep
                  ? "border-blue-600 bg-blue-50"
                  : step.number < currentStep
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium whitespace-nowrap">
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 mx-4 transition-all duration-300 ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Your Project
          </h2>

          <StepIndicator />

          {/* Step Content */}
          <div className="min-h-[500px]">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Project Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your project title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Describe your project, its purpose, features, and what makes it unique..."
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={8}
                  />
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {description.length} / 2000
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="React, Node.js, MongoDB, Express (comma separated)"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    List the technologies, frameworks, and tools used in your
                    project
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Repo & Live Links
                </h3>

                {/* Repository Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repository Link
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://github.com/username/project"
                      value={repoLink}
                      onChange={(e) => setRepoLink(e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Demo Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live Demo Link
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://your-project.com"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Project Settings & Tags
                </h3>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="desktop-app">Desktop Application</option>
                      <option value="api">API/Backend</option>
                      <option value="game">Game</option>
                      <option value="ai-ml">AI/Machine Learning</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="iot">IoT/Embedded Systems</option>
                      <option value="cloud">Cloud/DevOps</option>
                      <option value="cybersecurity">
                        Cybersecurity/Privacy
                      </option>
                      <option value="ar-vr">
                        AR/VR (Augmented/Virtual Reality)
                      </option>
                      <option value="data-science">
                        Data Science/Analytics
                      </option>
                      <option value="automation">Automation/Scripting</option>
                      <option value="cms">CMS/Website Builder</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planning">Planning</option>
                      <option value="paused">Paused</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Tags
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="portfolio, fullstack, responsive, open-source (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags to help others discover your project
                  </p>
                </div>

                {/* Additional Settings */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Additional Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Repository:</span>
                      <span
                        className={
                          repoLink ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {repoLink ? "Added" : "Optional"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Demo:</span>
                      <span
                        className={
                          liveLink ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {liveLink ? "Added" : "Optional"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <span
                        className={
                          images.length > 0 ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {images.length} uploaded
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tech Stack:</span>
                      <span
                        className={
                          techStack ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {techStack.split(",").filter((t) => t.trim()).length ||
                          0}{" "}
                        technologies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Preview & Publish
                </h3>

                {/* Project Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Code className="w-5 h-5 text-purple-600" />
                    <span>Project Summary</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium">
                          {title || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">
                          {category.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
                            status === "completed"
                              ? "bg-green-100 text-green-700"
                              : status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {status.replace("-", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Description:</span>
                        <span className="font-medium">
                          {description.length} characters
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tech Stack:</span>
                        <span className="font-medium">
                          {techStack.split(",").filter((t) => t.trim())
                            .length || 0}{" "}
                          technologies
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Images:</span>
                        <span className="font-medium">
                          {images.length} uploaded
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-purple-200">
                    <span className="text-gray-600">Links:</span>
                    <div className="flex space-x-4">
                      {repoLink && (
                        <span className="flex items-center space-x-1 text-green-600">
                          <Github className="w-4 h-4" />
                          <span>Repository</span>
                        </span>
                      )}
                      {liveLink && (
                        <span className="flex items-center space-x-1 text-blue-600">
                          <Globe className="w-4 h-4" />
                          <span>Live Demo</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !description.trim()}
                  className={`w-full py-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                    loading || !title.trim() || !description.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Publishing Project...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Project</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex justify-start mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPost;
