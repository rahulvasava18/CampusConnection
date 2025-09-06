import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SEARCH_TYPES = [
  { label: "Friend", value: "friend" },
  { label: "Project", value: "project" },
  { label: "Event", value: "event" },
];

const apiEndpoints = {
  friend: "/api/search/friends",
  project: "/api/search/projects",
  event: "/api/search/events",
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-6">
    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

const NoResult = () => (
  <div className="text-center text-gray-500 py-10 text-lg font-semibold">
    No results found.
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-600 py-10 text-lg font-semibold">
    {message}
  </div>
);

const FriendCard = ({ friend }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
    <img
      src={friend.avatar || "https://i.pravatar.cc/50?u=" + friend.id}
      alt={friend.name}
      className="w-14 h-14 rounded-full object-cover"
    />
    <div>
      <h3 className="font-bold text-lg">{friend.name}</h3>
      <p className="text-gray-500 text-sm">{friend.email}</p>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-5 hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
    <h3 className="text-xl font-semibold">{project.title}</h3>
    <p className="mt-2 text-sm">{project.description}</p>
    <p className="mt-3 text-xs italic opacity-80">Status: {project.status}</p>
  </div>
);

const EventCard = ({ event }) => (
  <div className="border-2 border-yellow-400 rounded-lg p-5 hover:border-yellow-600 transition-colors duration-300 cursor-pointer">
    <h3 className="font-bold text-yellow-700 text-lg">{event.name}</h3>
    <p className="text-gray-700 mt-1">{event.location}</p>
    <p className="text-gray-500 text-sm mt-1">
      Date: {new Date(event.date).toLocaleDateString()}
    </p>
  </div>
);

const Search = () => {
  const [searchType, setSearchType] = useState("friend");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Clear any existing debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Start loading and debounce API call
    setLoading(true);
    setError(null);

    timeoutRef.current = setTimeout(() => {
      // simulate API call with axios
      axios
        .get(apiEndpoints[searchType], { params: { q: query } })
        .then((res) => {
          // simulate 3-4 seconds delay for loading effect
          setTimeout(() => {
            setResults(res.data || []);
            setLoading(false);
          }, 3000 + Math.random() * 1000);
        })
        .catch((err) => {
          setTimeout(() => {
            setError(
              err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            setLoading(false);
          }, 3000 + Math.random() * 1000);
        });
    }, 500);

    return () => clearTimeout(timeoutRef.current);
  }, [query, searchType]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg">
      <div className="relative flex items-center space-x-3">
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {SEARCH_TYPES.find((type) => type.value === searchType)?.label}
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-lg z-20 overflow-hidden">
              {SEARCH_TYPES.map(({ label, value }) => (
                <li
                  key={value}
                  onClick={() => {
                    setSearchType(value);
                    setShowDropdown(false);
                    setResults([]);
                    setQuery("");
                    setError(null);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
                    searchType === value ? "font-semibold text-blue-700" : ""
                  }`}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${searchType}s...`}
            className="w-full pl-10 pr-10 py-3 rounded-r-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1112.5 5a7.5 7.5 0 014.15 11.65z"
            />
          </svg>

          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 space-y-4 min-h-[200px]">
        {loading && <LoadingSpinner />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && results.length === 0 && query.trim() !== "" && (
          <NoResult />
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {searchType === "friend" &&
              results.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}

            {searchType === "project" &&
              results.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}

            {searchType === "event" &&
              results.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
