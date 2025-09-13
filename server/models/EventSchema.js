const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  // Category list merged from frontend & backend
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

  // Matches frontend "hostName"
  hostName: { type: String },

  // CreatedBy from token/user context
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  // Location fields matched with frontend
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
  image: { type: String }, // frontend uploads as preview/base64/url

  // Comments (uses commentSchema if defined separately)
  comments: [commentSchema],

  // Attendees
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
