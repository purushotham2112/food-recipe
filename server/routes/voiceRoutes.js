const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { transcribeVoice, processCommand, speakText, getAnalytics } = require('../controllers/voiceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const voiceLimiter = require('../middleware/voiceRateLimit');

const audioUpload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB audio limit
});

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
};

router.use(voiceLimiter);

router.post('/transcribe', audioUpload.single('audio'), transcribeVoice);
router.post('/command', optionalAuth, processCommand);
router.post('/speak', speakText);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
