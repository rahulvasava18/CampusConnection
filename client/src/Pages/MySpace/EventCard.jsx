import { useState } from "react";
import { FaHeart, FaRegHeart, FaCommentAlt } from "react-icons/fa";

export default function EventCard({ event }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState("");
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setUpvotes(liked ? upvotes - 1 : upvotes + 1);
  };

  return (
    <div className="bg-white shadow-sm mb-6 max-w-2xl mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#ffe0b2] border-b">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{event.name}</h3>
          <p className="text-xs text-gray-500">{event.category}</p>
        </div>
      </div>

      {/* Organizer & Location */}
      <div className="px-4 py-2 text-sm text-gray-700">
        <p><span className="font-semibold">Organizer:</span> {event.organizer?.name || 'N/A'}</p>
        <p><span className="font-semibold">Contact:</span> {event.organizer?.contact || 'N/A'}</p>
        <p><span className="font-semibold">College:</span> {event.organizer?.college || 'N/A'}</p>
        <p><span className="font-semibold">Location:</span> {event.location?.type}</p>
        {event.location?.venue && <p><span className="font-semibold">Venue:</span> {event.location.venue}</p>}
        {event.location?.googleMapLink && (
          <a href={event.location.googleMapLink} target="_blank" className="text-blue-500 hover:underline">View on Map</a>
        )}
        {event.location?.meetingLink && (
          <a href={event.location.meetingLink} target="_blank" className="text-blue-500 hover:underline ml-2">Join Meeting</a>
        )}
      </div>

      {/* Date */}
      <div className="px-4 py-2 text-sm text-gray-700">
        <p><span className="font-semibold">Start:</span> {new Date(event.date.start).toLocaleString()}</p>
        <p><span className="font-semibold">End:</span> {new Date(event.date.end).toLocaleString()}</p>
      </div>

      {/* Timeline */}
      {event.timeline?.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-700">
          <h4 className="font-semibold mb-1">Timeline</h4>
          <ul className="list-disc list-inside space-y-1">
            {event.timeline.map((t, idx) => (
              <li key={idx}>
                <span className="font-semibold">{t.time}</span>: {t.activity} {t.speaker && `- ${t.speaker}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-5 px-4 py-2">
        <button onClick={toggleLike} className="flex items-center gap-1 hover:opacity-75 transition">
          {liked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-xl" />}
          <span>{upvotes}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 hover:opacity-75 transition">
          <FaCommentAlt className="text-xl" />
          <span>{event.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pt-2">
          {event.comments?.length > 0 ? (
            <ul className="space-y-2 mb-3">
              {event.comments.map((c, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-semibold mr-1">{c.user}</span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No comments yet.</p>
          )}

          {/* Add comment */}
          <div className="flex items-center gap-2 border-t pt-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border-none text-sm px-2 py-1 focus:outline-none"
            />
            <button
              className="text-blue-500 text-sm font-semibold"
              onClick={() => {
                if (newComment.trim()) {
                  event.comments.push({ user: "You", text: newComment });
                  setNewComment("");
                }
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      {event.tags?.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {event.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">
        Created on {new Date(event.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
