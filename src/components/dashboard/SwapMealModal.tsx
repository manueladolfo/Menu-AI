import React, { useState, useMemo } from 'react';
import type { DayOfWeek, MealType, Recipe } from '../../types';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { getSwapAlternatives } from '../../services/menuAlgorithm';
import { generateSingleRecipeWithGemini } from '../../services/geminiService';
import {
  X,
  Check,
  Flame,
  Sparkles,
  Search,
  Clock,
  Bot,
  RefreshCw,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Play,
} from 'lucide-react';

interface SwapMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  mealType: MealType;
  currentRecipe: Recipe | null;
}

type FilterChip =
  | 'all'
  | 'sugerencias'
  | 'ia'
  | 'fast_food'
  | 'empanada'
  | 'sopa'
  | 'legumbre'
  | 'pescado'
  | 'carne'
  | 'pasta'
  | 'guiso'
  | 'huevos';

export const SwapMealModal: React.FC<SwapMealModalProps> = ({
  isOpen,
  onClose,
  day,
  mealType,
  currentRecipe,
}) => {
  const { recipes, weeklyMeals, swapMeal, addRecipeToCatalog, customRecipes, members } = useFamilyMenu();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Estado para generación con IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<Recipe | null>(null);
  const [saveToCatalog, setSaveToCatalog] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // 3 alternativas equilibradas sugeridas por el algoritmo
  const suggestedAlternatives = useMemo(() => {
    if (!currentRecipe) return [];
    return getSwapAlternatives(currentRecipe, recipes, weeklyMeals, mealType);
  }, [currentRecipe, recipes, weeklyMeals, mealType]);

  const suggestedIds = useMemo(() => {
    return new Set(suggestedAlternatives.map((r) => r.id));
  }, [suggestedAlternatives]);

  const customRecipeIds = useMemo(() => {
    return new Set(customRecipes.map((r) => r.id));
  }, [customRecipes]);

  // Lista unificada de recetas filtradas
  const displayedRecipes = useMemo(() => {
    return recipes.filter((r) => {
      // Excluir la receta actualmente activa
      if (currentRecipe && r.id === currentRecipe.id) return false;

      // Filtros rápidos
      if (activeFilter === 'sugerencias') {
        if (!suggestedIds.has(r.id)) return false;
      } else if (activeFilter === 'ia') {
        const isCustomOrAi = customRecipeIds.has(r.id) || r.id.startsWith('ai-');
        if (!isCustomOrAi) return false;
      } else if (activeFilter !== 'all') {
        if (r.type !== activeFilter) return false;
      }

      // Filtro por búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchIng = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchIng;
      }

      return true;
    }).sort((a, b) => {
      // Si el filtro es "all" y no hay búsqueda activa, dar prioridad visual a las sugerencias de hoy y a las de IA
      if (activeFilter === 'all' && !searchQuery.trim()) {
        const aSug = suggestedIds.has(a.id) ? 1 : 0;
        const bSug = suggestedIds.has(b.id) ? 1 : 0;
        if (aSug !== bSug) return bSug - aSug;

        const aAi = (customRecipeIds.has(a.id) || a.id.startsWith('ai-')) ? 1 : 0;
        const bAi = (customRecipeIds.has(b.id) || b.id.startsWith('ai-')) ? 1 : 0;
        if (aAi !== bAi) return bAi - aAi;
      }
      return 0;
    });
  }, [recipes, currentRecipe, activeFilter, searchQuery, suggestedIds, customRecipeIds]);

  if (!isOpen || !currentRecipe) return null;

  const handleSelect = (newRecipe: Recipe, shouldSave = false) => {
    if (shouldSave) {
      addRecipeToCatalog(newRecipe);
    }
    swapMeal(day, mealType, newRecipe);
    onClose();
  };

  const handleGenerateWithAI = async () => {
    setIsAiLoading(true);
    setAiFeedback(null);
    try {
      const res = await generateSingleRecipeWithGemini(aiPrompt, members);
      if (res.success && res.recipe) {
        setAiRecipe(res.recipe);
        setSaveToCatalog(false); // Desmarcado por defecto según requisito
        setAiFeedback(res.message);
      } else {
        setAiFeedback(res.message || 'No se pudo generar la receta.');
      }
    } catch (err: any) {
      setAiFeedback(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiRecipesCount = recipes.filter(
    (r) => customRecipeIds.has(r.id) || r.id.startsWith('ai-')
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#faf7f2] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-amber-950/10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/90">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c26546]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rotación y Variedad Familiar</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mt-0.5">
              Alternativas para el {day} ({mealType})
            </h2>
            <p className="text-xs text-stone-500">
              Plato actual: <span className="font-semibold text-stone-700">{currentRecipe.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Bar: Search + Toggle AI Generator */}
        <div className="p-3 sm:p-4 bg-white/60 border-b border-amber-950/5 space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por plato o ingrediente (ej. salmón, burger, lentejas, pimientos...)"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-[#c26546]/30 text-stone-800 placeholder:text-stone-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAiDrawer(!showAiDrawer)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs border ${
                showAiDrawer
                  ? 'bg-purple-700 text-white border-purple-700'
                  : 'bg-purple-50 text-purple-800 border-purple-200/80 hover:bg-purple-100/80'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pedir Idea a la IA</span>
              <span className="sm:hidden">IA</span>
              {showAiDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* AI Drawer (collapsible / smart prompt) */}
          {showAiDrawer && (
            <div className="bg-gradient-to-br from-purple-50/90 to-amber-50/60 border border-purple-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-950">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>¿Qué te apetece o qué tienes en la nevera?</span>
                </div>
                <span className="text-[10px] text-purple-700/80 font-medium">Google Gemini</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: Salmón al horno crujiente con mostaza y miel / Hamburguesa de pavo ligera..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400/40 text-stone-800"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateWithAI();
                  }}
                />
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Pensando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Crear</span>
                    </>
                  )}
                </button>
              </div>

              {aiFeedback && !isAiLoading && (
                <p className="text-[11px] text-purple-800/80 italic">{aiFeedback}</p>
              )}

              {/* Generated AI Proposal Card */}
              {aiRecipe && (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-200/90 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none">{aiRecipe.emoji || '✨'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Propuesta de Gemini
                        </span>
                        <span className="text-[11px] text-stone-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {aiRecipe.prep_time} min
                        </span>
                        {aiRecipe.batch_cooking && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                            <Flame className="w-2.5 h-2.5" /> Batch
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mt-1">
                        {aiRecipe.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {aiRecipe.description}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients preview */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-700 block mb-1">
                      Ingredientes previstos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiRecipe.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-stone-50 border border-stone-200/60 text-stone-700 px-2 py-0.5 rounded-lg"
                        >
                          {ing.name} ({ing.quantity} {ing.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="flex items-center gap-2 text-xs pt-1 text-stone-600">
                    <span className="font-bold text-stone-800">{aiRecipe.macros.calories} kcal</span>
                    <span>•</span>
                    <span className="text-[#3b6e3f] font-semibold">{aiRecipe.macros.protein}g P</span>
                    <span>•</span>
                    <span className="text-[#a06822] font-semibold">{aiRecipe.macros.carbs}g CH</span>
                  </div>

                  {/* 🔗 Enlace de referencia y elaboración paso a paso */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
                      <BookOpen className="w-3.5 h-3.5 text-[#c26546]" />
                      <span>Ver elaboración y fuente:</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta paso a paso ' + aiRecipe.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors border border-stone-200"
                        title="Abrir receta con pasos detallados e ingredientes en Google"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                        <span>Receta paso a paso</span>
                      </a>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ' + aiRecipe.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors border border-red-200"
                        title="Ver preparación en vídeo en YouTube"
                      >
                        <Play className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                        <span>Vídeo</span>
                      </a>
                    </div>
                  </div>

                  {/* User Opt-In Checkbox to Save into Permanent Catalog */}
                  <div className="pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 p-2.5 rounded-xl">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveToCatalog}
                        onChange={(e) => setSaveToCatalog(e.target.checked)}
                        className="w-4 h-4 rounded text-[#c26546] focus:ring-[#c26546]"
                      />
                      <span className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${saveToCatalog ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                        Guardar también en mi catálogo permanente
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateWithAI}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors"
                      >
                        Otra idea
                      </button>
                      <button
                        onClick={() => handleSelect(aiRecipe, saveToCatalog)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c26546] hover:bg-[#b0583b] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir este plato</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Filter Chips (Sugerencias, IA, Todo, Categorías) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] opacity-75">({recipes.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('sugerencias')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'sugerencias'
                  ? 'bg-[#c26546] text-white shadow-2xs'
                  : 'bg-amber-50 border border-amber-200/80 text-[#c26546] hover:bg-amber-100/70'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Sugerencias de hoy</span>
              <span className="text-[10px] opacity-75">({suggestedAlternatives.length})</span>
            </button>

            {aiRecipesCount > 0 && (
              <button
                onClick={() => setActiveFilter('ia')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'ia'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>Creadas con IA</span>
                <span className="text-[10px] opacity-75">({aiRecipesCount})</span>
              </button>
            )}

            <span className="w-px h-4 bg-stone-300 mx-1 shrink-0" />

            <button
              onClick={() => setActiveFilter('fast_food')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'fast_food'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍔 Findes
            </button>
            <button
              onClick={() => setActiveFilter('pescado')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'pescado'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🐟 Pescados
            </button>
            <button
              onClick={() => setActiveFilter('carne')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'carne'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍗 Carnes
            </button>
            <button
              onClick={() => setActiveFilter('legumbre')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'legumbre'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍲 Legumbres
            </button>
            <button
              onClick={() => setActiveFilter('pasta')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'pasta'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍝 Pastas
            </button>
            <button
              onClick={() => setActiveFilter('sopa')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'sopa'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥣 Sopas
            </button>
            <button
              onClick={() => setActiveFilter('empanada')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'empanada'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥟 Empanadas
            </button>
            <button
              onClick={() => setActiveFilter('huevos')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'huevos'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍳 Huevos
            </button>
          </div>
        </div>

        {/* Unified List of Recipes */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {displayedRecipes.length === 0 ? (
            <div className="text-center py-10 bg-white/80 rounded-2xl border border-dashed border-stone-200">
              <p className="text-sm font-bold text-stone-700">No encontramos recetas con ese filtro</p>
              <p className="text-xs text-stone-400 mt-1">
                Prueba con otro término o pide a la IA que cree una receta a tu medida arriba.
              </p>
            </div>
          ) : (
            displayedRecipes.map((recipe) => {
              const isSuggested = suggestedIds.has(recipe.id);
              const isAiCustom = customRecipeIds.has(recipe.id) || recipe.id.startsWith('ai-');
              const calDiff = recipe.macros.calories - currentRecipe.macros.calories;
              const sign = calDiff > 0 ? `+${calDiff}` : `${calDiff}`;

              return (
                <div
                  key={recipe.id}
                  className={`group p-3.5 sm:p-4 rounded-2xl bg-white/95 border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                    isSuggested
                      ? 'border-amber-400/80 bg-gradient-to-r from-white via-amber-50/20 to-white hover:border-[#c26546]'
                      : isAiCustom
                      ? 'border-purple-200 bg-gradient-to-r from-white via-purple-50/20 to-white hover:border-purple-400'
                      : 'border-amber-950/10 hover:border-[#c26546]/40 hover:bg-[#fffdfa]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none filter drop-shadow-xs shrink-0 mt-0.5">
                      {recipe.emoji || '🍽️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSuggested && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#c26546] px-2 py-0.5 rounded-full shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5" /> Sugerida para hoy
                          </span>
                        )}
                        {isAiCustom && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                            <Bot className="w-2.5 h-2.5" /> Creada con IA
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {recipe.type.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3" /> {recipe.prep_time} min
                        </span>
                        {recipe.batch_cooking && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                            <Flame className="w-2.5 h-2.5" /> Batch
                          </span>
                        )}
                        {isSuggested && (
                          <span className="text-[11px] font-semibold text-stone-400">
                            ({sign} kcal)
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug mt-1">
                        {recipe.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {recipe.description}
                      </p>
                    </div>
                  </div>

                  {/* Macro summary & button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-amber-950/5 gap-2">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <span className="font-bold text-stone-800">{recipe.macros.calories} kcal</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[#3b6e3f] font-semibold">{recipe.macros.protein}g P</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[#a06822] font-semibold">{recipe.macros.carbs}g CH</span>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta paso a paso ' + recipe.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200/80"
                        title="Ver receta y pasos de elaboración en la web"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                        <span>Elaboración</span>
                      </a>
                      <button
                        onClick={() => handleSelect(recipe)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c26546] hover:bg-[#b0583b] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir este plato</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white/80 border-t border-amber-950/5 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {displayedRecipes.length} alternativas disponibles
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
          >
            Mantener plato actual
          </button>
        </div>
      </div>
    </div>
  );
};
