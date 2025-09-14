import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  ExternalLink,
  ArrowUp,
  TrendingUp,
} from "lucide-react";

export default function EventCard({
  name = "Tech Conference 2025",
  description = "Join us for an amazing tech conference featuring cutting-edge innovations and networking opportunities.",
  category = "Technology",
  tags = ["AI", "Machine Learning", "Networking", "Innovation"],
  hostName = "Tech Events Inc",
  createdBy = "john_doe",
  location = {
    type: "Convention Center",
    venue: "Grand Tech Hall, Downtown",
    googleMapLink: "https://maps.google.com",
    meetingLink: null,
  },
  date = {
    start: "2025-10-15T09:00:00Z",
    end: "2025-10-16T17:00:00Z",
  },
  image = null,
  attendees = 142,
  upvotes: initialUpvotes = 89,
  goingCount: initialGoingCount = 56,
  comments: initialComments = [
    {
      user: "Sarah_M",
      text: "Can't wait for this event! The speaker lineup looks amazing.",
    },
    {
      user: "Mike_K",
      text: "Perfect timing, looking forward to the networking session.",
    },
  ],
  createdAt = "2025-09-10T10:30:00Z",
  userId = null, // Pass this to fetch user data
}) {
  // User data state
  const [userData, setUserData] = useState({
    username: "rahul",
    fullName: "Rahul Vasava",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [liked, setLiked] = useState(false);
  const [going, setGoing] = useState(false);
  const [goingCount, setGoingCount] = useState(initialGoingCount);
  const [comments, setComments] = useState(initialComments);

  // Fetch user data effect
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          // Replace with your actual API endpoint
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUserData({
              username: data.username,
              fullName: data.fullName,
              profilePicture: data.profilePicture || userData.profilePicture,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setUpvotes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const toggleGoing = () => {
    setGoing((prev) => !prev);
    setGoingCount((prev) => (going ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        user: "You",
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      };
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="relative max-w-2xl mb-6 mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* User Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-full">
              <img
                src={userData.profilePicture}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {userData.fullName}
                </h4>
                <p className="text-xs text-gray-500">@{userData.username}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition">
            View Profile
          </button>
        </div>
      </div>

      {/* Minimized Gradient Header */}
      <div className="relative h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Header content */}
        <div className="absolute inset-4 flex justify-between items-center">
          {/* Name + Organizer */}
          <div className="flex flex-col">
            <h2 className="text-white font-bold text-xl leading-tight drop-shadow-sm">
              {name}
            </h2>
            <div className="flex items-center text-white text-sm mt-1">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">Organized by {hostName}</span>
            </div>
          </div>

          {/* Category badge */}
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
            {category}
          </span>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-semibold text-sm">
                  {formatDate(date.start)}
                </p>
                <span className="text-gray-400">-</span>
                <p className="text-gray-900 font-semibold text-sm">
                  {formatDate(date.end)}
                </p>
              </div>
              <p className="text-gray-600 text-xs">
                {formatTime(date.start)} - {formatTime(date.end)}
              </p>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">
              {Math.round(
                (new Date(date.end) - new Date(date.start)) / (1000 * 60 * 60)
              )}
              h
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-semibold text-sm">
              {location.type}
            </p>
            {location.venue && (
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                {location.venue}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {location.googleMapLink && (
                <a
                  href={location.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Map
                </a>
              )}
              {location.meetingLink && (
                <a
                  href={location.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Join Online
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 border-t border-gray-100 pt-2">
        <div className="flex items-center gap-5">
          <div className="flex items-center">
            <button
              onClick={toggleLike}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform active:scale-95 ${
                liked
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {/* Upvote icon */}
              <TrendingUp
                className={`w-6 h-6 ${liked ? "fill-current" : ""}`}
              />
            </button>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-semibold">{upvotes}</span>
              <span className="text-[10px] uppercase tracking-wide">
                Upvote
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleGoing}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform active:scale-95 ${
                going
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200"
                  : " text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Users className={`w-5 h-5`} />
            </button>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-semibold">{goingCount}</span>
              <span className="text-[10px] uppercase tracking-wide">
                joining
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:bg-gray-200 transition-all duration-200 transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-medium text-gray-700">
                {" "}
                {comments.length}
              </span>
              <span className="text-[10px] uppercase tracking-wide">
                {" "}
                comments{" "}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-2 space-y-4">
        {/* Description */}
        {description && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>

      <div className="px-6 pb-4">
        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-200/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600  px-6 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span className="font-medium">{attendees} attending</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">{formatDate(createdAt)}</div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-6 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <div className="pt-4 space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">
              Comments ({comments.length})
            </h4>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-3 border border-gray-100"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {comment.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {comment.user}
                        </p>
                        <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>

            {/* Add Comment */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">Y</span>
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    placeholder="Share your thoughts about this event..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform active:scale-95 ${
                        newComment.trim()
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
