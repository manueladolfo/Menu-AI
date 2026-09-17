import React, { useState } from 'react';
import type { DayOfWeek, MealType, Recipe } from '../../types';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { SwapSaladModal } from './SwapSaladModal';
import { Clock, RefreshCw, Flame, ChevronDown, ChevronUp, AlertCircle, ShoppingBag, Leaf, ExternalLink, Play } from 'lucide-react';

interface MealCardProps {
  day: DayOfWeek;
  mealType: MealType;
  recipe: Recipe;
  onOpenSwap: (recipe: Recipe, mealType: MealType) => void;
}

const TYPE_COLORS: Record<string, string> = {
  legumbre: 'bg-[#fbf4eb] text-[#8a4b27] border-[#ecd8c7]',
  pescado: 'bg-[#edf5f8] text-[#2c667a] border-[#d2e5ed]',
  carne: 'bg-[#fbf0ef] text-[#934440] border-[#edd1ce]',
  pasta: 'bg-[#fdf6ea] text-[#94611d] border-[#f5e1be]',
  ensalada: 'bg-[#edf5ed] text-[#3b6e3f] border-[#d2e6d3]',
  verdura: 'bg-[#f4f7ea] text-[#556e29] border-[#dfe8c5]',
  huevos: 'bg-[#fdf9e8] text-[#876a17] border-[#f5ebba]',
  guiso: 'bg-[#f7f0f8] text-[#6e3975] border-[#ebd3ec]',
  sopa: 'bg-[#eef7f6] text-[#2d6f6a] border-[#cbe8e5]',
  fast_food: 'bg-[#fef2eb] text-[#9a4b29] border-[#fcd5bf]',
  empanada: 'bg-[#fef6e7] text-[#8c591c] border-[#f8e0b9]',
};

