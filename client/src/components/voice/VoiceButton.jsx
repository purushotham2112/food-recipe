import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceButton({ status, onClick }) {
  const getButtonBg = () => {
    switch (status) {
      case 'LISTENING':
        return 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-500/40';
      case 'THINKING':
        return 'bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-indigo-500/40';
      case 'SPEAKING':
        return 'bg-gradient-to-tr from-amber-500 to-brand-500 text-white shadow-amber-500/40';
      case 'ERROR':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-gradient-to-tr from-brand-600 to-amber-500 text-white shadow-brand-500/30';
    }
  };

  return (
    <div className="relative">
      {/* Outer Pulse Ring when Active */}
      {(status === 'LISTENING' || status === 'SPEAKING') && (
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute -inset-2 rounded-full opacity-50 ${
            status === 'LISTENING' ? 'bg-rose-500' : 'bg-amber-400'
          }`}
        />
      )}

      <button
        onClick={onClick}
        aria-label="Activate Chef AI voice assistant"
        className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${getButtonBg()}`}
      >
        {status === 'THINKING' ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : status === 'SPEAKING' ? (
          <Volume2 className="w-7 h-7 animate-pulse" />
        ) : status === 'LISTENING' ? (
          <Mic className="w-7 h-7 animate-bounce" />
        ) : status === 'ERROR' ? (
          <AlertCircle className="w-7 h-7" />
        ) : (
          <Mic className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
