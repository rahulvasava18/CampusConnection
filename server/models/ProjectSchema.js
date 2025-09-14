import mongoose from 'mongoose';
import commentSchema  from "./CommentSchema.js";

const projectSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Owner of the project

  title: { 
    type: String, 
    required: true,
    trim: true,
  },

  description: { 
    type: String,
    default: '',
  },

  techStack: [{ 
    type: String,
    trim: true,
  }],

  repoLink: { 
    type: String,
    default: '',
  },

  liveLink: { 
    type: String,
    default: '',
  },

  category: { 
    type: String,
  },

  tags: {
    type: [String],
    default: [],
  },

  image: {
    url: { type: String, default: '' },
    public_id: { type: String, default: '' },
    format: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number }
  },

  upvotes:{
    type: Number,
    default: 0
  }, // Users who upvoted

  comments: [commentSchema],

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  },

}, {
  timestamps: true // automatically manage createdAt and updatedAt
});

export default mongoose.model('Project', projectSchema);
