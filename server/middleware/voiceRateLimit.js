const rateLimit = require('express-rate-limit');

const voiceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.VOICE_RATE_LIMIT_PER_HOUR ? parseInt(process.env.VOICE_RATE_LIMIT_PER_HOUR, 10) : 60,
  message: {
    success: false,
    message: 'Voice usage rate limit reached. You can still type your requests.',
    code: 'VOICE_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = voiceLimiter;
