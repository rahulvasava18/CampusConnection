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
            <h3 className="text-lg font-semibold text-gray-800">
              {event.name}
            </h3>
            <button
              onClick={handleLike}
              className={`p-1 rounded-full ${
                isLiked ? "text-red-500" : "text-gray-400"
              }`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User size={14} className="mr-1" />
            <span className="mr-3">{event.hostName}</span>
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
        console.log("Events data fetched:", data);

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
    <div className="min-h-screen max-w-6xl mx-auto bg-indigo-100 p-4 md:p-8">
      <div className="bg-white max-w-6xl mx-auto p-8 rounded-2xl shadow">
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
