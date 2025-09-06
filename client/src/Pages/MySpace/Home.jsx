import { useEffect, useState } from "react";
import axios from "axios";
import FeedCard from "./FeedCard";
import Suggestion from "./Suggestion";
import FeedDemo from "./FeedDemo";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/api/feed/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId }, // send userId as query parameter
          withCredentials: true, // for cookies if needed
        });

        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sorted);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen w-auto ">
      {/* Feed Section */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        {posts.length > 0 ? (
          posts.map((post) => (
            <FeedCard
              key={post._id}
              type={post.type}
              user={post.author} // updated from post.user to post.author
              content={post.content}
              caption={post.caption}
              tags={post.tags}
              images={post.images} // new prop for images
              likes={post.likes}
              likesCount={post.likesCount} // new prop
              comments={post.comments}
              commentsCount={post.commentsCount} // new prop
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-gray-500 bg-white rounded-lg shadow-md  m-">
            {/* <img
              src="https://res.cloudinary.com/dqcnxw5b9/image/upload/v1756223601/default_fmxln5.png"
              alt="No posts"
            /> */}
            <p className="text-lg font-medium">No posts found</p>
            <p className="text-sm text-gray-400">
              Check back later or follow people to see their posts.
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
