import api from './api';

export const transcribeAudioFile = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  return await api.post('/voice/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const sendVoiceCommand = async (transcript, context = {}) => {
  return await api.post('/voice/command', { transcript, context });
};

export const requestTextToSpeech = async (text) => {
  return await api.post('/voice/speak', { text }, { responseType: 'blob' });
};
