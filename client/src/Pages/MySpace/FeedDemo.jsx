// FeedDemo.jsx
import React from "react";
import FeedCard from "./FeedCard"; // For posts
import ProjectCard from "./ProjectCard"; // For projects
import EventCard from "./EventCard"; // For events

export default function FeedDemo() {
  // Post Data
  const kohliPost = {
    type: "post",
    user: {
      name: "Virat Kohli",
      username: "virat.kohli",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBgmQd2138djniU8XPSUm1gNeopxnMYnJD_a7W7RqzfeGmlrz7d461rF4zofzZe517r1M&usqp=CAU",
    },
    caption: "Putting in the hard yards at the nets 💪🔥",
    content: {
      text: "Focused on the next big game. Preparation never stops! 🏏",
      image:
        "https://i.dawn.com/primary/2022/01/61e2d044a2134.jpg",
    },
    tags: ["BCCI", "India", "Cricket"],
    hashtags: ["ViratKohli", "KingKohli", "Cricket"],
    createdAt: new Date(),
    likes: 1200,
    comments: [
      { user: "fan123", text: "King Kohli 👑🔥" },
      { user: "cricketlover", text: "Another century loading…" },
    ],
  };

  // Project Demo Data
  const projectDemo = {
    type: "project",
    user: {
      name: "Alice Johnson",
      username: "alice.j",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    title: "Personal Portfolio Website",
    content: {
      image:
        "https://www.adobe.com/uk/express/learn/blog/media_14568830224021d1bdeef994084049b6203180ba9.png?width=1200&format=pjpg&optimize=medium",
    },
    description: "A sleek portfolio website built with React and Tailwind CSS to showcase projects.",
    techStack: ["React", "Tailwind CSS", "Vite"],
    repoLink: "https://github.com/alicej/portfolio",
    tags: ["WebDev", "Portfolio", "React"],
    createdAt: new Date(),
    likes: 340,
    comments: [
      { user: "dev_guru", text: "Looks amazing! 🔥" },
      { user: "frontendfan", text: "Great UI design 👏" },
    ],
  };

  // Event Demo Data
  const eventDemo = {
    type: "event",
    name: "Hackathon 2025",
    description: "24-hour coding marathon focused on innovative web solutions.",
    category: "Hackathon",
    tags: ["Coding", "Hackathon", "WebDev"],
    organizer: {
      name: "Tech Club",
      contact: "techclub@university.edu",
      college: "XYZ University",
    },
    location: {
      type: "On-campus",
      venue: "Main Auditorium, XYZ University",
    },
    date: {
      start: new Date("2025-09-15T09:00:00"),
      end: new Date("2025-09-16T09:00:00"),
    },
    timeline: [
      { time: "09:00 AM", activity: "Opening Ceremony", speaker: "Prof. Smith" },
      { time: "10:00 AM", activity: "Coding Begins", speaker: "" },
    ],
    comments: [
      { user: "student123", text: "Can't wait to participate!" },
      { user: "coderX", text: "Excited for this hackathon!" },
    ],
    engagement: { upvotes: 150 },
    createdAt: new Date(),
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Posts */}
      <FeedCard {...kohliPost} />

      {/* Projects */}
      <ProjectCard {...projectDemo} />

      {/* Events */}
      <EventCard event={eventDemo} />

      {/* Other posts can follow */}
    </div>
  );
}
