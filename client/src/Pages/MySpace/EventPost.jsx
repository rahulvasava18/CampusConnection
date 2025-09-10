import React, { useState, useRef } from "react";
import { Upload, X, MapPin, Calendar, Hash, Globe, Building, ArrowLeft, ArrowRight, CheckCircle, User, ExternalLink } from "lucide-react";

const EventPost = ({ darkMode, onBack }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hostName, setHostName] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("On-campus");
  const [venue, setVenue] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "Workshop",
    "Seminar",
    "Conference",
    "Hackathon",
    "Networking",
    "Social",
    "Cultural",
    "Sports",
    "Other"
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
    const file = imageFiles[0];
    const newImage = { file, preview: URL.createObjectURL(file) };
    setUploadedImage(newImage);
  };

  const removeImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.preview);
      setUploadedImage(null);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!name.trim() || !description.trim() || !hostName.trim()) {
        setError("Event name, description, and host name are required");
        return;
      }
    }
    setError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep(prev => prev - 1);
  };

  const validateForm = () => {
    if (!name.trim() || !description.trim() || !hostName.trim()) {
      return "Event name, description, and host name are required.";
    }
    if (!dateStart || !dateEnd) {
      return "Start date and end date are required.";
    }
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    if (startDate >= endDate) {
      return "End date must be after start date.";
    }
    if (location !== "Online" && !venue.trim()) {
      return "Venue name is required for on-campus and off-campus events.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    
    let locationData = {
      type: location,
    };
    
    if (location === "Online") {
      if (meetingLink.trim()) {
        locationData.meetingLink = meetingLink.trim();
      }
    } else {
      locationData.venue = venue.trim();
      if (mapLink.trim()) {
        locationData.mapLink = mapLink.trim();
      }
    }
    
    const payload = {
      name: name.trim(),
      description: description.trim(),
      hostName: hostName.trim(),
      category,
      tags: tagsArray,
      location: locationData,
      date: {
        start: new Date(dateStart),
        end: new Date(dateEnd)
      },
      image: uploadedImage?.preview || null,
      comments: [],
      likes: 0,
      createdAt: new Date(),
    };

    setLoading(true);
    
    try {
      console.log('Submitting event data:', payload);
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess("Event created successfully!");
      setTimeout(() => {
        setName("");
        setDescription("");
        setHostName("");
        setCategory("Workshop");
        setTags("");
        setLocation("On-campus");
        setVenue("");
        setMapLink("");
        setMeetingLink("");
        setDateStart("");
        setDateEnd("");
        removeImage();
        setActiveStep(0);
        setSuccess(null);
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      console.error('Error creating event:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.message.includes('400')) {
        setError("Invalid event data. Please check your inputs and try again.");
      } else if (err.message.includes('401')) {
        setError("Authentication required. Please log in and try again.");
      } else if (err.message.includes('403')) {
        setError("You don't have permission to create events.");
      } else if (err.message.includes('500')) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.message || "Failed to create event. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Add Photo", description: "Upload an image for your event (optional)" },
    { title: "Event Details", description: "Tell people about your event and who's hosting" },
    { title: "Location & Time", description: "When and where your event will happen" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {activeStep > 0 && (
            <button
              onClick={handleBack}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-colors`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Create Event
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Step {activeStep + 1} of {steps.length}: {steps[activeStep].description}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                    index === activeStep ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-4 ring-blue-200 scale-110' :
                    index < activeStep ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' :
                    darkMode ? 'bg-gray-700 text-gray-400 border-2 border-gray-600' : 'bg-gray-200 text-gray-600 border-2 border-gray-300'
                  }`}>
                    {index < activeStep ? <CheckCircle size={18} /> : index + 1}
                  </div>
                  <p className={`text-xs mt-2 hidden md:block font-medium max-w-20 text-center transition-colors ${
                    index === activeStep ? 'text-blue-600 font-semibold' :
                    index < activeStep ? 'text-green-600' :
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-2 mx-3 rounded-full transition-all duration-500 ${
                    index < activeStep ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm' :
                    darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="p-6">
            <div className="flex flex-col">
              {activeStep === 0 ? (
                <>
                  <h3 className={`font-bold text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    Add Event Photo (Optional)
                  </h3>
                  <div className="mb-6">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-3 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 cursor-pointer transition-all duration-300 ${
                        isDragging ? 'border-blue-500 bg-blue-50 scale-105' :
                        uploadedImage ? 'border-green-400 bg-green-50' :
                        darkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-400 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      {!uploadedImage ? (
                        <>
                          <div className={`p-6 rounded-full mb-6 ${
                            isDragging ? 'bg-blue-100 text-blue-600' :
                            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                          } shadow-lg transition-all duration-300`}>
                            <Upload size={48} />
                          </div>
                          <p className={`font-bold text-xl mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {isDragging ? 'Drop your photo here!' : 'Upload Event Photo'}
                          </p>
                          <p className={`text-base text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            Drag & drop your image here or click to browse<br />
                            <span className="text-sm font-medium text-blue-600 mt-2 block">Optional - you can skip this step</span>
                          </p>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="relative inline-block mb-4">
                            <img
                              src={uploadedImage.preview}
                              alt="Event preview"
                              className="w-48 h-32 object-cover rounded-xl shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="p-4 rounded-full mb-4 bg-green-100 text-green-600 shadow-lg mx-auto w-fit">
                            <CheckCircle size={32} />
                          </div>
                          <p className="font-bold text-green-600 mb-2">Photo Uploaded Successfully!</p>
                          <p className="text-sm text-gray-600">Click anywhere to change image</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Next Step
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              ) : activeStep === 1 ? (
                <>
                  <h3 className={`font-bold text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    Event Details
                  </h3>
                  <div className="space-y-5 flex-1">
                    {/* Host/Organizer Name */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Host/Organizer Name *
                      </label>
                      <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <User size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <input
                          type="text"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                          placeholder="Who's organizing this event?"
                        />
                      </div>
                    </div>

                    {/* Event Name */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Event Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-400'
                        }`}
                        placeholder="What's your event called?"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Description *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-400'
                        }`}
                        placeholder="Tell people about your event..."
                        rows={4}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              category === cat ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' :
                              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Tags
                      </label>
                      <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <Hash size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                          placeholder="tech, conference, networking (comma separated)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowLeft size={18} />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!name.trim() || !description.trim() || !hostName.trim()}
                      className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold ${
                        name.trim() && description.trim() && hostName.trim() ? 
                        'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' : 
                        'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next Step
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              ) : activeStep === 2 ? (
                <>
                  <h3 className={`font-bold text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    Location & Time
                  </h3>
                  <div className="space-y-5 flex-1">
                    {/* Location Type */}
                    <div>
                      <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Location Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["On-campus", "Off-campus", "Online"].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocation(loc)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                              location === loc ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' :
                              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {loc === "Online" ? <Globe size={14} /> : <Building size={14} />}
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Venue Details for Physical Locations */}
                    {location !== "Online" && (
                      <div className="space-y-4">
                        <div>
                          <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Venue Name *
                          </label>
                          <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <MapPin size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                            <input
                              type="text"
                              value={venue}
                              onChange={(e) => setVenue(e.target.value)}
                              className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                              placeholder="Enter venue name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            Google Maps Link (Optional)
                          </label>
                          <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <ExternalLink size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                            <input
                              type="url"
                              value={mapLink}
                              onChange={(e) => setMapLink(e.target.value)}
                              className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Meeting Link for Online Events */}
                    {location === "Online" && (
                      <div>
                        <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          Meeting Link (Optional)
                        </label>
                        <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                          <Globe size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          <input
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                            placeholder="Zoom, Teams, or other meeting link..."
                          />
                        </div>
                      </div>
                    )}

                    {/* Date Picker Section */}
                    <div className="space-y-4">
                      <div>
                        <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          Start Date & Time *
                        </label>
                        <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                          <Calendar size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          <input
                            type="datetime-local"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white' : 'text-gray-800'}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          End Date & Time *
                        </label>
                        <div className={`flex items-center px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                          <Calendar size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          <input
                            type="datetime-local"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className={`flex-1 ml-2 bg-transparent outline-none ${darkMode ? 'text-white' : 'text-gray-800'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowLeft size={18} />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !dateStart || !dateEnd || (location !== "Online" && !venue.trim())}
                      className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold ${
                        !(loading || !dateStart || !dateEnd || (location !== "Online" && !venue.trim())) ? 
                        'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' : 
                        'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Creating Event...' : 'Create Event'}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-100 border border-red-300 text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-6 p-4 rounded-xl bg-green-100 border border-green-300 text-green-700">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPost;