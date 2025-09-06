import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, default:""},
  email: { type: String,default:"",sparse: true  }, 
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  isPrivate: { type: Boolean, default: false },

  profilePic: {
    url: String,
    public_id: String,
  },
 
  gender: { type: String },
  dateOfBirth: { type: Date },

  college: { type: String },
  course: { type: String },
  branch: { type: String }, // e.g., "Computer Science", "Electronics"
  division: { type: String }, // e.g., "UG", "PG"
  specialization: { type: String }, // e.g., "AI", "Data Science"
  yearOfStudy: { type: Number }, // 1, 2, 3, 4 etc.
  studentID: { type: String }, // optional

  skills: [String], // e.g., ["JavaScript", "React", "Public Speaking"]
  interests: [String], // e.g., ["AI", "Startups", "Robotics"]
  learningGoals: [String], // e.g., ["Blockchain", "Cloud Computing"]
  lookingFor: {
    type: [String], // e.g., ["team", "mentor", "project", "event"]
    default: [],
  },
  projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      repoLink: String,
      collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
  ],
  achievements: [String], // e.g., ["Winner at Hackathon", "AWS Certified"]

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  followRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],

  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],

  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },

  onlineStatus: { type: String, enum: ['online', 'offline'], default: 'offline' },

  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
