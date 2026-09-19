import React from 'react';
import useVoiceStore from '../../store/voiceStore';
import useVoiceAssistant from '../../hooks/useVoiceAssistant';
import VoiceButton from './VoiceButton';
import VoicePanel from './VoicePanel';

export default function ChefVoiceAssistant() {
  const { isAssistantOpen, toggleAssistant, status } = useVoiceStore();
  const { startListening, stopListeningAndProcess, handleCommandExecution, stopAudioSpeech } = useVoiceAssistant();

  const handleMicClick = () => {
    if (status === 'LISTENING') {
      stopListeningAndProcess();
    } else {
      if (!isAssistantOpen) {
        toggleAssistant();
      }
      startListening();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Slide-out Voice Panel Drawer */}
      {isAssistantOpen && (
        <div className="mb-2 shadow-2xl animate-fade-in">
          <VoicePanel
            onClose={() => toggleAssistant()}
            onTextCommandSubmit={(text) => handleCommandExecution(text)}
            onStopSpeech={stopAudioSpeech}
          />
        </div>
      )}

      {/* Floating Microphone Action Button */}
      <div className="flex items-center gap-3">
        {status === 'LISTENING' && (
          <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            Recording... Tap to Send
          </span>
        )}
        {status === 'SPEAKING' && (
          <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Chef AI Speaking...
          </span>
        )}

        <VoiceButton status={status} onClick={handleMicClick} />
      </div>
    </div>
  );
}
