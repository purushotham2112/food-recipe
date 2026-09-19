import { create } from 'zustand';

const savedToken = localStorage.getItem('recipeai_token');
const savedUser = localStorage.getItem('recipeai_user');

const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,

  setAuth: (user, token) => {
    localStorage.setItem('recipeai_token', token);
    localStorage.setItem('recipeai_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('recipeai_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  logout: () => {
    localStorage.removeItem('recipeai_token');
    localStorage.removeItem('recipeai_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
