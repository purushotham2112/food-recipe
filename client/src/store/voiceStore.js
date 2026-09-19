import { create } from 'zustand';

const useVoiceStore = create((set, get) => ({
  isAssistantOpen: false,
  status: 'IDLE', // 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR'
  transcript: '',
  lastResponse: "Hello! I'm Chef AI. What would you like to cook today?",
  errorMsg: '',

  // Conversation history
  history: [
    { sender: 'assistant', text: "Hello! I'm Chef AI. What would you like to cook today?", timestamp: new Date() }
  ],

  // Voice Timers
  activeTimers: [],

  // Voice Settings
  settings: {
    enabled: true,
    autoSpeak: true,
    language: 'en-US',
    volume: 1.0,
    speed: 1.0
  },

  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
  setStatus: (status) => set({ status }),
  setTranscript: (transcript) => set({ transcript }),
  setErrorMsg: (errorMsg) => set({ errorMsg, status: 'ERROR' }),

  addHistoryMessage: (sender, text) =>
    set((state) => ({
      history: [...state.history, { sender, text, timestamp: new Date() }],
      lastResponse: sender === 'assistant' ? text : state.lastResponse
    })),

  clearHistory: () =>
    set({
      history: [{ sender: 'assistant', text: "Hello! I'm Chef AI. What would you like to cook today?", timestamp: new Date() }],
      lastResponse: "Hello! I'm Chef AI. What would you like to cook today?"
    }),

  // Timers actions
  addTimer: (label, minutes) => {
    const id = Date.now().toString();
    const newTimer = {
      id,
      label: label || 'Cooking Timer',
      totalSeconds: minutes * 60,
      secondsLeft: minutes * 60,
      isActive: true
    };
    set((state) => ({ activeTimers: [...state.activeTimers, newTimer] }));
  },

  removeTimer: (id) =>
    set((state) => ({ activeTimers: state.activeTimers.filter((t) => t.id !== id) })),

  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } }))
}));

export default useVoiceStore;
