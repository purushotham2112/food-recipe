import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Upload, ChefHat } from 'lucide-react';
import { createRecipe } from '../services/recipeService';
import { getCategories } from '../services/categoryService';

export default function CreateRecipe() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('Italian');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [preparationTime, setPreparationTime] = useState(15);
  const [cookingTime, setCookingTime] = useState(20);
  const [servings, setServings] = useState(2);
  const [image, setImage] = useState('');

  // Dynamic Builders
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: 100, unit: 'g' }
  ]);

  const [instructions, setInstructions] = useState([
    { stepNumber: 1, title: 'Prep', description: '', duration: 5 }
  ]);

  const [nutrition, setNutrition] = useState({
    calories: 400,
    protein: 20,
    carbohydrates: 40,
    fat: 15
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
        if (res.data?.[0]) setCategory(res.data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 100, unit: 'g' }]);
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddStep = () => {
    setInstructions([
      ...instructions,
      { stepNumber: instructions.length + 1, title: '', description: '', duration: 5 }
    ]);
  };

  const handleRemoveStep = (idx) => {
    const updated = instructions.filter((_, i) => i !== idx).map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setInstructions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      alert('Please fill out title, description, and category.');
      return;
    }

    try {
      setLoading(true);
      const res = await createRecipe({
        title,
        description,
        cuisine,
        category,
        difficulty,
        preparationTime: Number(preparationTime),
        cookingTime: Number(cookingTime),
        servings: Number(servings),
        image: image || undefined,
        ingredients: ingredients.filter((i) => i.name.trim()),
        instructions: instructions.filter((i) => i.description.trim()),
        nutrition
      });

      alert('Recipe created successfully!');
      navigate(`/recipes/${res.data.slug}`);
    } catch (err) {
      alert(err.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-brand-500" /> Create New Gourmet Recipe
        </h1>
        <p className="text-sm text-slate-500 mt-1">Publish your culinary masterpiece to the global RecipeAI community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Basic Information</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Recipe Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Creamy Mushroom Truffle Risotto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Description</label>
            <textarea
              rows="3"
              required
              placeholder="Describe aromas, flavors, and origin story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Cuisine</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Prep Time (mins)</label>
              <input
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Cook Time (mins)</label>
              <input
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Image URL (Unsplash or Cloudinary)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Section 2: Ingredients Builder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Ingredients Builder</h3>
            <button type="button" onClick={handleAddIngredient} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => {
                    const copy = [...ingredients];
                    copy[i].name = e.target.value;
                    setIngredients(copy);
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => {
                    const copy = [...ingredients];
                    copy[i].quantity = Number(e.target.value);
                    setIngredients(copy);
                  }}
                  className="w-20 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => {
                    const copy = [...ingredients];
                    copy[i].unit = e.target.value;
                    setIngredients(copy);
                  }}
                  className="w-16 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <button type="button" onClick={() => handleRemoveIngredient(i)} className="text-rose-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Instructions Builder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Instructions Builder</h3>
            <button type="button" onClick={handleAddStep} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Step
            </button>
          </div>

          <div className="space-y-4">
            {instructions.map((step, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-brand-600">STEP {step.stepNumber}</span>
                  <button type="button" onClick={() => handleRemoveStep(i)} className="text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Step title (Optional)"
                  value={step.title}
                  onChange={(e) => {
                    const copy = [...instructions];
                    copy[i].title = e.target.value;
                    setInstructions(copy);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
                <textarea
                  rows="2"
                  placeholder="Detailed cooking instruction..."
                  value={step.description}
                  onChange={(e) => {
                    const copy = [...instructions];
                    copy[i].description = e.target.value;
                    setInstructions(copy);
                  }}
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Publish Recipe
        </button>
      </form>
    </div>
  );
}
