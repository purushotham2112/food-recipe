import React, { useState } from 'react';
import { X, Send, Trash2, Bot, User, Sparkles, Square, AlertTriangle, RotateCcw } from 'lucide-react';
import useVoiceStore from '../../store/voiceStore';
import useVoiceCommand from '../../hooks/useVoiceCommand';
import VoiceWaveform from './VoiceWaveform';
import VoiceLanguageSelector from './VoiceLanguageSelector';
import VoiceTimer from './VoiceTimer';
import VoiceError from './VoiceError';

export default function VoicePanel({ onClose, onTextCommandSubmit, onStopSpeech, onRetry }) {
  const { status, history, clearHistory, errorMsg } = useVoiceStore();
  const { pageSuggestions } = useVoiceCommand();

  const [inputText, setInputText] = useState('');
  const [confirmationPending, setConfirmationPending] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onTextCommandSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleConfirmAction = () => {
    if (confirmationPending) {
      onTextCommandSubmit(`Confirm ${confirmationPending.intent}`);
      setConfirmationPending(null);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[540px]">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              Chef AI <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">ElevenLabs Voice</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {status === 'LISTENING' ? '🔴 Listening to your voice...' : status === 'SPEAKING' ? '🔊 Chef AI is speaking...' : status === 'THINKING' ? '⏳ Thinking...' : 'Your AI Kitchen Companion'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VoiceLanguageSelector />
          <button
            onClick={clearHistory}
            className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Clear Voice History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {status === 'ERROR' && (
        <div className="p-2">
          <VoiceError message={errorMsg} onRetry={onRetry} />
        </div>
      )}

      {/* Active Voice Timers */}
      <div className="p-2 bg-slate-950/20">
        <VoiceTimer />
      </div>

      {/* Confirmation Safeguard Box */}
      {confirmationPending && (
        <div className="m-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Action Confirmation Required
          </div>
          <p>Are you sure you want to execute this action?</p>
          <div className="flex gap-2 pt-1">
            <button onClick={handleConfirmAction} className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px]">
              Yes, Execute
            </button>
            <button onClick={() => setConfirmationPending(null)} className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-[11px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Conversation Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                AI
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Animated Waveform Visualizer */}
      {(status === 'SPEAKING' || status === 'LISTENING') && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <VoiceWaveform isSpeaking={status === 'SPEAKING'} />
            <span className="text-[11px] font-bold text-slate-500">
              {status === 'SPEAKING' ? 'Chef AI Voice Active' : 'Listening...'}
            </span>
          </div>

          {status === 'SPEAKING' && (
            <button
              onClick={onStopSpeech}
              className="px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-rose-600"
            >
              <Square className="w-3 h-3 fill-white" /> Stop Speech
            </button>
          )}
        </div>
      )}

      {/* Dynamic Page-Aware Quick Suggestions Chips */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
        {pageSuggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onTextCommandSubmit(s)}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-500 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your command (e.g. Find easy chicken recipes)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 outline-none text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
