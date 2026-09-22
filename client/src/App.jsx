import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ChefsPage from './pages/ChefsPage';
import ChefProfilePage from './pages/ChefProfilePage';
import AIRecipeGenerator from './pages/AIRecipeGenerator';
import AIFridgeAssistant from './pages/AIFridgeAssistant';
import CookingMode from './pages/CookingMode';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected User Pages
import UserDashboard from './pages/UserDashboard';
import FavoritesPage from './pages/FavoritesPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ShoppingListPage from './pages/ShoppingListPage';
import PantryPage from './pages/PantryPage';
import CreateRecipe from './pages/CreateRecipe';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRecipesPage from './pages/admin/AdminRecipesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Main Application Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="recipes/:slug" element={<RecipeDetail />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryDetailPage />} />
            <Route path="chefs" element={<ChefsPage />} />
            <Route path="chefs/:id" element={<ChefProfilePage />} />
            <Route path="ai/recipe-generator" element={<AIRecipeGenerator />} />
            <Route path="ai/fridge" element={<AIFridgeAssistant />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected User Routes */}
            <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="meal-planner" element={<ProtectedRoute><MealPlannerPage /></ProtectedRoute>} />
            <Route path="shopping-list" element={<ProtectedRoute><ShoppingListPage /></ProtectedRoute>} />
            <Route path="pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
            <Route path="create-recipe" element={<ProtectedRoute><CreateRecipe /></ProtectedRoute>} />
          </Route>

          {/* Fullscreen Cooking Mode */}
          <Route path="/cooking/:id" element={<CookingMode />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="recipes" element={<AdminRecipesPage />} />
            <Route path="categories" element={<AdminRecipesPage />} />
            <Route path="reviews" element={<AdminRecipesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="analytics" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
