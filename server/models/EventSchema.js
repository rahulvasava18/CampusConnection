import mongoose from 'mongoose';
import commentSchema from './CommentSchema.js';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Social', 'Other'], required: true },
  tags: [String],

  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  organizer: {
    name: String,
    contact: String,
    college: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  location: {
    type: { type: String, required: true },
    venue: String,
    googleMapLink: String,
    meetingLink: String
  },

  date: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },

  timeline: [{
    time: String,
    activity: String,
    speaker: String
  }],
  
  comments: [commentSchema],

  polls: [{
    question: String,
    options: [String],
    responses: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: String
    }]
  }],


  attendees: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Interested', 'Going'], default: 'Interested' },
    checkIn: { type: Boolean, default: false }
  }],

  engagement: {
    upvotes: { type: Number, default: 0 },
    goingCount: { type: Number, default: 0 }
  },

  // liveUpdates: [{
  //   time: { type: Date, default: Date.now },
  //   message: String,
  //   images: [String]
  // }],

  // memoryWall: [{
  //   uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //   imageUrl: String,
  //   caption: String,
  //   taggedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  // }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
