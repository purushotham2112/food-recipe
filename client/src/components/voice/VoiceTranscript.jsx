import React from 'react';

export function VoiceTranscript({ transcript }) {
  if (!transcript) return null;
  return (
    <div className="p-3 rounded-2xl bg-brand-500 text-white font-semibold text-xs ml-auto max-w-[80%] shadow-sm">
      "{transcript}"
    </div>
  );
}

export function VoiceResponse({ responseText }) {
  if (!responseText) return null;
  return (
    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-xs mr-auto max-w-[85%] leading-relaxed shadow-sm">
      {responseText}
    </div>
  );
}

export function VoiceStatus({ status }) {
  const labels = {
    IDLE: 'Tap mic to talk',
    REQUESTING_PERMISSION: 'Requesting microphone access...',
    LISTENING: 'Listening...',
    THINKING: 'Chef AI is thinking...',
    SPEAKING: 'Chef AI speaking...',
    ERROR: 'Voice error'
  };

  return (
    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
      {labels[status] || status}
    </span>
  );
}
