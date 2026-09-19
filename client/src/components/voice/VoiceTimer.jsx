import React, { useEffect } from 'react';
import { Timer as TimerIcon, X, Play, Pause } from 'lucide-react';
import useVoiceStore from '../../store/voiceStore';

export default function VoiceTimer() {
  const { activeTimers, removeTimer } = useVoiceStore();

  if (!activeTimers || activeTimers.length === 0) return null;

  return (
    <div className="space-y-2 max-w-sm w-full">
      {activeTimers.map((timer) => (
        <div
          key={timer.id}
          className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <TimerIcon className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <div>
              <p className="font-bold">{timer.label}</p>
              <p className="text-[11px] text-slate-400">{Math.ceil(timer.secondsLeft / 60)} minutes set</p>
            </div>
          </div>

          <button
            onClick={() => removeTimer(timer.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
