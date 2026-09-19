import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useVoiceStore from '../store/voiceStore';
import useVoiceRecorder from './useVoiceRecorder';
import { transcribeAudioFile, sendVoiceCommand } from '../services/voiceApi';

export default function useVoiceAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const audioPlayerRef = useRef(new Audio());

  const {
    status,
    setStatus,
    setTranscript,
    addHistoryMessage,
    setErrorMsg,
    addTimer,
    settings
  } = useVoiceStore();

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  // Play ElevenLabs Audio response
  const playElevenLabsAudio = (audioBase64, textFallback) => {
    return new Promise((resolve) => {
      setStatus('SPEAKING');

      if (audioBase64) {
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.onended = () => {
          setStatus('IDLE');
          resolve();
        };
        audioPlayerRef.current.onerror = () => {
          fallbackWebSpeechTTS(textFallback, resolve);
        };
        audioPlayerRef.current.play().catch(() => {
          fallbackWebSpeechTTS(textFallback, resolve);
        });
      } else {
        fallbackWebSpeechTTS(textFallback, resolve);
      }
    });
  };

  const fallbackWebSpeechTTS = (text, resolve) => {
    if ('speechSynthesis' in window && settings.autoSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speed || 1.0;
      utterance.onend = () => {
        setStatus('IDLE');
        resolve();
      };
      utterance.onerror = () => {
        setStatus('IDLE');
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setStatus('IDLE');
      resolve();
    }
  };

  const handleCommandExecution = async (commandText) => {
    try {
      setStatus('THINKING');
      addHistoryMessage('user', commandText);

      const context = {
        page: location.pathname,
        recipeId: location.pathname.includes('/cooking/') ? location.pathname.split('/cooking/')[1] : null
      };

      const res = await sendVoiceCommand(commandText, context);
      const responseText = res.responseText || 'Done!';

      addHistoryMessage('assistant', responseText);

      // Execute front-end UI actions requested by voice router
      if (res.action) {
        if (res.action.type === 'NAVIGATE' || res.action.type === 'NAVIGATE_SEARCH') {
          navigate(res.action.payload);
        } else if (res.action.type === 'START_TIMER') {
          addTimer('Voice Timer', res.action.payload.minutes || 5);
        }
      }

      // Play audio response
      if (settings.autoSpeak) {
        await playElevenLabsAudio(res.audioBase64, responseText);
      } else {
        setStatus('IDLE');
      }
    } catch (err) {
      console.error('Command processing error:', err);
      setErrorMsg('Failed to process voice command');
    }
  };

  const startListening = async () => {
    try {
      setStatus('LISTENING');
      setTranscript('');
      await startRecording();
    } catch (err) {
      setErrorMsg('Microphone permission denied');
    }
  };

  const stopListeningAndProcess = async () => {
    try {
      setStatus('THINKING');
      const audioBlob = await stopRecording();

      if (!audioBlob || audioBlob.size === 0) {
        setStatus('IDLE');
        return;
      }

      // Send to ElevenLabs STT backend
      const res = await transcribeAudioFile(audioBlob);
      const text = res.transcript;

      if (!text || !text.trim()) {
        setErrorMsg("Sorry, I didn't catch that.");
        return;
      }

      setTranscript(text);
      await handleCommandExecution(text);
    } catch (err) {
      console.error('Transcription error:', err);
      setErrorMsg('Speech recognition failed');
    }
  };

  const stopAudioSpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('IDLE');
  };

  return {
    status,
    isRecording,
    startListening,
    stopListeningAndProcess,
    handleCommandExecution,
    stopAudioSpeech
  };
}
