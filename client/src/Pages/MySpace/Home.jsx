import { useEffect, useState } from "react";
import axios from "axios";
import FeedCard from "./FeedCard";
import Suggestion from "./Suggestion";
import FeedDemo from "./FeedDemo";
import EventCard from "./EventCard"; // you'll need to create this

export default function Home() {
  const [feed, setFeed] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchFeed() {
      try {
        const token = localStorage.getItem("token");

        // Fetch posts
        const postsRes = await axios.get("http://localhost:3000/api/feed/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
          withCredentials: true,
        });

        // Fetch events
        const eventsRes = await axios.get(
          "http://localhost:3000/api/event/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Normalize posts
        const posts = postsRes.data.map((p) => ({
          ...p,
          feedType: "post", // add identifier
        }));

        // Normalize events
        const events = eventsRes.data.map((e) => ({
          ...e,
          feedType: "event", // add identifier
        }));

        // Merge + sort by date
        const combined = [...posts, ...events].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeed(combined);
      } catch (err) {
        console.error("Error fetching feed:", err);
      }
    }

    fetchFeed();
  }, []);

  return (
    <div className="flex h-screen w-auto ">
      {/* Feed Section */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        {feed.length > 0 ? (
          feed.map((item) =>
            item.feedType === "post" ? (
              <FeedCard
                key={item._id}
                type={item.type}
                user={item.author}
                content={item.content}
                caption={item.caption}
                tags={item.tags}
                images={item.images}
                likes={item.likes}
                likesCount={item.likesCount}
                comments={item.comments}
                commentsCount={item.commentsCount}
                createdAt={item.createdAt}
              />
            ) : (
              <EventCard
                key={item._id}
                name={item.name} // was title
                description={item.description}
                category={item.category}
                tags={item.tags}
                hostName={item.hostName} // organizer name
                createdBy={item.createdBy} // user reference
                location={item.location}
                date={item.date}
                image={item.image} // single image object
                attendees={item.attendees}
                upvotes={item.upvotes}
                goingCount={item.goingCount}
                comments={item.comments}
                createdAt={item.createdAt}
              />
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-gray-500 bg-white rounded-lg shadow-md">
            <img
              src="https://res.cloudinary.com/dqcnxw5b9/image/upload/v1756223601/default_fmxln5.png"
              alt="No posts"
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg font-medium">No posts or events found</p>
            <p className="text-sm text-gray-400">
              Check back later or follow people to see their posts & events.
            </p>
          </div>
        )}
      </div>

      {/* Suggestions Sidebar */}
      <div className="hidden md:block w- border-l  p-6 sticky top-0 h-auto overflow-y-auto">
        <Suggestion />
      </div>
    </div>
  );
}
