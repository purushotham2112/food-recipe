const fs = require('fs');

/**
 * ElevenLabs STT & TTS Integration Service
 * Provider-abstracted API service for Speech-to-Text (Scribe v2) and Text-to-Speech (Flash v2.5).
 * Uses backend environment variables ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.
 */

const getApiKey = () => process.env.ELEVENLABS_API_KEY;
const getVoiceId = () => process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const getTtsModel = () => process.env.ELEVENLABS_TTS_MODEL || 'eleven_flash_v2_5';
const getSttModel = () => process.env.ELEVENLABS_STT_MODEL || 'scribe_v2';

/**
 * Converts text into audio speech stream/buffer via ElevenLabs API
 * @param {string} text 
 * @param {string} customVoiceId 
 * @returns {Promise<Buffer|null>} audio buffer or null if unavailable
 */
const textToSpeech = async (text, customVoiceId = null) => {
  const apiKey = getApiKey();
  const voiceId = customVoiceId || getVoiceId();
  const modelId = getTtsModel();

  if (!apiKey) {
    console.warn('ELEVENLABS_API_KEY is not set in backend .env');
    return null;
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`ElevenLabs TTS API error (${response.status}):`, errText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('ElevenLabs TTS error:', error.message);
    return null;
  }
};

/**
 * Transcribes audio file buffer into text using ElevenLabs Scribe STT API
 * @param {string} filePath 
 * @returns {Promise<string>} transcribed text
 */
const transcribeAudio = async (filePath) => {
  const apiKey = getApiKey();
  const modelId = getSttModel();

  if (!apiKey) {
    console.warn('ELEVENLABS_API_KEY missing for transcription');
    return '';
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: 'audio/webm' });
    
    formData.append('file', blob, 'recording.webm');
    formData.append('model_id', modelId);

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`ElevenLabs STT error (${response.status}):`, errText);
      return '';
    }

    const data = await response.json();
    return data.text || data.transcript || '';
  } catch (error) {
    console.error('ElevenLabs STT error:', error.message);
    return '';
  }
};

module.exports = {
  textToSpeech,
  transcribeAudio
};
