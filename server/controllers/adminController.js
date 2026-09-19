const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Report = require('../models/Report');

// @desc    Get dashboard analytics for Admin
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalCategories = await Category.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const totalViewsResult = await Recipe.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);
    const totalViews = totalViewsResult[0]?.totalViews || 0;

    const recipesByCuisine = await Recipe.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const topRecipes = await Recipe.find({ status: 'published' })
      .select('title ratingAverage viewCount favoriteCount image')
      .sort({ ratingAverage: -1, viewCount: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecipes,
        totalReviews,
        totalCategories,
        totalViews,
        pendingReports,
        recipesByCuisine: recipesByCuisine.map(item => ({ name: item._id, value: item.count })),
        topRecipes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users list for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role && ['user', 'chef', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();
    res.json({ success: true, message: `User role updated to ${user.role}`, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports for admin
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .populate('recipe', 'title slug')
      .populate('review', 'comment rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (status && ['pending', 'resolved', 'rejected'].includes(status)) {
      report.status = status;
      await report.save();
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getReports,
  updateReportStatus
};
