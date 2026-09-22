# 🍳 RecipeAI — Smart Food & Recipe Platform

RecipeAI is a full-stack, AI-powered food discovery and smart cooking platform. Built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**, it features multi-role access (User, Chef, Admin), step-by-step interactive cooking mode, AI recipe generation, smart pantry tracking, automated meal planning, shopping list deduplication, and an admin analytics dashboard.

---

## 🌟 Key Features

- 👤 **Multi-Role Authentication**: JWT-based auth with `User`, `Chef`, and `Admin` permissions.
- 🍳 **Interactive Cooking Mode**: Distraction-free fullscreen cooking interface with step progress bar and countdown timer.
- ✨ **AI Recipe Studio**: Generate structured recipes from any prompt or pantry ingredients.
- 🥦 **What's in My Fridge?**: AI ingredient matching engine calculates recipe match percentages and missing ingredient breakdowns.
- 🧮 **Serving Calculator**: Instant mathematical scaling of ingredient quantities based on serving size.
- 📅 **Weekly Meal Planner**: Drag & schedule daily meals and aggregate required ingredients automatically into your shopping list.
- 🛒 **Smart Shopping List**: Automated ingredient deduplication and unit combining.
- 📦 **Smart Pantry Tracker**: Expiration date calculation, low-stock indicators, and automated status alerts.
- 📊 **Admin Analytics Console**: Platform metrics, user role controls, recipe moderation, and report resolution with Recharts graphs.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@recipeai.com` | `admin12345` |
| **Chef** | `chef@recipeai.com` | `chef12345` |
| **User** | `user@recipeai.com` | `user12345` |

---

## 🚀 Quick Start Guide (Run Locally)

### Step 1: Install Dependencies
```bash
npm run setup
```

### Step 2: Seed Database
Populate database with initial recipes, categories, demo users, and reviews:
```bash
npm run seed
```

### Step 3: Start Application
Launch both backend server (port 5000) and frontend (port 5173):
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## ⚙️ Environment Configuration

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/recipeai
JWT_SECRET=recipeai_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

---

## 🧪 Testing

Run backend integration test suite:
```bash
npm run test
```
