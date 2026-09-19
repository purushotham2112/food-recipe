const mongoose = require('mongoose');

const voiceSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    language: {
      type: String,
      default: 'en-US'
    },
    commandCount: {
      type: Number,
      default: 0
    },
    successfulCommands: {
      type: Number,
      default: 0
    },
    failedCommands: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VoiceSession', voiceSessionSchema);
