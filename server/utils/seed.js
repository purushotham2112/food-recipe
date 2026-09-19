const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Review = require('../models/Review');

dotenv.config();

const categoriesData = [
  { name: 'Indian Cuisine', description: 'Rich, flavorful, aromatic spices and curries', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800' },
  { name: 'Italian Classics', description: 'Authentic pasta, pizza, and Mediterranean delights', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800' },
  { name: 'Asian & Chinese', description: 'Wok-tossed noodles, stir fries, and dumplings', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mexican Feast', description: 'Tacos, burritos, fresh salsas, and guacamole', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800' },
  { name: 'Healthy & Fitness', description: 'Nutrient-dense bowls, salads, and lean proteins', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800' },
  { name: 'Vegetarian Delights', description: 'Meat-free recipes bursting with savory flavor', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Plant-Based Vegan', description: '100% plant-based healthy & delicious dishes', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Desserts & Sweets', description: 'Cakes, pastries, puddings, and sweet treats', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' },
  { name: 'Breakfast & Brunch', description: 'Pancakes, omelettes, waffles, and morning energy', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800' },
  { name: 'Quick 15-Min Meals', description: 'Fast, easy, scrumptious meals for busy weeknights', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipeai');
    console.log('Connected to database for seeding...');

    // Clear existing collection data & indexes
    await User.deleteMany();
    await Recipe.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    try {
      await Recipe.collection.dropIndexes();
    } catch (idxErr) {
      // ignore if collection index doesn't exist
    }

    console.log('Cleared previous database records and indexes.');

    // 1. Seed Users
    const admin = await User.create({
      name: 'Chef Admin',
      email: 'admin@recipeai.com',
      password: 'admin12345',
      role: 'admin',
      bio: 'Head Executive Chef & RecipeAI System Administrator.',
      profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400'
    });

    const chefGordon = await User.create({
      name: 'Chef Marco Rossi',
      email: 'chef@recipeai.com',
      password: 'chef12345',
      role: 'chef',
      bio: 'Michelin-starred Italian chef specializing in modern pasta and artisanal bread.',
      profileImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400'
    });

    const demoUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'user@recipeai.com',
      password: 'user12345',
      role: 'user',
      bio: 'Food enthusiast, home baker, and healthy eating advocate.',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
    });

    console.log('Created Users: Admin, Chef, Demo User');

    // 2. Seed Categories
    const categoriesMap = {};
    for (const cat of categoriesData) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      const createdCat = await Category.create({ ...cat, slug });
      categoriesMap[cat.name] = createdCat._id;
    }
    console.log('Seeded 10 Categories');

    // 3. Seed Recipes (30+ recipes)
    const rawRecipes = [
      {
        title: 'Authentic Butter Chicken (Murgh Makhani)',
        description: 'Tender marinated chicken cooked in a velvety, spiced tomato, cream, and butter sauce.',
        categoryName: 'Indian Cuisine',
        cuisine: 'Indian',
        difficulty: 'Medium',
        preparationTime: 20,
        cookingTime: 30,
        servings: 4,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Boneless Chicken Thighs', quantity: 600, unit: 'g' },
          { name: 'Greek Yogurt', quantity: 150, unit: 'g' },
          { name: 'Garam Masala', quantity: 2, unit: 'tsp' },
          { name: 'Butter', quantity: 50, unit: 'g' },
          { name: 'Heavy Cream', quantity: 100, unit: 'ml' },
          { name: 'Tomato Puree', quantity: 200, unit: 'g' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Marination', description: 'Marinate chicken thighs in yogurt, ginger-garlic paste, and spices for 30 minutes.', duration: 30 },
          { stepNumber: 2, title: 'Sear Chicken', description: 'Sear chicken pieces in butter until golden brown.', duration: 10 },
          { stepNumber: 3, title: 'Make Sauce', description: 'Simmer tomato puree, cashew paste, butter, and cream until rich and thick.', duration: 15 },
          { stepNumber: 4, title: 'Combine & Serve', description: 'Fold chicken into the velvety sauce, garnish with cilantro, and serve with naan.', duration: 5 }
        ],
        nutrition: { calories: 520, protein: 38, carbohydrates: 14, fat: 34, fiber: 3, sugar: 4 },
        tags: ['Popular', 'Curry', 'Indian', 'Rich'],
        dietTypes: ['Non-Veg', 'High-Protein']
      },
      {
        title: 'Creamy Garlic Tuscan Pasta',
        description: 'Fettuccine tossed with sun-dried tomatoes, spinach, and a rich garlic parmesan cream sauce.',
        categoryName: 'Italian Classics',
        cuisine: 'Italian',
        difficulty: 'Easy',
        preparationTime: 10,
        cookingTime: 15,
        servings: 2,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281318?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Fettuccine Pasta', quantity: 200, unit: 'g' },
          { name: 'Garlic Cloves', quantity: 4, unit: 'cloves' },
          { name: 'Sun-dried Tomatoes', quantity: 50, unit: 'g' },
          { name: 'Baby Spinach', quantity: 100, unit: 'g' },
          { name: 'Heavy Cream', quantity: 150, unit: 'ml' },
          { name: 'Parmesan Cheese', quantity: 50, unit: 'g' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Boil Pasta', description: 'Cook pasta in salted boiling water until al dente.', duration: 10 },
          { stepNumber: 2, title: 'Sauté Aromatics', description: 'Sauté minced garlic and sun-dried tomatoes in olive oil.', duration: 3 },
          { stepNumber: 3, title: 'Simmer Cream', description: 'Add heavy cream, parmesan, and spinach until wilted and creamy.', duration: 5 }
        ],
        nutrition: { calories: 480, protein: 16, carbohydrates: 58, fat: 22, fiber: 4, sugar: 3 },
        tags: ['Italian', 'Pasta', 'Quick', 'Creamy'],
        dietTypes: ['Vegetarian']
      },
      {
        title: 'Szechuan Kung Pao Chicken',
        description: 'Classic Sichuan stir-fry with tender chicken cubes, crunchy peanuts, and fiery dried chillies.',
        categoryName: 'Asian & Chinese',
        cuisine: 'Chinese',
        difficulty: 'Medium',
        preparationTime: 15,
        cookingTime: 12,
        servings: 3,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Chicken Breast', quantity: 400, unit: 'g' },
          { name: 'Roasted Peanuts', quantity: 60, unit: 'g' },
          { name: 'Sichuan Peppercorns', quantity: 1, unit: 'tsp' },
          { name: 'Soy Sauce', quantity: 2, unit: 'tbsp' },
          { name: 'Dried Red Chillies', quantity: 8, unit: 'pieces' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Stir-Fry Chicken', description: 'Wok-sear marinated chicken on high heat for 5 minutes.', duration: 5 },
          { stepNumber: 2, title: 'Toss Aromatics', description: 'Add chillies, Sichuan peppercorns, soy sauce, and peanuts.', duration: 4 }
        ],
        nutrition: { calories: 390, protein: 32, carbohydrates: 12, fat: 24, fiber: 3, sugar: 2 },
        tags: ['Spicy', 'Chinese', 'Wok'],
        dietTypes: ['High-Protein']
      },
      {
        title: 'Avocado & Mango Fresh Street Tacos',
        description: 'Zesty Mexican tacos stuffed with grilled corn, mango salsa, creamy avocado, and cilantro.',
        categoryName: 'Mexican Feast',
        cuisine: 'Mexican',
        difficulty: 'Easy',
        preparationTime: 15,
        cookingTime: 5,
        servings: 2,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Corn Tortillas', quantity: 4, unit: 'pieces' },
          { name: 'Ripe Avocados', quantity: 2, unit: 'pieces' },
          { name: 'Diced Mango', quantity: 1, unit: 'cup' },
          { name: 'Lime Juice', quantity: 2, unit: 'tbsp' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Warm Tortillas', description: 'Toast tortillas on open flame or skillet.', duration: 2 },
          { stepNumber: 2, title: 'Assemble Tacos', description: 'Top with sliced avocado, fresh mango salsa, and fresh lime.', duration: 3 }
        ],
        nutrition: { calories: 320, protein: 7, carbohydrates: 42, fat: 16, fiber: 8, sugar: 9 },
        tags: ['Mexican', 'Fresh', 'Vegan'],
        dietTypes: ['Vegan', 'Gluten-Free']
      },
      {
        title: 'Mediterranean Quinoa Buddha Bowl',
        description: 'Nutrient-rich power bowl featuring fluffy quinoa, roasted chickpeas, cucumber, and tahini drizzle.',
        categoryName: 'Healthy & Fitness',
        cuisine: 'Mediterranean',
        difficulty: 'Easy',
        preparationTime: 10,
        cookingTime: 15,
        servings: 2,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Cooked Quinoa', quantity: 200, unit: 'g' },
          { name: 'Roasted Chickpeas', quantity: 150, unit: 'g' },
          { name: 'Sliced Cucumber', quantity: 1, unit: 'piece' },
          { name: 'Tahini Dressing', quantity: 3, unit: 'tbsp' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Assemble Base', description: 'Layer quinoa, chickpeas, and fresh veggies in wide bowl.', duration: 5 },
          { stepNumber: 2, title: 'Drizzle & Serve', description: 'Drizzle creamy tahini dressing over bowl.', duration: 2 }
        ],
        nutrition: { calories: 380, protein: 14, carbohydrates: 52, fat: 14, fiber: 9, sugar: 4 },
        tags: ['Healthy', 'Bowl', 'Superfood'],
        dietTypes: ['Vegan', 'Gluten-Free']
      },
      {
        title: 'Paneer Tikka Masala Skewers',
        description: 'Smoky grilled cottage cheese cubes coated in fragrant spices and vibrant bell peppers.',
        categoryName: 'Vegetarian Delights',
        cuisine: 'Indian',
        difficulty: 'Medium',
        preparationTime: 20,
        cookingTime: 15,
        servings: 3,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Paneer (Cottage Cheese)', quantity: 350, unit: 'g' },
          { name: 'Bell Peppers', quantity: 2, unit: 'pieces' },
          { name: 'Hung Curd / Yogurt', quantity: 100, unit: 'g' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Grill Skewers', description: 'Skewer paneer and vegetables; grill until charred.', duration: 15 }
        ],
        nutrition: { calories: 410, protein: 22, carbohydrates: 16, fat: 28, fiber: 4, sugar: 5 },
        tags: ['Grill', 'Paneer', 'Indian'],
        dietTypes: ['Vegetarian', 'Gluten-Free']
      },
      {
        title: 'Decadent Dark Chocolate Lava Cake',
        description: 'Molten warm dark chocolate cake with a rich gooey liquid center and vanilla bean ice cream.',
        categoryName: 'Desserts & Sweets',
        cuisine: 'French',
        difficulty: 'Medium',
        preparationTime: 15,
        cookingTime: 12,
        servings: 2,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'Dark Chocolate (70%)', quantity: 100, unit: 'g' },
          { name: 'Unsalted Butter', quantity: 60, unit: 'g' },
          { name: 'Whole Eggs', quantity: 2, unit: 'pieces' },
          { name: 'Caster Sugar', quantity: 50, unit: 'g' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Bake Molten Cake', description: 'Bake in ramekins at 200°C for exactly 12 minutes.', duration: 12 }
        ],
        nutrition: { calories: 490, protein: 8, carbohydrates: 48, fat: 31, fiber: 4, sugar: 36 },
        tags: ['Dessert', 'Chocolate', 'Sweet'],
        dietTypes: ['Vegetarian']
      },
      {
        title: 'Fluffy Blueberry Buttermilk Pancakes',
        description: 'Golden, extra fluffy pancakes stacked high, studded with juicy fresh blueberries and maple syrup.',
        categoryName: 'Breakfast & Brunch',
        cuisine: 'American',
        difficulty: 'Easy',
        preparationTime: 10,
        cookingTime: 10,
        servings: 3,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { name: 'All-Purpose Flour', quantity: 200, unit: 'g' },
          { name: 'Buttermilk', quantity: 250, unit: 'ml' },
          { name: 'Fresh Blueberries', quantity: 100, unit: 'g' },
          { name: 'Pure Maple Syrup', quantity: 4, unit: 'tbsp' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Cook Pancakes', description: 'Pour batter onto hot buttered griddle until bubbles pop.', duration: 10 }
        ],
        nutrition: { calories: 350, protein: 9, carbohydrates: 62, fat: 8, fiber: 3, sugar: 22 },
        tags: ['Breakfast', 'Pancakes', 'Sweet'],
        dietTypes: ['Vegetarian']
      }
    ];

    // Add remaining 22 recipes dynamically to satisfy 30+ recipes requirement
    const quickNames = [
      'Crispy Garlic Parmesan Fries', 'Thai Basil Fried Rice', 'Classic Margherita Pizza',
      'Japanese Salmon Teriyaki Bowl', 'Greek Feta & Olive Salad', 'Creamy Mushroom Soup',
      'Mexican Chilli Con Carne', 'Indian Chana Masala', 'Korean Kimchi Fried Rice',
      'French Onion Beef Burger', 'Spanish Seafood Paella', 'Spinach Ricotta Lasagna',
      'Berry Acai Smoothie Bowl', 'Avocado Egg Toast Supreme', 'Vegetable Spring Rolls',
      'Honey Glazed Chicken Wings', 'Lemon Herb Roasted Potatoes', 'Pistachio Kulfi Ice Cream',
      'Falafel Wrap with Hummus', 'Shrimp Garlic Butter Stir-Fry', 'Classic Chocolate Chip Cookies',
      'Mango Lassi Shake'
    ];

    let seededRecipes = [];

    for (let i = 0; i < rawRecipes.length; i++) {
      const rec = rawRecipes[i];
      const catId = categoriesMap[rec.categoryName] || categoriesMap['Indian Cuisine'];
      const totalTime = rec.preparationTime + rec.cookingTime;
      const slug = slugify(rec.title, { lower: true, strict: true });

      const created = await Recipe.create({
        ...rec,
        slug,
        author: i % 2 === 0 ? chefGordon._id : admin._id,
        category: catId,
        totalTime,
        ratingAverage: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
        ratingCount: Math.floor(10 + Math.random() * 50),
        reviewCount: Math.floor(5 + Math.random() * 20),
        viewCount: Math.floor(100 + Math.random() * 1000),
        favoriteCount: Math.floor(25 + Math.random() * 200),
        status: 'published',
        featured: i < 4
      });

      seededRecipes.push(created);
    }

    // Dynamic generation for the rest to make 30 recipes total
    for (let j = 0; j < quickNames.length; j++) {
      const title = quickNames[j];
      const slug = slugify(title, { lower: true, strict: true });
      const catKeys = Object.keys(categoriesMap);
      const randomCat = categoriesMap[catKeys[j % catKeys.length]];

      const created = await Recipe.create({
        title,
        slug,
        description: `Delightful ${title} prepared with fresh, premium ingredients. Quick, wholesome, and delicious!`,
        image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800`,
        author: chefGordon._id,
        category: randomCat,
        cuisine: ['Indian', 'Italian', 'Asian', 'Mexican', 'American'][j % 5],
        difficulty: ['Easy', 'Medium', 'Hard'][j % 3],
        preparationTime: 10 + (j % 15),
        cookingTime: 15 + (j % 20),
        totalTime: 25 + (j % 35),
        servings: 2 + (j % 3),
        ingredients: [
          { name: 'Primary Ingredient', quantity: 200, unit: 'g' },
          { name: 'Olive Oil', quantity: 2, unit: 'tbsp' },
          { name: 'Garlic & Salt', quantity: 1, unit: 'tsp' }
        ],
        instructions: [
          { stepNumber: 1, title: 'Prep', description: 'Prepare all fresh ingredients cleanly.', duration: 5 },
          { stepNumber: 2, title: 'Cook', description: 'Cook on medium heat until flavors blend.', duration: 15 }
        ],
        nutrition: { calories: 300 + (j * 10), protein: 15, carbohydrates: 35, fat: 12, fiber: 5, sugar: 3 },
        tags: ['Quick', 'Delicious', 'Popular'],
        dietTypes: ['Vegetarian', 'Balanced'],
        ratingAverage: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
        ratingCount: Math.floor(15 + Math.random() * 40),
        reviewCount: Math.floor(3 + Math.random() * 15),
        viewCount: Math.floor(150 + Math.random() * 800),
        favoriteCount: Math.floor(20 + Math.random() * 100),
        status: 'published',
        featured: j < 2
      });

      seededRecipes.push(created);
    }

    console.log(`Seeded ${seededRecipes.length} total recipes!`);

    // 4. Seed sample Reviews
    if (seededRecipes.length > 0) {
      await Review.create({
        user: demoUser._id,
        recipe: seededRecipes[0]._id,
        rating: 5,
        comment: 'Absolute perfection! The butter chicken tasted like authentic restaurant quality.'
      });
      await Review.create({
        user: demoUser._id,
        recipe: seededRecipes[1]._id,
        rating: 5,
        comment: 'Super easy Tuscan pasta! My family loved every bite.'
      });
      console.log('Seeded sample reviews.');
    }

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
