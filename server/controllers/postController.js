import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Postschema from '../models/PostSchema.js'; 
const Post = Postschema;

//------------------------------------------------------------------------------------------------------
// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const CreatePost = async (req, res) => {
  try {
    const { content, caption, tags } = req.body;
    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "campus/posts");
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const newPost = new Post({
      content,
      caption,
      tags: Array.isArray(tags) ? tags : [tags],
      images: uploadedImages,
      author: req.user._id, // assuming auth middleware sets req.user
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

//------------------------------------------------------------------------------------------------------
export const GetAllPosts = async (req, res) => {
    try {
         // Debugging line
        const { userId } = req.query;
        console.log("Request on gell allpost by",userId);

        const posts = await Post.find({ author: userId })
        .populate('author', 'username profileImage fullname') // Populate author details
        .sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }    
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//------------------------------------------------------------------------------------------------------
export const GetPostByID = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId).populate('author', 'username profileImage');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (isPrivate === true ) {
      const author = await User.findById(post.author._id).select('followers');
      const isFollower = author.followers.some(f => f.toString() === userId.toString());

      if (!isFollower) {
        return res.status(403).json({ message: 'Access denied: friends-only post' });
      }
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


//------------------------------------------------------------------------------------------------------
export const LikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//------------------------------------------------------------------------------------------------------
export const UnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "You haven't liked this post yet" });
        }

        post.likes.pull(userId);
        await post.save();

        res.status(200).json({ message: "Post unliked successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//------------------------------------------------------------------------------------------------------
export const CommentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            user: req.user._id,
            text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//------------------------------------------------------------------------------------------------------
export const DeleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { commentId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the author of the comment
        if (post.comments[commentIndex].user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

//------------------------------------------------------------------------------------------------------
export const GetComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId).populate('comments.user', 'username fullname profilePic');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//------------------------------------------------------------------------------------------------------
export const DeletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
