import api from './api';

export const generateAIRecipe = async (data) => {
  return await api.post('/ai/generate-recipe', data);
};

export const getFridgeMatches = async (ingredients) => {
  return await api.post('/ai/fridge', { ingredients });
};

export const getIngredientSubstitution = async (data) => {
  return await api.post('/ai/substitution', data);
};

export const getAIRecommendations = async () => {
  return await api.get('/ai/recommendations');
};
