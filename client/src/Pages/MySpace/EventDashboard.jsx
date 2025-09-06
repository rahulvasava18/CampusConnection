import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import EventPost from "./EventPost";
import { Search, Filter, Calendar, MapPin, User, Clock, Heart, Share, ChevronDown } from "lucide-react";

// Event Card Component matching Project Dashboard style
const EventCard = ({ event, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const startDate = new Date(event.date.start);
  const month = startDate.toLocaleString("default", { month: "short" });
  const day = startDate.getDate();
  const time = startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Action buttons */}
      <button
        onClick={() => onDelete(event._id)}
        className="absolute top-2 left-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2"
      >
        ✕
      </button>
      <button
        onClick={() => onEdit(event._id)}
        className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
      >
        ⬆
      </button>

      {/* Event content */}
      <div className="flex">
        {/* Date display */}
        <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-100 text-blue-800 rounded-lg mr-4">
          <span className="text-sm font-semibold">{month}</span>
          <span className="text-xl font-bold">{day}</span>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
            <button
              onClick={handleLike}
              className={`p-1 rounded-full ${isLiked ? "text-red-500" : "text-gray-400"}`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User size={14} className="mr-1" />
            <span className="mr-3">{event.organizer?.name}</span>
            <MapPin size={14} className="mr-1" />
            <span>{event.location?.venue}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Clock size={14} className="mr-1" />
            <span>{time}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{event.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{event.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-3">
                {event.engagement?.interestedCount || 0} interested
              </span>
              <span>{event.engagement?.goingCount || 0} going</span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-blue-600 text-sm"
            >
              {showDetails ? "Less details" : "More details"}
              <ChevronDown size={16} className={`ml-1 transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Event Schedule:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {event.timeline && event.timeline.slice(0, 3).map((item, index) => (
                  <li key={index}>
                    {new Date(item.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - {item.activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Event Dashboard Component
const EventDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Dummy Events data
  const [upcomingEvents] = useState([
    {
      _id: "1",
      name: "Tech Conference 2025",
      description: "An annual gathering of tech enthusiasts and professionals. Join us for a day of inspiring talks, workshops, and networking opportunities with industry leaders.",
      category: "Academic",
      tags: ["Technology", "Innovation", "AI", "Machine Learning", "Networking"],
      organizer: { name: "John Doe" },
      location: { type: "On-campus", venue: "Auditorium A" },
      date: { start: "2025-09-15T10:00:00", end: "2025-09-15T17:00:00" },
      engagement: { upvotes: 45, interestedCount: 120, goingCount: 80 },
      timeline: [
        {
          activity: "Keynote Speech",
          speaker: "Elon Musk",
          time: "2025-09-15T10:00:00",
        },
        {
          activity: "AI Workshop",
          speaker: "Andrew Ng",
          time: "2025-09-15T12:00:00",
        },
      ],
    },
    {
      _id: "2",
      name: "AI Meetup",
      description: "Networking session for AI researchers and developers. Share your projects, learn from others, and connect with like-minded individuals in the AI community.",
      category: "Workshop",
      tags: ["AI", "Machine Learning", "Deep Learning", "Neural Networks"],
      organizer: { name: "Jane Smith" },
      location: { type: "Online", meetingLink: "https://zoom.ai" },
      date: { start: "2025-10-05T14:00:00", end: "2025-10-05T16:00:00" },
      engagement: { upvotes: 32, interestedCount: 85, goingCount: 60 },
    },
    {
      _id: "3",
      name: "Blockchain Summit",
      description: "Exploring the future of blockchain technology and cryptocurrencies. Hear from industry experts about the latest developments and opportunities in the space.",
      category: "Conference",
      tags: ["Blockchain", "Crypto", "Web3", "DeFi"],
      organizer: { name: "Crypto Association" },
      location: { type: "On-campus", venue: "Convention Center" },
      date: { start: "2025-11-20T09:00:00", end: "2025-11-21T18:00:00" },
      engagement: { upvotes: 78, interestedCount: 210, goingCount: 145 },
    },
  ]);

  const [myEvents] = useState([
    {
      _id: "4",
      name: "My Birthday Party",
      description: "Celebration with friends, food, and fun! Join me for an evening of music, games, and great conversations.",
      category: "Social",
      tags: ["Party", "Friends", "Birthday", "Celebration"],
      organizer: { name: "Me" },
      location: { type: "On-campus", venue: "Community Hall" },
      date: { start: "2025-11-01T18:00:00", end: "2025-11-01T23:00:00" },
      engagement: { upvotes: 15, interestedCount: 40, goingCount: 25 },
    },
    {
      _id: "5",
      name: "Hackathon Hosting",
      description: "24-hour coding competition with exciting prizes. Teams will work together to build innovative solutions to real-world problems. Food and drinks provided!",
      category: "Hackathon",
      tags: ["Coding", "Teamwork", "Programming", "Innovation"],
      organizer: { name: "Me" },
      location: { type: "On-campus", venue: "Lab 101" },
      date: { start: "2025-12-12T09:00:00", end: "2025-12-13T09:00:00" },
      engagement: { upvotes: 60, interestedCount: 200, goingCount: 150 },
    },
  ]);

  const tabs = [
    { key: "upcoming", label: "Upcoming Events", path: "/events/upcoming" },
    { key: "myevent", label: "My Events", path: "/events/myevent" },
    { key: "create", label: "Create Event", path: "/events/create" },
  ];

  const categories = [
    "all",
    "Academic",
    "Workshop",
    "Social",
    "Hackathon",
    "Conference",
  ];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "date", label: "Date" },
  ];

  const handleTabClick = (tabKey, path) => {
    setActiveTab(tabKey);
    navigate(path);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    // Delete logic would go here
    console.log("Deleting event:", id);
  };

  const handleEditEvent = (id) => {
    navigate(`/events/edit/${id}`);
  };

  const filteredEvents = (events) => {
    return events
      .filter((event) => {
        const matchesSearch =
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.date.start) - new Date(a.date.start);
        } else if (sortBy === "popular") {
          return (
            b.engagement.goingCount +
            b.engagement.interestedCount -
            (a.engagement.goingCount + a.engagement.interestedCount)
          );
        } else if (sortBy === "date") {
          return new Date(a.date.start) - new Date(b.date.start);
        }
        return 0;
      });
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-indigo-100 p-4 md:p-8">
        {/* <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Events Dashboard</h1>
            <p className="text-gray-600">Manage and organize your events</p>
          </div>
          
        </header> */}
      <div className=" bg-white  max-w-6xl mx-auto p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-gray-800 justify-between items-start md:items-center mb-4 gap-4">Event Dashboard</h1>
        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key, tab.path)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2.5 text-gray-400 pointer-events-none">
                <Filter size={18} />
              </div>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2.5 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-gray-800">{upcomingEvents.length + myEvents.length}</p>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-gray-800">{upcomingEvents.length}</p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-gray-800">{myEvents.length}</p>
            <p className="text-sm text-gray-600">My Events</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-gray-800">
              {upcomingEvents.filter(e => new Date(e.date.start) < new Date()).length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Routes inside Dashboard */}
        <Routes>
          {/* Upcoming Events */}
          <Route
            path="/upcoming"
            element={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents(upcomingEvents).length > 0 ? (
                  filteredEvents(upcomingEvents).map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No upcoming events found.</p>
                  </div>
                )}
              </div>
            }
          />

          {/* My Events */}
          <Route
            path="/myevent"
            element={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents(myEvents).length > 0 ? (
                  filteredEvents(myEvents).map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You haven't created any events yet.</p>
                  </div>
                )}
              </div>
            }
          />

          {/* Create Event */}
          <Route path="/create" element={<EventPost />} />
        </Routes>
      </div>
    </div>
  );
};

export default EventDashboard;