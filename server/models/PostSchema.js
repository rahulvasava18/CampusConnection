import mongoose from "mongoose";
import commentSchema from "./CommentSchema.js";

const imageSubSchema = new mongoose.Schema(
  {
    url: {
      type: String, // e.g. path or cloud URL (required when image exists)
      required: true,
      trim: true,
    },
    filename: String, // original filename / storage filename (optional)
    mimeType: String, // image MIME type (optional)
    size: Number, // size in bytes (optional)
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    caption: {
      type: String,default: "",
      trim: true,},
  
    // Tag list (optional)
    tags: {
      type: [String],
      default: [],
    },

    // images uploaded with the post (optional). Each image stores metadata + URL/path.
    images: {
      type: [imageSubSchema],
      default: [],
    },
     
     upvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    upvoteCount: {
      type: Number,
      default: 0,
    }, 

    comments: {
      type: [commentSchema], // embedded comments (optional)
      default: [],
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
