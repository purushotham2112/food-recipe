const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getReports,
  updateReportStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

module.exports = router;
