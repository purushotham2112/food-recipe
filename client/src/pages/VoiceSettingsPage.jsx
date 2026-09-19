import React from 'react';
import { Settings, Volume2, Globe, Shield, Mic } from 'lucide-react';
import useVoiceStore from '../store/voiceStore';

export default function VoiceSettingsPage() {
  const { settings, updateSettings, clearHistory } = useVoiceStore();

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-brand-500" /> Voice Assistant Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Customize Chef AI voice feedback, language, and privacy settings.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
        
        {/* Toggle Assistant */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Enable Chef AI Assistant</h4>
            <p className="text-xs text-slate-500">Show floating voice assistant button throughout RecipeAI.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSettings({ enabled: e.target.checked })}
            className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
          />
        </div>

        {/* Auto Speak Responses */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Auto-Speak Voice Responses</h4>
            <p className="text-xs text-slate-500">Play ElevenLabs high-quality text-to-speech audio automatically.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSpeak}
            onChange={(e) => updateSettings({ autoSpeak: e.target.checked })}
            className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
          />
        </div>

        {/* Voice Language */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Assistant Language</h4>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="te-IN">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* Privacy & Clear History */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Voice Conversation History</h4>
            <p className="text-xs text-slate-500">Raw audio is never stored. Clear your local text conversation log.</p>
          </div>
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 text-xs font-bold hover:bg-rose-100"
          >
            Clear Voice History
          </button>
        </div>
      </div>
    </div>
  );
}
