import React from 'react';
import { motion } from 'framer-motion';

export default function VoiceWaveform({ isSpeaking = false }) {
  const barCount = 5;

  return (
    <div className="flex items-center gap-1.5 h-8 px-2">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.span
          key={i}
          className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-400' : 'bg-brand-500'}`}
          animate={{
            height: isSpeaking ? [8, 28, 12, 32, 8] : [6, 20, 10, 24, 6]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}
