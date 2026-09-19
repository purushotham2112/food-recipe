import React from 'react';
import { Mic, ShieldAlert, X } from 'lucide-react';

export default function VoicePermission({ onGrant, onDeny, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full space-y-5 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
          <Mic className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Microphone Access Needed</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Chef AI requires microphone permission to listen to your hands-free cooking commands. Raw audio is never stored continuously.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onGrant}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
          >
            Allow Microphone Access
          </button>
          <button
            onClick={onDeny}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            Use Text Input Instead
          </button>
        </div>
      </div>
    </div>
  );
}
