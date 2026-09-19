import React from 'react';
import { Globe } from 'lucide-react';
import useVoiceStore from '../../store/voiceStore';

export default function VoiceLanguageSelector() {
  const { settings, updateSettings } = useVoiceStore();

  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
    { code: 'te-IN', label: 'తెలుగు (Telugu)' }
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-full text-xs">
      <Globe className="w-3.5 h-3.5 text-brand-500" />
      <select
        value={settings.language}
        onChange={(e) => updateSettings({ language: e.target.value })}
        className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer text-[11px]"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
