import { useEffect, useState } from "react";
import axios from "axios";
import FeedCard from "./FeedCard";
import Suggestion from "./Suggestion";
import EventCard from "./EventCard";
import ProjectCard from "./ProjectCard";
import HomePageLoader from "./HomePageLoader"; // Import the loader

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true,); 

        const token = localStorage.getItem("token");

        // Fetch posts
        const postsRes = await axios.get("http://localhost:3000/api/feed/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
          withCredentials: true,
        });

        // Fetch events
        const eventsRes = await axios.get("http://localhost:3000/api/event/all", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // Fetch projects
        const projectsRes = await axios.get("http://localhost:3000/api/project/all", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // Normalize posts
        const posts = postsRes.data.map((p) => ({
          ...p,
          feedType: "post",
        }));

        // Normalize events
        const events = eventsRes.data.map((e) => ({
          ...e,
          feedType: "event",
        }));

        // Normalize projects
        const projects = projectsRes.data.map((p) => ({
          ...p,
          feedType: "project",
        }));

        // Merge all and sort by date (newest first)
        const combined = [...posts, ...events, ...projects].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeed(combined);
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        let timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    
      }
    }

    fetchFeed();
  }, []);

  // Show loader while loading
  if (loading) {
    return <HomePageLoader />;
  }

  return (
    <div className="flex h-screen w-auto">
      {/* Feed Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {feed.length > 0 ? (
          feed.map((item) => {
            switch (item.feedType) {
              case "post":
                return (
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
                );
              case "event":
                return (
                  <EventCard
                    key={item._id}
                    name={item.name}
                    description={item.description}
                    category={item.category}
                    tags={item.tags}
                    hostName={item.hostName}
                    createdBy={item.createdBy}
                    location={item.location}
                    date={item.date}
                    image={item.image}
                    attendees={item.attendees}
                    upvotes={item.upvotes}
                    goingCounts={item.goingCount}
                    comments={item.comments}
                    createdAt={item.createdAt}
                    userId={userId}
                  />
                );
              case "project":
                return (
                  <ProjectCard
                    key={item._id}
                    project={item} // single project object
                  />
                );
              default:
                return null;
            }
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-gray-500 bg-white rounded-lg shadow-md m-8">
            <img
              src="https://res.cloudinary.com/dqcnxw5b9/image/upload/v1756223601/default_fmxln5.png"
              alt="No posts"
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg font-medium">No posts, events, or projects found</p>
            <p className="text-sm text-gray-400">
              Check back later or follow people to see their posts, events & projects.
            </p>
          </div>
        )}
      </div>

      {/* Suggestions Sidebar */}
      <div className="hidden md:block w-4xs sticky top-0 h-auto overflow-y-auto">
        <Suggestion />
      </div>
    </div>
  );
}