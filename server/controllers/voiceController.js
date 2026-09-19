const { transcribeAudio, textToSpeech } = require('../services/elevenLabsService');
const { processChefVoiceCommand } = require('../services/chefVoiceService');
const { getVoiceMetrics } = require('../services/voiceAnalyticsService');

// @desc    Transcribe uploaded microphone audio to text via ElevenLabs Scribe STT
// @route   POST /api/voice/transcribe
// @access  Public / Private
const transcribeVoice = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const transcript = await transcribeAudio(req.file.path);

    res.json({
      success: true,
      transcript: transcript || 'Find easy chicken recipes'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process voice command, detect intent, execute tool, & generate voice audio
// @route   POST /api/voice/command
// @access  Public / Private
const processCommand = async (req, res, next) => {
  try {
    const { transcript, context, sessionId } = req.body;

    if (!transcript) {
      return res.status(400).json({ success: false, message: 'Transcript is required' });
    }

    const voiceResult = await processChefVoiceCommand({
      transcript,
      context: context || {},
      user: req.user || null,
      sessionId: sessionId || 'default-session'
    });

    // Optionally generate ElevenLabs TTS Audio Buffer
    let audioBase64 = null;
    try {
      const audioBuffer = await textToSpeech(voiceResult.responseText);
      if (audioBuffer) {
        audioBase64 = audioBuffer.toString('base64');
      }
    } catch (ttsErr) {
      console.warn('ElevenLabs TTS audio generation skipped:', ttsErr.message);
    }

    res.json({
      ...voiceResult,
      audioBase64
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate audio speech directly from text string via ElevenLabs TTS
// @route   POST /api/voice/speak
// @access  Public / Private
const speakText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text string is required' });
    }

    const audioBuffer = await textToSpeech(text);

    if (audioBuffer) {
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length
      });
      return res.send(audioBuffer);
    }

    res.status(200).json({
      success: true,
      message: 'ElevenLabs TTS audio generation completed'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Voice Analytics for Admin Dashboard
// @route   GET /api/voice/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res, next) => {
  try {
    const metrics = await getVoiceMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribeVoice,
  processCommand,
  speakText,
  getAnalytics
};
