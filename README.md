# 🍳 RecipeAI — Smart Food & Recipe Platform

RecipeAI is a full-stack, AI-powered food discovery and smart cooking assistant platform. Built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**, it features multi-role access (User, Chef, Admin), step-by-step interactive cooking mode with browser voice commands, AI recipe generation, smart pantry tracking, automated meal planning, shopping list deduplication, and admin analytics dashboard.

---

## 🌟 Key Features

- 👤 **Multi-Role Authentication**: JWT-based auth with `User`, `Chef`, and `Admin` permissions.
- 🍳 **Interactive Cooking Mode**: Distraction-free fullscreen cooking interface with Web Speech API voice control (`"Next step"`, `"Previous step"`, `"Repeat"`) and countdown timer.
- ✨ **AI Recipe Studio**: Generate structured recipes from any prompt or pantry ingredients (Supports Gemini/OpenAI API or built-in intelligent AI fallback).
- 🥦 **What's in My Fridge?**: AI ingredient matching engine calculates recipe match percentages and missing ingredient breakdowns.
- 🧮 **Serving Calculator**: Instant mathematical scaling of ingredient quantities based on serving size.
- 📅 **Weekly Meal Planner**: Drag & schedule daily meals and aggregate required ingredients into an automated shopping list.
- 🛒 **Smart Shopping List**: Automated ingredient deduplication and unit combining.
- 📦 **Smart Pantry Tracker**: Expiration date calculation, low-stock indicators, and automated status alerts.
- 📊 **Admin Analytics Console**: Platform metrics, user role controls, recipe moderation, and report resolution with Recharts graphs.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with 3 demo accounts for immediate testing:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@recipeai.com` | `admin12345` |
| **Chef** | `chef@recipeai.com` | `chef12345` |
| **User** | `user@recipeai.com` | `user12345` |

---

## 🚀 Quick Start Guide (Run Locally in VS Code)

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally (`mongodb://localhost:27017/recipeai`) or MongoDB Atlas URI.

### Step 1: Install Dependencies
Run the setup command from the project root directory:

```bash
# Install root, server, and client dependencies
npm run setup
```

### Step 2: Seed Database
Populate the database with 30+ recipes, 10 categories, demo users, and reviews:

```bash
npm run seed
```

### Step 3: Start Development Application
Launch both backend server (port 5000) and Vite frontend (port 5173) concurrently:

```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 Running Backend API Tests

To run the automated backend integration test suite verifying Auth, Recipes, AI, and Shopping List endpoints:

```bash
npm run test
```

---

## ⚙️ Environment Variables Setup

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/recipeai
JWT_SECRET=recipeai_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional External Credentials (Fallback engine active if left empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

AI_PROVIDER=gemini
AI_API_KEY=
```

---

## 🏗 System Architecture

```
food recipe/
├── package.json               # Monorepo scripts (setup, dev, seed, test)
├── README.md
├── server/
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic controllers
│   ├── middleware/            # Auth, Upload & Error handling
│   ├── models/                # 12 Mongoose Schemas
│   ├── routes/                # Express API endpoints
│   ├── services/              # AI abstraction layer
│   ├── utils/                 # Database seed script
│   ├── tests/                 # Integration test suite
│   └── server.js              # Application entry point
└── client/
    ├── src/
    │   ├── components/        # RecipeCard, CookingTimer, VoiceControl, etc.
    │   ├── layouts/           # Main, Auth, Admin layouts
    │   ├── pages/             # Home, Explore, CookingMode, AI Pages, etc.
    │   ├── services/          # Centralized Axios API services
    │   ├── store/             # Zustand Auth & Theme state
    │   ├── App.jsx            # Router & Guards setup
    │   └── main.jsx
    └── vite.config.js
```

---

## 📄 License
MIT License. Created for RecipeAI.
