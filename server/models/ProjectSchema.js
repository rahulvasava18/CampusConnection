import mongoose from 'mongoose';

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
  }], // e.g. ["React", "Node.js", "MongoDB"]

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

  status: { 
    type: String,
  },

   tags: {
      type: [String],
      default: [],
    },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
},
{
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model('Project', projectSchema);
