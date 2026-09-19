const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Follow or unfollow a chef/user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    if (existingFollow) {
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

      return res.json({
        success: true,
        isFollowing: false,
        message: `Unfollowed ${targetUser.name}`
      });
    } else {
      await Follow.create({ follower: currentUserId, following: targetUserId });
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });

      // Create notification
      await Notification.create({
        user: targetUserId,
        type: 'follower',
        message: `${req.user.name} started following you!`,
        relatedId: currentUserId.toString()
      });

      return res.json({
        success: true,
        isFollowing: true,
        message: `Now following ${targetUser.name}`
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get followers
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = async (req, res, next) => {
  try {
    const follows = await Follow.find({ following: req.params.id }).populate('follower', 'name profileImage bio role');
    const followers = follows.map(f => f.follower);
    res.json({ success: true, data: followers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get following
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = async (req, res, next) => {
  try {
    const follows = await Follow.find({ follower: req.params.id }).populate('following', 'name profileImage bio role');
    const following = follows.map(f => f.following);
    res.json({ success: true, data: following });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFollow,
  getFollowers,
  getFollowing
};
