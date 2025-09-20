import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiX, FiUserPlus, FiClock, FiTrendingUp } from "react-icons/fi";

export default function SuggestionBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(null);

  // Default static suggestions
  const defaultSuggestions = [
    { 
      id: 1, 
      name: "Aarav Sharma", 
      username: "aarav_s", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      mutual: 12
    },
    { 
      id: 2, 
      name: "Priya Verma", 
      username: "priya_v", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      mutual: 5
    },
    { 
      id: 3, 
      name: "Tech Hackathon 2025", 
      username: "event_hackathon", 
      avatar: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      isEvent: true
    },
    { 
      id: 4, 
      name: "Rohit Mehta", 
      username: "rohit_m", 
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      mutual: 3
    },
    { 
      id: 5, 
      name: "Sneha Kapoor", 
      username: "sneha_k", 
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      mutual: 8
    },
  ];

  // Recent searches
  const recentSearches = [
    { id: 1, name: "Ananya Gupta", username: "ananya_g" },
    { id: 2, name: "Coding Club", username: "coding_club" },
    { id: 3, name: "Design Workshop", username: "design_workshop" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setError("");

    if (timer) clearTimeout(timer);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    // Debounce → wait 500ms before searching (reduced from 3s for better UX)
    const newTimer = setTimeout(() => {
      fetchResults(value);
    }, 500);

    setTimer(newTimer);
  };

  async function fetchResults(searchText) {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      // simulate API call (replace with real backend URL)
      const res = await axios.get(`http://localhost:5000/api/search?query=${searchText}`);

      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setQuery("");
    setResults([]);
    setError("");
    setLoading(false);
    if (timer) clearTimeout(timer);
  };

  const clearRecentSearches = () => {
    // Logic to clear recent searches from storage
    console.log("Clearing recent searches");
  };

  return (
    <div className=" bg-white rounded-xl shadow-lg w-fit max-h-[750px] overflow-hidden flex flex-col m-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Search</h2>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search people "
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={handleCancel}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-blue-500 font-medium">Searching...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-500 bg-red-50 p-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Search Results */}
        {!loading && query && !error && (
          <div className="p-2">
            {results.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">Search Results</h3>
                <div className="space-y-2">
                  {results.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-0.5 rounded-full">
                            <img
                              src={s.avatar || "https://via.placeholder.com/40"}
                              alt={s.name}
                              className="w-12 h-12 rounded-full border-2 border-white"
                            />
                          </div>
                          {s.isEvent && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                              <FiTrendingUp size={10} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-500">@{s.username}</p>
                          {s.mutual && (
                            <p className="text-xs text-gray-400">{s.mutual} mutual connections</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = `/profile/${s.username}`}
                        className="text-sm bg-white text-blue-500 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FiSearch size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No results found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}

        {!query && !loading && !error && (
          <div className="p-4">
            {/* Suggestions for You */}
            <div>
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <FiUserPlus className="text-purple-500" /> Suggestions For You
              </h3>
              <div className="space-y-4">
                {defaultSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-0.5 rounded-full">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-12 h-12 rounded-full border-2 border-white"
                          />
                        </div>
                        {s.isEvent && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                            <FiTrendingUp size={10} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">@{s.username}</p>
                        {s.mutual && (
                          <p className="text-xs text-gray-400">{s.mutual} mutual connections</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => window.location.href = `/profile/${s.username}`}
                      className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}