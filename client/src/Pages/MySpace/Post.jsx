import React, { useState, useRef, useCallback } from "react";
import {
  CloudUpload,
  Image,
  X,
  ArrowRight,
  ArrowLeft,
  Eye,
  Send,
  Check,
  Plus,
  GripVertical,
} from "lucide-react";

// Mock FeedCard component for preview
const FeedCard = ({
  user,
  content,
  tags,
  caption,
  createdAt,
  likes,
  comments,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {caption && <p className="text-gray-800 mb-2 font-medium">{caption}</p>}
        {content.text && (
          <p className="text-gray-700 whitespace-pre-wrap">{content.text}</p>
        )}
      </div>

      {/* Image */}
      {content.image && (
        <div className="w-full">
          <img
            src={content.image}
            alt="Post content"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>❤️ {likes}</span>
          <span>💬 {comments.length}</span>
        </div>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const Post = () => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState("regular");
  const [isPrivate, setIsPrivate] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    { number: 1, title: "Media & Caption", icon: Image },
    { number: 2, title: "Preview & Publish", icon: Eye },
  ];
  const token = localStorage.getItem("token");
  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      setImages((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Prepare form data
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("privacy", isPrivate ? "private" : "public");
    tagsArray.forEach((tag) => formData.append("tags[]", tag));
    images.forEach((file) => formData.append("images", file));
    try {
      setLoading(true);

      // Simulate API call
      const response = await fetch("http://localhost:3000/api/post/", {
        timeout: 20000,
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      console.log("Post created successfully!");

      setSuccess("Post created successfully!");

      // Reset form
      setCaption("");
      setTags("");
      setType("regular");
      setIsPrivate(false);
      setImages([]);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const username = localStorage.getItem("username") || "you";
  const fullname = localStorage.getItem("fullname") || "You";

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
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
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-4 transition-all duration-300 ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Post
          </h2>

          <StepIndicator />

          {/* Step Content */}
          <div className="min-h-[500px]">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Add Images & Caption
                </h3>

                {/* Drag & Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <CloudUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop images here
                  </h4>
                  <p className="text-gray-500 mb-4">or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Choose Images</span>
                  </button>
                  <p className="text-xs text-gray-400 mt-2">Maximum 5 images</p>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-300"
                        >
                          <X />
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <GripVertical className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Write a caption for your images..."
                    maxLength={500}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                  />
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {caption.length} / 500
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., photography, travel, inspiration (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas to help others discover your post
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Preview & Publish
                </h3>

                {/* Post Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Images:</span>
                    <span className="text-sm font-medium">
                      {images.length} Selected 
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Caption:</span>
                    <span className="text-sm font-medium">
                      {caption || "No caption provided"} 
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tags:</span>
                    <span className="text-sm font-medium">
                      {tags.split(",").filter((t) => t.trim()).length || 0} tags
                    </span>
                  </div>
                  
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !caption.trim()}
                  className={`w-full py-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                    loading || !caption.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Post</span>
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
          {currentStep < 2 && (
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
                disabled={caption.trim().length === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl
    ${
      caption.trim().length === 0
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
    }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 3 && (
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

export default Post;
