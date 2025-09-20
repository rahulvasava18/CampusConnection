import { useState,useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaUserPlus,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import axios from "axios";

import { MessageCircle } from "lucide-react";

export default function ProfilePostCard({
  type = "post",
  userId, // now expects the `author` object
  tags = [], // array of strings
  caption,
  hashtags = [], // array of strings, optional
  createdAt,
  likes = [], // array of user IDs who liked the post
  likesCount = 0, // number of likes
  comments = [], // array of comment objects
  commentsCount = 0, // number of comments
  images = [], // array of image objects {url, uploadedAt}
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState("");

   useEffect(() => {
    async function fetchUserHeaderData() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
  
        if (!token || !userId) {
          console.warn("No token or userId found in localStorage");
          setUser(null);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };
  
        const response = await axios.get(`http://localhost:3000/api/user/headerdata/${userId}`, config);
  
        if (response.data) {
          setUser(response.data);
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
      }
    }
  
    fetchUserHeaderData();
  }, []); // depends on `project`

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      comments.push({ user: "You", text: newComment });
      setNewComment("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-transform ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-full">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username || "User avatar"}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user?.username
                      ? user.username.charAt(0).toUpperCase()
                      : ":)"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              {user?.fullname || "Full Name"}
            </h4>
            <p className="text-xs text-gray-500">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => alert('Follow feature coming soon!')}>
            Edit
          </button>
          <button className="text-xs bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => alert('Delete feature coming soon!')}>
            Delete
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="w-full bg-gray-50 flex flex-col items-center justify-center h-auto overflow-hidden">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.url || ""}
              alt={`post-${idx}`}
              className="max-w-full max-h-52 object-contain mb-2"
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 transition-transform hover:scale-110"
          >
            {liked ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-xl text-gray-800" />
            )}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 transition-transform hover:scale-110"
          >
            <FaComment className="text-xl text-gray-800" />
          </button>
          <button className="flex items-center gap-1 transition-transform hover:scale-110">
            <FiSend className="text-xl text-gray-800" />
          </button>
        </div>
        <button
          onClick={toggleSave}
          className="transition-transform hover:scale-110"
        >
          {saved ? (
            <FaBookmark className="text-yellow-500 text-xl" />
          ) : (
            <FaRegBookmark className="text-xl text-gray-800" />
          )}
        </button>
      </div>

      {/* Likes */}
      <div className="px-4 text-sm font-semibold text-gray-800 mb-1">
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </div>

      {/* Caption */}
      <div className="px-4 py-1 text-sm">
        <span className="font-bold mr-2">{user?.username}</span>
        <span className="text-gray-800 ">{caption}</span>
        {hashtags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {hashtags.map((hash, idx) => (
              <span
                key={idx}
                className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm"
              >
                #{hash}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* View comments */}
      {comments.length > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="px-4 text-sm text-gray-500 mb-2 hover:text-gray-700"
        >
          View all {comments.length}{" "}
          {comments.length === 1 ? "comment" : "comments"}
        </button>
      )}

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
                  <MessageCircle className="w-12 h-6 text-gray-300 mx-auto mb-3" />
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

      {/* Timestamp */}
      <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-t border-gray-100">
        {new Date(createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
