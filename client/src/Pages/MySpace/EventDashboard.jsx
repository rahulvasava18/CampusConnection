import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Routes, Route } from "react-router-dom";
import EventPost from "./EventPost";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Clock,
  Heart,
  Share,
  ChevronDown,
} from "lucide-react";

import { ChevronUp, Users } from "lucide-react";

// Event Card Component matching Project Dashboard style
const EventCard = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const startDate = new Date(event.date.start);
  const endDate = new Date(event.date.end);
  const month = startDate.toLocaleString("default", { month: "short" });
  const day = startDate.getDate();
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleGoing = () => setIsGoing(!isGoing);
  const handleUpvote = () => setIsUpvoted(!isUpvoted);

  return (
    <div className="group w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
      <div className="relative p-5 sm:p-6 md:p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-blue-50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out border border-gray-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/3 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex flex-col sm:flex-row relative z-10">
          {/* Date display */}
          <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-2xl mb-4 sm:mb-0 sm:mr-6 shadow-lg shadow-blue-200/50 flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold opacity-90">
              {month.toUpperCase()}
            </span>
            <span className="text-xl sm:text-2xl font-black">{day}</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-gray-800 leading-tight pr-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text mb-2 sm:mb-3 truncate">
              {event.name}
            </h3>

            {/* Host & Venue */}
            <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mb-3 gap-2 sm:gap-4">
              <div className="flex items-center">
                <User size={14} className="mr-2 text-blue-500" />
                <span className="font-semibold text-gray-700 truncate">
                  {event.hostName}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-2 text-green-500" />
                <span className="font-medium truncate">
                  {event.location?.venue}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mb-4 gap-2 sm:gap-4">
              <div className="flex items-center">
                <Clock size={14} className="mr-2 text-purple-500" />
                <span className="font-semibold">
                  {formatTime(startDate)} - {formatTime(endDate)}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={14} className="mr-2 text-blue-500" />
                <span className="font-medium">
                  {startDate.toLocaleDateString()} -{" "}
                  {endDate.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed font-medium line-clamp-4">
              {event.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 text-[10px] sm:text-xs">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-100 via-blue-50 to-purple-100 text-blue-700 font-semibold rounded-full border border-blue-200/50 shadow-sm"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 font-semibold rounded-full border border-gray-200/50">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Upvote & Going buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 text-xs sm:text-sm">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium transition-all duration-300 ${
                  isUpvoted
                    ? "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 shadow-md"
                }`}
              >
                <ChevronUp size={14} /> Upvote
              </button>

              <button
                onClick={handleGoing}
                className={`flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium transition-all duration-300 ${
                  isGoing
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 shadow-md"
                }`}
              >
                <Users size={14} /> Going
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1 font-medium">
                <Heart size={12} className="text-red-400" />
                {event.engagement?.interestedCount || 0} interested
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Users size={12} className="text-green-500" />
                {event.engagement?.goingCount || 0} going
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Main Event Dashboard Component
// ... imports stay the same

const EventDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // NEW: all, upcoming, completed
  const [sortBy, setSortBy] = useState("recent");

  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyEvents = [
    {
      _id: "1",
      name: "React Workshop",
      description: "Learn the basics of React with hands-on coding.",
      category: "Workshop",
      tags: ["React", "Frontend", "JS"],
      location: { venue: "Hall A", mapLink: "" },
      date: {
        start: new Date("2025-09-20T10:00:00"),
        end: new Date("2025-09-20T14:00:00"),
      },
      engagement: { interestedCount: 25, goingCount: 10 },
      createdBy: "123", // matches currentUserId
    },
    {
      _id: "2",
      name: "Hackathon 2025",
      description: "48 hours of building amazing projects with your team.",
      category: "Hackathon",
      tags: ["Coding", "Teams", "Innovation"],
      location: { venue: "Tech Park", mapLink: "" },
      date: {
        start: new Date("2025-10-05T09:00:00"),
        end: new Date("2025-10-07T18:00:00"),
      },
      engagement: { interestedCount: 50, goingCount: 20 },
      createdBy: "999",
    },
    {
      _id: "3",
      name: "Social Meetup",
      description: "Networking and fun activities for students.",
      category: "Social",
      tags: ["Friends", "Meetup"],
      location: { venue: "Café Lounge", mapLink: "" },
      date: {
        start: new Date("2025-08-10T17:00:00"),
        end: new Date("2025-08-10T20:00:00"),
      },
      engagement: { interestedCount: 15, goingCount: 5 },
      createdBy: "456",
    },
  ];

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // or from context

        const { data } = await axios.get(
          "http://localhost:3000/api/event/all",
          {
            timeout: 1000,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.log("No events data received from API. Using dummy data...");
          setAllEvents(dummyEvents);
        } else {
          setAllEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching events:", error.message);
        setAllEvents(dummyEvents); // fallback to dummy data on error
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const userId = localStorage.getItem("userId");

  const currentUserId = userId; // TODO: Replace with logged-in userId from auth

  // ===== Filters =====
  const filteredEvents = (events) => {
    return events
      .filter((event) => {
        const matchesSearch =
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || event.category === categoryFilter;

        const now = new Date();
        let matchesStatus = true;
        if (statusFilter === "upcoming") {
          matchesStatus = new Date(event.date.start) > now;
        } else if (statusFilter === "completed") {
          matchesStatus = new Date(event.date.end) < now;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.date.start) - new Date(a.date.start);
        } else if (sortBy === "popular") {
          return (
            (b.engagement?.goingCount || 0) +
            (b.engagement?.interestedCount || 0) -
            ((a.engagement?.goingCount || 0) +
              (a.engagement?.interestedCount || 0))
          );
        } else if (sortBy === "date") {
          return new Date(a.date.start) - new Date(b.date.start);
        }
        return 0;
      });
  };

  // My Events (filter by createdBy field)
  const myEvents = allEvents.filter(
    (event) => event.createdBy?.userId === currentUserId
  );

  // ===== Tabs =====
  const tabs = [
    { key: "all", label: "All Events", path: "/events/all" },
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

  return (
    <div className="min-h-screen mx-auto bg-indigo-100">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-7xl mx-auto p-8  shadow">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Event Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                navigate(tab.path);
              }}
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

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
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

          {/* Category Filter */}
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

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="completed">Completed Events</option>
            </select>
            <div className="absolute right-2 top-2.5 text-gray-400 pointer-events-none">
              <Calendar size={18} />
            </div>
          </div>

          {/* Sort By */}
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

        {/* Routes */}
        <Routes>
          {/* All Events */}
          <Route
            path="/all"
            element={
              loading ? (
                <p>Loading events...</p>
              ) : filteredEvents(allEvents).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents(allEvents).map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onEdit={(id) => navigate(`/events/edit/${id}`)}
                      onDelete={async (id) => {
                        if (window.confirm("Delete this event?")) {
                          await axios.delete(`/api/events/${id}`);
                          setAllEvents((prev) =>
                            prev.filter((event) => event._id !== id)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No events found.</p>
                </div>
              )
            }
          />

          {/* My Events */}
          <Route
            path="/myevent"
            element={
              loading ? (
                <p>Loading events...</p>
              ) : filteredEvents(myEvents).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents(myEvents).map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onEdit={(id) => navigate(`/events/edit/${id}`)}
                      onDelete={async (id) => {
                        if (window.confirm("Delete this event?")) {
                          await axios.delete(`/api/events/${id}`);
                          setAllEvents((prev) =>
                            prev.filter((event) => event._id !== id)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    You haven’t created any events yet.
                  </p>
                </div>
              )
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
