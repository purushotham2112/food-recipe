import { useLocation } from 'react-router-dom';

export default function useVoiceCommand() {
  const location = useLocation();

  const getPageContextSuggestions = () => {
    const path = location.pathname;
    if (path.includes('/cooking/')) {
      return [
        'Next step',
        'Previous step',
        'Repeat instructions',
        'Set a timer for 8 minutes',
        'How much onion do I need?'
      ];
    }
    if (path.includes('/pantry')) {
      return [
        'What is in my pantry?',
        'What expires soon?',
        'Find recipes using tomato and rice'
      ];
    }
    if (path.includes('/shopping-list')) {
      return [
        'Add 2 kilograms of rice',
        'Clear completed items'
      ];
    }
    if (path.includes('/meal-planner')) {
      return [
        "What's for dinner today?",
        "Add chicken curry to tomorrow's dinner"
      ];
    }
    return [
      'Find easy chicken recipes',
      'What can I cook with egg, tomato and rice?',
      'What can I substitute for butter?',
      'Set a timer for 10 minutes'
    ];
  };

  return {
    pageSuggestions: getPageContextSuggestions()
  };
}
