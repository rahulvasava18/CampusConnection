import mongoose from "mongoose";
import commentSchema  from "./CommentSchema.js";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  category: {
    type: String,
    enum: [
      "Academic",
      "Cultural",
      "Sports",
      "Workshop",
      "Hackathon",
      "Social",
      "Seminar",
      "Conference",
      "Networking",
      "Other",
    ],
    required: true,
  },

  tags: [String],

  hostName: { type: String },

  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  location: {
    type: {
      type: String,
      enum: ["On-campus", "Off-campus", "Online"],
      required: true,
    },
    venue: String,
    googleMapLink: String,
    meetingLink: String,
  },

  // Dates
  date: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },

  // Event Photo
  image: {
    url: { type: String },
    public_id: { type: String },
    format: { type: String },
    width: { type: Number },
    height: { type: Number },
  },

  comments: [commentSchema],


  attendees: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["Interested", "Going"],
        default: "Interested",
      },
      checkIn: { type: Boolean, default: false },
    },
  ],

  upvotes: { type: Number, default: 0 },
  goingCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});
const Event = mongoose.model("Event", eventSchema);
export default Event;
