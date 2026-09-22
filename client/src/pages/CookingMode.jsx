import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Play, RotateCcw, Volume2 } from 'lucide-react';
import CookingTimer from '../components/CookingTimer';
import { getRecipeById } from '../services/recipeService';

export default function CookingMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await getRecipeById(id);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Cooking Mode...</div>;
  }

  if (!recipe || !recipe.instructions?.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 text-center">
        <h2>Recipe instructions unavailable</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand-400 font-bold">Go Back</button>
      </div>
    );
  }

  const steps = recipe.instructions;
  const currentStep = steps[currentStepIdx];
  const progressPercent = Math.round(((currentStepIdx + 1) / steps.length) * 100);

  const speakCurrentStep = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Step ${currentStepIdx + 1}: ${currentStep.title ? currentStep.title + '.' : ''} ${currentStep.description}`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Exit Cooking Mode"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-white truncate max-w-xs sm:max-w-md">
              {recipe.title}
            </h2>
            <p className="text-xs text-brand-400 font-semibold">
              Distraction-Free Guided Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-black text-amber-400 text-sm">
            STEP {currentStepIdx + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden my-4">
        <div
          className="bg-gradient-to-r from-brand-500 to-amber-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* CENTER STAGE INSTRUCTION */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8 text-center">
        
        {/* Step Badge & Duration */}
        <div className="flex items-center justify-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-brand-950 text-brand-400 border border-brand-800 font-extrabold text-xs">
            STEP {currentStepIdx + 1}
          </span>
          {currentStep.duration > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-bold">
              ⏱ {currentStep.duration} min duration
            </span>
          )}
        </div>

        {/* Step Title & Description */}
        <div className="space-y-4">
          {currentStep.title && (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {currentStep.title}
            </h3>
          )}

          <p className="text-2xl sm:text-4xl font-extrabold text-slate-100 leading-snug tracking-tight max-w-3xl mx-auto">
            "{currentStep.description}"
          </p>
        </div>

        {/* Text to Speech Read Aloud Button */}
        <button
          onClick={speakCurrentStep}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-800 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-brand-400" /> Read Step Aloud
        </button>

        {/* Built-in Step Timer */}
        {currentStep.duration > 0 && (
          <div className="pt-4 max-w-xs mx-auto">
            <CookingTimer defaultMinutes={currentStep.duration} />
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION FOOTER */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStepIdx === 0}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Previous Step
        </button>

        {currentStepIdx === steps.length - 1 ? (
          <button
            onClick={() => navigate(`/recipes/${recipe.slug}`)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl transition-all"
          >
            🎉 Finish Cooking & Enjoy!
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-black text-sm shadow-xl transition-all"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
