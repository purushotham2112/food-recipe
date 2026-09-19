import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceCookingControl({ onNext, onPrevious, onRepeat }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!supported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const command = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(command);

      if (command.includes('next')) {
        onNext();
      } else if (command.includes('previous') || command.includes('back')) {
        onPrevious();
      } else if (command.includes('repeat')) {
        onRepeat();
      }
    };

    recognition.onerror = (err) => {
      console.warn('Speech recognition error:', err.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-white">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full font-semibold transition-all ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
            : 'bg-brand-600 hover:bg-brand-500 text-white'
        }`}
        title="Toggle Hands-Free Voice Commands"
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      <div className="flex flex-col">
        <span className="font-bold flex items-center gap-1.5 text-slate-200">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          {isListening ? 'Voice Control Active' : 'Hands-Free Voice Mode'}
        </span>
        <span className="text-[11px] text-slate-400">
          {isListening
            ? transcript || 'Say "Next", "Previous", or "Repeat"'
            : 'Click mic to enable voice commands'}
        </span>
      </div>
    </div>
  );
}
