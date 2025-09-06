import Post from '../models/PostSchema.js';
import User from '../models/Userschema.js';

export const unifiedFeed = async (req, res) => {
  try {
    // const userId = req.user._id;

    // 1. Get user’s following list
    // const currentUser = await User.findById(userId).select('following');
    // const followingIds = currentUser.following.map(id => id.toString());

    // 2. Get posts where:
    // - post is public
    // - OR post is friends-only AND author is in following list
    // const posts = await Post.find({
    //   $or: [
    //     { isPrivate: false },
    //     { 
    //       author: { $in: followingIds } 
    //     }
    //   ],
    // })
    //   .populate('author', 'username profileImage fullname')
    //   .sort({ createdAt: -1 });
    const posts = await Post.find()
      .populate('author', 'username profileImage fullname')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
