import React from 'react';
import { Sparkles, Mic, Volume2, Globe, Command } from 'lucide-react';
import useVoiceStore from '../store/authStore';
import useVoiceAssistant from '../hooks/useVoiceAssistant';
import VoicePanel from '../components/voice/VoicePanel';

export default function VoiceAssistantPage() {
  const { handleCommandExecution, stopAudioSpeech } = useVoiceAssistant();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs border border-brand-500/20">
          <Sparkles className="w-4 h-4 text-brand-500" /> Chef AI Voice Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ElevenLabs Chef Voice Assistant
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Talk naturally to Chef AI. Search recipes, control hands-free cooking mode, set timers, track pantry items, and plan your weekly meals.
        </p>
      </div>

      {/* Embedded Main Voice Studio Panel */}
      <div className="flex justify-center">
        <VoicePanel
          onClose={() => {}}
          onTextCommandSubmit={(text) => handleCommandExecution(text)}
          onStopSpeech={stopAudioSpeech}
        />
      </div>
    </div>
  );
}