export const MealCard: React.FC<MealCardProps> = ({ day, mealType, recipe, onOpenSwap }) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const [isSaladModalOpen, setIsSaladModalOpen] = useState(false);
  const { members, activeMembersCount, getSaladForMeal } = useFamilyMenu();

  // Acompañamiento fresco diario obligatorio (ensalada, tomate aliñado, etc.)
  const saladSide = getSaladForMeal(day, mealType);

  // Filtrar familiares activos que están a dieta
  const activeDietMembers = members.filter((m) => m.activeStatus && m.isOnDiet);

  return (
    <>
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
        {/* Header: Meal type & Swap button */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  mealType === 'almuerzo'
                    ? 'bg-amber-100/70 text-amber-900 border border-amber-200/60'
                    : 'bg-orange-100/70 text-orange-950 border border-orange-200/60'
                }`}
              >
                {mealType === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}
              </span>

              {/* Batch cooking indicator badge */}
              {recipe.batch_cooking && (
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/60">
                  <Flame className="w-3 h-3 text-purple-600" />
                  Batch Cooking
                </span>
              )}

              {/* Weekend fast food / comfort badge */}
              {(recipe.type === 'fast_food' || recipe.type === 'empanada') && (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/60">
                  🍔 Fin de Semana
                </span>
              )}
            </div>

            {/* Hot-Swap Action Button */}
            <button
              onClick={() => onOpenSwap(recipe, mealType)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#c26546] bg-[#fbf3ef] hover:bg-[#f6e6de] active:scale-95 transition-all border border-[#f2ded5] shadow-2xs"
              title="Intercambiar plato por otra alternativa equivalente o buscar en catálogo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* Recipe Title & Emoji */}
          <div className="flex items-start gap-3 my-1">
            <span className="text-3xl sm:text-4xl select-none filter drop-shadow-xs">
              {recipe.emoji || '🍲'}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug">
                {recipe.title}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                {recipe.description}
              </p>
            </div>
          </div>

          {/* Metadata badges: time, type */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border ${
                TYPE_COLORS[recipe.type] || 'bg-stone-100 text-stone-700'
              }`}
            >
              {recipe.type.replace('_', ' ').toUpperCase()}
            </span>

            <span className="flex items-center gap-1 text-stone-500 font-semibold bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200/60">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {recipe.prep_time} min
            </span>

            <span className="text-stone-400 text-[11px] font-medium">
              {activeMembersCount} raciones
            </span>
          </div>

          {/* 🥗 Acompañamiento Fresco Diario Obligatorio con Selector/Buscador */}
          {saladSide && (
            <div className="mt-3 p-3 rounded-2xl bg-[#f0f6f0] border border-[#d4e6d4] flex items-center justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <span className="text-2xl select-none shrink-0">{saladSide.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-[#3a633d] tracking-wider">
                      Ensalada del menú:
                    </span>
                    <Leaf className="w-3 h-3 text-[#3a633d]" />
                  </div>
                  <p className="text-xs font-bold text-stone-900 leading-snug">
                    {saladSide.name}
                  </p>
                  <p className="text-[11px] text-[#426b45] line-clamp-1 mt-0.5">
                    {saladSide.description}
                  </p>
                </div>
              </div>

              {/* Botón interactivo para cambiar o buscar ensaladas */}
              <button
                onClick={() => setIsSaladModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#2e5632] bg-white/90 hover:bg-white px-2.5 py-1.5 rounded-xl border border-[#c3dcc3] shadow-2xs transition-all active:scale-95 shrink-0"
                title="Cambiar o buscar otra ensalada del catálogo para esta comida"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Cambiar</span>
              </button>
            </div>
          )}

          {/* Batch cooking note highlight */}
          {recipe.batch_cooking && recipe.batch_notes && (
            <div className="mt-3 p-2.5 rounded-2xl bg-[#f7f2f8] border border-[#ecddec] text-xs text-[#5e3863]">
              <div className="flex items-center gap-1.5 font-bold mb-0.5 text-[#5e3863]">
                <Flame className="w-3.5 h-3.5 text-purple-500" />
                <span>Preparación adelantada (Domingo):</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{recipe.batch_notes}</p>
            </div>
          )}

          {/* Diet Adaptations */}
          {activeDietMembers.length > 0 && recipe.diet_adaptation && (
            <div className="mt-3 p-3 rounded-2xl bg-[#fdf8ed] border border-[#f5e5be] text-xs text-[#78541c]">
              <div className="flex items-center gap-1.5 font-bold text-[#78541c] mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Adaptación para dieta ({activeDietMembers.map((m) => m.name).join(', ')}):</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium">
                {recipe.diet_adaptation}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Macro pills & Ingredients toggle */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            {/* Quick macros en tonos pasteles */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-stone-800">{recipe.macros.calories} kcal</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#3b6e3f] font-bold">{recipe.macros.protein}g P</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#a06822] font-bold">{recipe.macros.carbs}g CH</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#a64e52] font-bold">{recipe.macros.fat}g G</span>
            </div>

            {/* Toggle ingredients */}
            <button
              onClick={() => setShowIngredients(!showIngredients)}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-[#c26546] font-semibold transition-colors"
            >
              <span>{showIngredients ? 'Ocultar' : 'Ingredientes'}</span>
              {showIngredients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable ingredients list */}
          {showIngredients && (
            <div className="mt-3 pt-3 border-t border-dashed border-stone-200">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c26546]" />
                  Ingredientes para {activeMembersCount} personas:
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Mercadona / Aldi</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {recipe.ingredients.map((ing, idx) => {
                  const scaledQty = (ing.quantity || 1) * activeMembersCount;
                  return (
                    <li key={idx} className="flex items-baseline justify-between py-0.5 border-b border-stone-50">
                      <span className="font-medium text-stone-700">{ing.name}</span>
                      <span className="text-stone-500 text-[11px]">
                        {scaledQty} {ing.unit} {ing.supermarket_ref ? `(${ing.supermarket_ref})` : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Enlace directo a la receta y elaboración paso a paso */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-stone-500 font-medium">¿Cómo prepararlo?</span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent('receta paso a paso ' + recipe.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors border border-stone-200"
                    title="Ver elaboración paso a paso en la web"
                  >
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                    <span>Pasos Web</span>
                  </a>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ' + recipe.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors border border-red-200"
                    title="Ver receta en vídeo en YouTube"
                  >
                    <Play className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                    <span>Vídeo</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de selección y búsqueda de ensaladas */}
      <SwapSaladModal
        isOpen={isSaladModalOpen}
        onClose={() => setIsSaladModalOpen(false)}
        day={day}
        mealType={mealType}
        currentSalad={saladSide}
      />
    </>
  );
};
