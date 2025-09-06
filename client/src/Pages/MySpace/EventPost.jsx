import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image,
  X,
  MapPin,
  Calendar,
  Tag,
  Hash,
  Globe,
  Building,
  ArrowLeft,
  Heart,
  Bookmark,
  Send
} from "lucide-react";

const EventPost = ({ darkMode, onBack }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("On-campus");
  const [venue, setVenue] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Theme colors
  const themeColors = {
    primary: "#3A5673",    // Dark blue
    secondary: "#51B9CD",  // Teal
    accent: "#AAF1F5",     // Light blue
    light: "#F8E5E6",      // Light pink
  };

  const categories = [
    "Workshop", "Seminar", "Conference", "Hackathon", 
    "Networking", "Social", "Cultural", "Sports", "Other"
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;
    
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (activeStep === 0 && !uploadedImages.length) {
      setError("Please add at least one image");
      return;
    }
    setError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0 && onBack) {
      onBack();
    } else {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !description.trim() || !dateStart || !dateEnd) {
      setError("Name, description, and dates are required.");
      return;
    }

    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

    const payload = {
      name,
      description,
      category,
      tags: tagsArray,
      location: { type: location, venue },
      date: { start: new Date(dateStart), end: new Date(dateEnd) },
      images: uploadedImages.map(img => img.preview),
      comments: [],
      likes: 0,
      createdAt: new Date(),
    };

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Event created successfully!");
      
      // Reset form after success
      setTimeout(() => {
        setName("");
        setDescription("");
        setCategory("Workshop");
        setTags("");
        setLocation("On-campus");
        setVenue("");
        setDateStart("");
        setDateEnd("");
        setUploadedImages([]);
        setActiveStep(0);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Add Photos",
      description: "Upload images for your event"
    },
    {
      title: "Event Details",
      description: "Tell people about your event"
    },
    {
      title: "Review & Post",
      description: "Preview and share your event"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {activeStep > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm`}
            >
              <ArrowLeft size={20} />
            </motion.button>
          ) : (
            <div className="w-10"></div>
          )}
          
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Create Event
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {steps[activeStep].description}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === activeStep 
                      ? `bg-[${themeColors.secondary}] text-white` 
                      : index < activeStep 
                        ? 'bg-green-500 text-white' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < activeStep ? "✓" : index + 1}
                  </div>
                  <p className={`text-xs mt-2 hidden md:block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${index < activeStep ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row">
            {/* Image Upload Section */}
            <div className={`md:w-1/2 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-[500px] flex flex-col`}>
              {activeStep === 0 ? (
                <>
                  <h3 className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    Add Event Photos
                  </h3>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${
                      isDragging 
                        ? `border-[${themeColors.secondary}] bg-[${themeColors.accent}]` 
                        : darkMode 
                          ? 'border-gray-700 hover:border-gray-600' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {uploadedImages.length === 0 ? (
                      <>
                        <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                          <Image size={32} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                        <p className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          Drag photos here
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          or click to browse files
                        </p>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={image.preview}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <div className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center ${
                          darkMode ? 'border-gray-700' : 'border-gray-300'
                        }`}>
                          <Upload size={24} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Upload size={18} /> Add More
                    </button>
                    
                    {uploadedImages.length > 0 && (
                      <button
                        type="button"
                        onClick={handleNext}
                        className={`flex-1 py-3 px-4 bg-[${themeColors.secondary}] text-white rounded-lg hover:bg-[${themeColors.primary}]`}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-full aspect-square max-w-xs">
                    {uploadedImages.length > 0 ? (
                      <img
                        src={uploadedImages[0].preview}
                        alt="Event preview"
                        className="w-full h-full object-cover rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className={`w-full h-full rounded-2xl flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <Image size={48} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                      </div>
                    )}
                    
                    {/* Instagram-style engagement preview */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                          <Heart size={20} className="text-red-500" />
                        </div>
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                          <Send size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <Bookmark size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="md:w-1/2 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {activeStep === 1 ? (
                    <>
                      <h3 className={`font-semibold mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        Event Details
                      </h3>
                      
                      <div className="space-y-5 flex-1">
                        {/* Name */}
                        <div>
                          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Event Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[${themeColors.secondary}] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                            }`}
                            placeholder="What's your event called?"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Description
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[${themeColors.secondary}] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                            }`}
                            placeholder="Tell people about your event..."
                            rows={4}
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Category
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  category === cat
                                    ? `bg-[${themeColors.secondary}] text-white`
                                    : darkMode
                                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Tags
                          </label>
                          <div className={`flex items-center px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-white border-gray-300'
                          }`}>
                            <Hash size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                            <input
                              type="text"
                              value={tags}
                              onChange={(e) => setTags(e.target.value)}
                              className={`flex-1 ml-2 bg-transparent outline-none ${
                                darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                              }`}
                              placeholder="tech, conference, networking (comma separated)"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          type="button"
                          onClick={handleBack}
                          className={`flex-1 py-3 px-4 rounded-lg ${
                            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className={`flex-1 py-3 px-4 bg-[${themeColors.secondary}] text-white rounded-lg hover:bg-[${themeColors.primary}]`}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : activeStep === 2 ? (
                    <>
                      <h3 className={`font-semibold mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        Event Location & Time
                      </h3>
                      
                      <div className="space-y-5 flex-1">
                        {/* Location Type */}
                        <div>
                          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Location Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["On-campus", "Off-campus", "Online"].map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => setLocation(loc)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                                  location === loc
                                    ? `bg-[${themeColors.secondary}] text-white`
                                    : darkMode
                                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {loc === "Online" ? <Globe size={14} /> : <Building size={14} />}
                                {loc}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Venue */}
                        {location !== "Online" && (
                          <div>
                            <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                              Venue
                            </label>
                            <div className={`flex items-center px-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-white border-gray-300'
                            }`}>
                              <MapPin size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className={`flex-1 ml-2 bg-transparent outline-none ${
                                  darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                                }`}
                                placeholder="Enter venue name"
                              />
                            </div>
                          </div>
                        )}

                        {/* Date Picker Section */}
                        <div className="space-y-4">
                          <div>
                            <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                              Start Date & Time
                            </label>
                            <div className={`flex items-center px-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-white border-gray-300'
                            }`}>
                              <Calendar size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <input
                                type="datetime-local"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className={`flex-1 ml-2 bg-transparent outline-none ${
                                  darkMode ? 'text-white' : 'text-gray-800'
                                }`}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                              End Date & Time
                            </label>
                            <div className={`flex items-center px-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-white border-gray-300'
                            }`}>
                              <Calendar size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <input
                                type="datetime-local"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className={`flex-1 ml-2 bg-transparent outline-none ${
                                  darkMode ? 'text-white' : 'text-gray-800'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          type="button"
                          onClick={handleBack}
                          className={`flex-1 py-3 px-4 rounded-lg ${
                            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className={`flex-1 py-3 px-4 bg-[${themeColors.secondary}] text-white rounded-lg hover:bg-[${themeColors.primary}] disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading ? "Posting..." : "Create Event"}
                        </button>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .bg-\[#3A5673\] { background-color: #3A5673; }
        .bg-\[#51B9CD\] { background-color: #51B9CD; }
        .bg-\[#AAF1F5\] { background-color: #AAF1F5; }
        .bg-\[#F8E5E6\] { background-color: #F8E5E6; }
        .hover\:bg-\[#3A5673\]:hover { background-color: #3A5673; }
        .hover\:bg-\[#51B9CD\]:hover { background-color: #51B9CD; }
        .border-\[#51B9CD\] { border-color: #51B9CD; }
        .focus\:ring-\[#51B9CD\]:focus { --tw-ring-color: #51B9CD; }
      `}</style>
    </div>
  );
};

export default EventPost;