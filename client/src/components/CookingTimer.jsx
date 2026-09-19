import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Volume2 } from 'lucide-react';

export default function CookingTimer({ defaultMinutes = 5 }) {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSecondsLeft(defaultMinutes * 60);
    setIsActive(false);
  }, [defaultMinutes]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("Timer completed! Check your cooking step.");
        window.speechSynthesis.speak(speech);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(defaultMinutes * 60);
  };

  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        <TimerIcon className="w-4 h-4 animate-spin-slow" /> Step Cooking Timer
      </div>

      <div className="font-mono font-black text-4xl sm:text-5xl text-white tracking-widest bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg transition-all ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Timer
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
