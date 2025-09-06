import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark, FaEllipsisH, FaUserPlus } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

export default function FeedCard({
  type = "post",
user, // now expects the `author` object
tags = [], // array of strings
caption,
hashtags = [], // array of strings, optional
createdAt,
likes = [], // array of user IDs who liked the post
likesCount = 0, // number of likes
comments = [], // array of comment objects
commentsCount = 0, // number of comments
images = [] // array of image objects {url, uploadedAt}

}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 max-w-2xl mx-auto overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-full">
              <img
                src={user.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{user.fullname || "Full Name"}</h4>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition">
            View Profile
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH />
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
              className="w-full object-cover mb-2"
            />))}
        </div>)}

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
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </div>

      {/* Caption */}
      <div className="px-4 py-1 text-sm">
        <span className="font-bold mr-2">{user.username}</span>
        <span className="text-gray-800">{caption}</span>
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
              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100"
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
          View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </button>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pt-2 pb-3 bg-gray-50 border-t border-gray-100">
          {comments.length > 0 ? (
            <ul className="space-y-3 mb-3 max-h-60 overflow-y-auto py-1">
              {comments.map((c, idx) => (
                <li key={idx} className="text-sm flex items-start">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-full mr-2">
                    <img
                      src="https://via.placeholder.com/24"
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl flex-1 shadow-sm">
                    <span className="font-semibold mr-2">{c.user}</span>
                    <span>{c.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-3 text-center py-2">No comments yet.</p>
          )}

          {/* Add comment */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`p-1 rounded-full ${newComment.trim() ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300'}`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-t border-gray-100">
        {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}