import userSchema from "../models/Userschema.js";
import User from "../models/Userschema.js";
import Post from "../models/PostSchema.js";
import Event from "../models/EventSchema.js";
import Project from "../models/ProjectSchema.js";

import mongoose from "mongoose";

export const GetProfile = async(req,res) => {
  try {
    const { userId } = req.params;  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const GetHeaderData = async(req,res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).select("username profilePic fullname");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ message: "Server error", error });
  } 
}  
//----------------------------------------------------------------------------------------------------

// Get all posts of the logged-in user
export const GetPost = async (req, res) => {
  try {
    const { userId } = req.params; // user id from auth middleware
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
   
    if (!posts) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("GetPost error:", error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get all events of the logged-in user
export const GetEvent = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const events = await Event.find({ "createdBy.userId": userId }).sort({ date: -1 });
    if (!events) {
      return res.status(404).json({ message: "No events found for this user" });
    }
    
    res.status(200).json(events);
  } catch (error) {
    console.error("GetEvent error:", error);
    res.status(500).json({ message: "Failed to get events" });
  }
};

// Get all projects of the logged-in user
export const GetProject = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    if (!projects) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("GetProject error:", error);
    res.status(500).json({ message: "Failed to get projects" });
  }
};

//------------------------------------------------------------------------------------------------------
export const UpdateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const forbiddenFields = [
      '_id', '__v', 'createdAt', 'updatedAt', 'password',
      'followers', 'following', 'notifications', 'followRequests',
      'isVerified', 'isBanned', 'onlineStatus', 'username'
    ];

    const updatesFiltered = {};
    for (const key in updates) {
      if (!forbiddenFields.includes(key)) {
        updatesFiltered[key] = updates[key];
      }
    }

    const user = await userSchema.findByIdAndUpdate(
      userId,
      updatesFiltered,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//------------------------------------------------------------------------------------------------------
export const UnfollowUser = async(req, res) => {        
    try {
        const userId = req.user.id;
        const { receiverId } = req.body;
    
        const user = await userSchema.findById(userId);
        const unfollowUser = await userSchema.findById(receiverId);
    
        if (!user || !unfollowUser) {
        return res.status(404).json({ message: "User not found" });
        }
    
        if (!user.following.includes(receiverId)) {
        return res.status(400).json({ message: "You are not following this user" });
        }
    
        user.following.pull(receiverId);
        unfollowUser.followers.pull(userId);
    
        await user.save();
        await unfollowUser.save();
    
        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    }
//------------------------------------------------------------------------------------------------------
export const GetFollowers = async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await userSchema.findById(userId).populate('followers', '-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
//------------------------------------------------------------------------------------------------------
export const GetFollowing = async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await userSchema.findById(userId).populate('following', '-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
//------------------------------------------------------------------------------------------------------
export const getUserProfile = async (req, res) => {
  try {
    const viewerId = req.user?._id; // person requesting the profile
    const targetUserId = req.params.id; // profile being viewed

    const user = await User.findById(targetUserId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollower = user.followers?.some(
      followerId => followerId.toString() === viewerId?.toString()
    );

    // Always expose username and profileImage
    const publicFields = {
      _id: user._id,
      username: user.username,
      profileImage: user.profileImage,
    };

    // Only include private profile fields if viewer is a follower
    if (user.profilePrivacy === 'private' && !isFollower) {
      return res.status(200).json({
        ...publicFields,
        restricted: true,
        message: "Follow request required to see full profile"
      });
    }

    // Full profile
    return res.status(200).json({ ...user });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//------------------------------------------------------------------------------------------------------

export const FollowUser = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (senderId.toString() === receiverId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const targetUser = await User.findById(receiverId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  const alreadyFollowing = targetUser.followers.includes(senderId);
  const alreadyRequested = targetUser.followRequests.find(
    req => req.from.toString() === senderId.toString() && req.status === 'pending'
  );

  if (alreadyFollowing) return res.status(400).json({ message: "Already following" });
  if (alreadyRequested) return res.status(400).json({ message: "Follow request already sent" });
  
  if (targetUser.isPrivate) {

    targetUser.followRequests.push({ from: senderId });
    await targetUser.save();
    return res.status(200).json({ message: "Follow request sent (pending approval)" });
  }

  // Public user → follow directly
  targetUser.followers.push(senderId);
  const senderUser = await User.findById(senderId);
  senderUser.following.push(receiverId);

  await targetUser.save();
  await senderUser.save();

  return res.status(200).json({ message: "Followed successfully" });
};
//------------------------------------------------------------------------------------------------------
export const acceptFollowRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const receiver = await User.findById(req.user._id);
  const request = receiver.followRequests.id(requestId);

  if (!request || request.status !== 'pending') {
    return res.status(404).json({ message: "Request not found or already handled" });
  }

  request.status = 'accepted';
  receiver.followers.push(request.from);

  const sender = await User.findById(request.from);
  sender.following.push(receiver._id);

  await receiver.save();
  await sender.save();

  res.status(200).json({ message: "Follow request accepted" });
};
//------------------------------------------------------------------------------------------------------
export const rejectFollowRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const receiver = await User.findById(req.user._id);
  const request = receiver.followRequests.id(requestId);

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = 'rejected';
  await receiver.save();

  res.status(200).json({ message: "Follow request rejected" });
};
//------------------------------------------------------------------------------------------------------