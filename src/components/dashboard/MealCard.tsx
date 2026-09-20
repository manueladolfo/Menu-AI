import React, { useState } from 'react';
import type { DayOfWeek, MealType, Recipe } from '../../types';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { SwapSaladModal } from './SwapSaladModal';
import { Clock, RefreshCw, Flame, ChevronDown, ChevronUp, Leaf, ExternalLink, Play, EyeOff, Plus, ChefHat, Heart } from 'lucide-react';

interface MealCardProps {
  day: DayOfWeek;
  mealType: MealType;
  recipe: Recipe;
  onOpenSwap: (recipe: Recipe, mealType: MealType) => void;
}

const TYPE_COLORS: Record<string, string> = {
  legumbre: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  pescado: 'bg-cyan-50 text-cyan-900 border-cyan-200',
  carne: 'bg-rose-50 text-rose-900 border-rose-200',
  pasta: 'bg-amber-50 text-amber-900 border-amber-200',
  ensalada: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  verdura: 'bg-lime-50 text-lime-900 border-lime-200',
  huevos: 'bg-amber-50 text-amber-900 border-amber-200',
  guiso: 'bg-purple-50 text-purple-900 border-purple-200',
  sopa: 'bg-teal-50 text-teal-900 border-teal-200',
  fast_food: 'bg-orange-50 text-orange-900 border-orange-200',
  empanada: 'bg-amber-50 text-amber-900 border-amber-200',
  salsa: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
  embutido: 'bg-red-50 text-red-900 border-red-200 font-semibold',
};

function getIngredientEmoji(name: string, category?: string): string {
  const n = name.toLowerCase();
  if (n.includes('huevo')) return '🥚';
  if (n.includes('queso') || n.includes('parmesano') || n.includes('feta') || n.includes('mozzarella') || n.includes('leche') || n.includes('yogur') || n.includes('nata')) return '🧀';
  if (n.includes('pollo') || n.includes('pavo') || n.includes('alita') || n.includes('pechuga')) return '🍗';
  if (n.includes('ternera') || n.includes('cerdo') || n.includes('lomo') || n.includes('jamón') || n.includes('chorizo') || n.includes('cecina') || n.includes('chistorra') || n.includes('sobrasada') || n.includes('carne') || n.includes('hamburguesa')) return '🥩';
  if (n.includes('salmón') || n.includes('atún') || n.includes('bacalao') || n.includes('merluza') || n.includes('gamba') || n.includes('pescado') || n.includes('sepia') || n.includes('lubina') || n.includes('dorada') || n.includes('calamar') || n.includes('langostino')) return '🐟';
  if (n.includes('tomate')) return '🍅';
  if (n.includes('aguacate')) return '🥑';
  if (n.includes('cebolla') || n.includes('cebolleta')) return '🧅';
  if (n.includes('ajo')) return '🧄';
  if (n.includes('zanahoria')) return '🥕';
  if (n.includes('patata')) return '🥔';
  if (n.includes('seta') || n.includes('champiñón')) return '🍄';
  if (n.includes('limón')) return '🍋';
  if (n.includes('manzana')) return '🍎';
  if (n.includes('pimiento') || n.includes('calabacín') || n.includes('berenjena') || n.includes('espinaca') || n.includes('acelga') || n.includes('brócoli') || n.includes('lechuga') || n.includes('canónigo') || n.includes('rúcula') || n.includes('pepino')) return '🥦';
  if (n.includes('arroz') || n.includes('pasta') || n.includes('espagueti') || n.includes('macarrón') || n.includes('fideo') || n.includes('pan') || n.includes('harina') || n.includes('masa')) return '🌾';
  if (n.includes('lenteja') || n.includes('garbanzo') || n.includes('alubia')) return '🍲';
  if (n.includes('aceite') || n.includes('aove') || n.includes('oliva') || n.includes('vinagre')) return '🫒';
  if (n.includes('sal') || n.includes('pimienta') || n.includes('orégano') || n.includes('laurel') || n.includes('pimentón') || n.includes('comino') || n.includes('perejil') || n.includes('especia') || n.includes('tomillo')) return '🧂';
  if (n.includes('nuez') || n.includes('almendra') || n.includes('cacahuete') || n.includes('semilla') || n.includes('piñón')) return '🥜';

  switch (category) {
    case 'carniceria_pescaderia': return '🥩';
    case 'frescos_verdura': return '🥦';
    case 'lacteos_huevos': return '🧀';
    case 'despensa_legumbres': return '🌾';
    case 'especias_aceites': return '🫒';
    case 'congelados': return '❄️';
    default: return '🛒';
  }
}

const MEAL_THEMES = {
  almuerzo: {
    cardBg: 'bg-[#fcf9f5]',
    cardBorder: 'border-2 border-[#e6d5c5] hover:border-[#dbc5b2]',
    badge: 'bg-amber-100/90 text-amber-950 border border-amber-300/80',
    ingredientsCard: 'bg-[#fcf9f5] border-2 border-[#e6d5c5]',
    ingredientsDivider: 'border-[#ebdcd0]',
    tag: 'bg-amber-100 text-amber-900 border border-amber-300/80',
    tagText: 'PLATO PRINCIPAL ALMUERZO',
    pill: 'bg-white text-amber-950 border border-[#e2d0c2]',
    itemCard: 'bg-white/95 border border-[#ebdcd0] hover:border-[#dbc5b2]',
    stepsIcon: 'text-[#c26546]',
    stepsWebBtn: 'bg-white hover:bg-amber-50/60 text-stone-700 border border-[#e2d0c2]',
  },
  cena: {
    cardBg: 'bg-[#f5f8fc]',
    cardBorder: 'border-2 border-[#ccdcee] hover:border-[#b7cde6]',
    badge: 'bg-indigo-100/90 text-indigo-950 border border-indigo-200',
    ingredientsCard: 'bg-[#f5f8fc] border-2 border-[#ccdcee]',
    ingredientsDivider: 'border-[#d7e4f3]',
    tag: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
    tagText: 'PLATO PRINCIPAL CENA',
    pill: 'bg-white text-indigo-950 border border-[#c5d7ec]',
    itemCard: 'bg-white/95 border border-[#d7e4f3] hover:border-[#b7cde6]',
    stepsIcon: 'text-indigo-600',
    stepsWebBtn: 'bg-white hover:bg-indigo-50/60 text-stone-700 border border-[#c5d7ec]',
  },
};

export const MealCard: React.FC<MealCardProps> = ({ day, mealType, recipe, onOpenSwap }) => {
  const theme = MEAL_THEMES[mealType];
  const [showIngredients, setShowIngredients] = useState(false);
  const [isSaladModalOpen, setIsSaladModalOpen] = useState(false);
  const { members, activeMembersCount, getSaladForMeal, isSlotOmitted, toggleOmitSlot } = useFamilyMenu();

  const isMealOmitted = isSlotOmitted(day, mealType);
  const isSaladOmitted = isSlotOmitted(day, 'ensalada');

  // Acompañamiento fresco diario SOLO en almuerzo (null para cenas)
  const saladSide = mealType === 'almuerzo' ? getSaladForMeal(day, mealType) : null;

  // Filtrar familiares activos que están a dieta
  const activeDietMembers = members.filter((m) => m.activeStatus && m.isOnDiet);

  // Si la comida está omitida (ej. menú contundente, comida tardía o ayuno)
  if (isMealOmitted) {
    return (
      <div className="bg-stone-50/90 rounded-3xl p-5 border-2 border-dashed border-stone-200 flex flex-col justify-between transition-all min-h-[200px]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full opacity-70 ${
                mealType === 'almuerzo'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-orange-100 text-orange-950 border border-orange-200'
              }`}
            >
              {mealType === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-600">
              Omitido
            </span>
          </div>

          <div className="text-center py-5 space-y-1.5">
            <span className="text-3xl block select-none opacity-40">
              {mealType === 'almuerzo' ? '🍽️' : '🌙'}
            </span>
            <h4 className="font-bold text-stone-700 text-sm sm:text-base">
              {mealType === 'almuerzo'
                ? 'Sin almuerzo planificado para hoy'
                : 'Sin cena planificada para hoy'}
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              {mealType === 'almuerzo'
                ? 'Comida tardía, fuera o menú contundente. Sus ingredientes no se incluirán en la compra ni sus calorías sumarán.'
                : '¿Comida tardía o menú de mediodía contundente? No se fija cena para hoy ni se suman sus calorías.'}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-stone-400 truncate">
            Plato asignado: {recipe.title}
          </span>
          <button
            onClick={() => toggleOmitSlot(day, mealType)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 transition-all border border-emerald-300 shadow-2xs cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Reactivar {mealType}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${theme.cardBg} ${theme.cardBorder} rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden`}>
        {/* Header: Meal type & Action buttons */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.badge}`}
              >
                {mealType === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}
              </span>

              {/* Distintivo Ensalada Fresca en Almuerzo */}
              {mealType === 'almuerzo' && !isSaladOmitted && (
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#10B981] text-white uppercase tracking-wider shadow-2xs">
                  🥗 Ensalada Fresca
                </span>
              )}

              {/* Batch cooking indicator badge */}
              {recipe.batch_cooking && (
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/60">
                  <Flame className="w-3 h-3 text-purple-600" />
                  Batch Cooking
                </span>
              )}

              {/* Weekend fast food / comfort badge */}
              {(recipe.type === 'fast_food' || recipe.type === 'empanada') && (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200/60">
                  🍔 Fin de Semana
                </span>
              )}
            </div>

            {/* Actions: Omitir & Hot-Swap */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleOmitSlot(day, mealType)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#E76F51] hover:bg-[#D65F41] active:scale-95 transition-all shadow-xs cursor-pointer"
                title={`Omitir ${mealType} de hoy (ej. por comida tardía o copiosa)`}
              >
                <EyeOff className="w-3.5 h-3.5 text-white/90" />
                <span>Omitir</span>
              </button>

              <button
                onClick={() => onOpenSwap(recipe, mealType)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all border border-slate-200/80 shadow-2xs"
                title="Intercambiar plato por otra alternativa equivalente o buscar en catálogo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambiar</span>
              </button>
            </div>
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

          {/* 🥗 Acompañamiento Fresco: SOLO en el almuerzo (nunca en la cena) */}
          {mealType === 'almuerzo' && (
            isSaladOmitted ? (
              <div className="mt-3 p-2.5 rounded-2xl bg-stone-50/90 border border-dashed border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none opacity-40">🥗</span>
                  <span className="text-xs text-stone-500 font-medium">
                    Ensalada de almuerzo omitida hoy
                  </span>
                </div>
                <button
                  onClick={() => toggleOmitSlot(day, 'ensalada')}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-300 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir ensalada</span>
                </button>
              </div>
            ) : saladSide ? (
              <div className="mt-3 p-3 rounded-2xl bg-[#f0f6f0] border border-[#d4e6d4] space-y-2.5">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className="text-2xl select-none shrink-0">{saladSide.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-extrabold text-[#3a633d] tracking-wider">
                          Ensalada del almuerzo:
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

                  {/* Acciones de ensalada: omitir y cambiar */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleOmitSlot(day, 'ensalada')}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors"
                      title="Omitir ensalada en este almuerzo"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsSaladModalOpen(true)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#2e5632] bg-white/90 hover:bg-white px-2.5 py-1.5 rounded-xl border border-[#c3dcc3] shadow-2xs transition-all active:scale-95"
                      title="Cambiar o buscar otra ensalada del catálogo para este almuerzo"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Cambiar</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null
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
            <div className="mt-3 p-3 rounded-2xl bg-[#edf7f5] border border-[#c2e7de] text-xs text-[#13574a]">
              <div className="flex items-center gap-1.5 font-bold text-[#13574a] mb-1">
                <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-100" />
                <span>Adaptación para dieta ({activeDietMembers.map((m) => m.name).join(', ')}):</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium opacity-95">
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
              <span>{showIngredients ? 'Ocultar' : 'Ingredientes y Pasos'}</span>
              {showIngredients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable ingredients & step-by-step list (Plato Principal y Ensalada) */}
          {showIngredients && (
            <div className="mt-3 pt-3 border-t border-dashed border-stone-200 space-y-4 animate-in fade-in duration-200">
              {/* Sección 1: Plato Principal (Sincronizado con su tarjeta de comida) */}
              <div className={`rounded-2xl p-3.5 sm:p-4 ${theme.ingredientsCard} shadow-2xs space-y-3`}>
                {/* Cabecera del plato principal */}
                <div className={`flex items-center justify-between gap-2 border-b ${theme.ingredientsDivider} pb-2.5`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-xl ${theme.badge} flex items-center justify-center text-lg shrink-0 shadow-2xs`}>
                      {recipe.emoji || (mealType === 'almuerzo' ? '☀️' : '🌙')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] uppercase font-extrabold ${theme.tag} px-2 py-0.5 rounded-md tracking-wider`}>
                          {theme.tagText}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-stone-700 border border-stone-200/80">
                          {activeMembersCount} {activeMembersCount === 1 ? 'ración' : 'raciones'}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate mt-0.5">
                        {recipe.title}
                      </h5>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium shrink-0 hidden xs:inline">
                    Mercadona / Aldi
                  </span>
                </div>

                {/* Lista de ingredientes en cápsulas visuales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {recipe.ingredients.map((ing, idx) => {
                    const scaledQty = (ing.quantity || 1) * activeMembersCount;
                    const emoji = getIngredientEmoji(ing.name, ing.category);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl ${theme.itemCard} transition-colors shadow-2xs`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base select-none shrink-0">{emoji}</span>
                          <span className="font-semibold text-xs text-stone-800 truncate" title={ing.name}>
                            {ing.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[11px] font-extrabold ${theme.pill} px-2 py-0.5 rounded-lg font-mono whitespace-nowrap shadow-2xs`}>
                            {scaledQty} {ing.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Elaboración paso a paso y vídeo */}
                <div className={`pt-2.5 border-t ${theme.ingredientsDivider} flex items-center justify-between gap-2 flex-wrap`}>
                  <span className="text-[11px] text-stone-700 font-bold flex items-center gap-1">
                    <ChefHat className={`w-3.5 h-3.5 ${theme.stepsIcon}`} />
                    <span>¿Cómo cocinar el plato?</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent('receta paso a paso ' + recipe.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${theme.stepsWebBtn} text-xs font-bold transition-all shadow-2xs active:scale-95`}
                      title="Ver elaboración detallada paso a paso en la web"
                    >
                      <ExternalLink className={`w-3.5 h-3.5 ${theme.stepsIcon}`} />
                      <span>Pasos Web</span>
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ' + recipe.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                      title="Ver vídeo receta en YouTube"
                    >
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span>Vídeo</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Sección 2: Ensalada Acompañamiento (solo si es almuerzo y no está omitida) */}
              {mealType === 'almuerzo' && !isSaladOmitted && saladSide && saladSide.ingredients && saladSide.ingredients.length > 0 && (
                <div className="rounded-2xl p-3.5 bg-gradient-to-br from-emerald-50/80 via-green-50/40 to-white border border-emerald-200/90 shadow-2xs space-y-3">
                  {/* Cabecera de la ensalada */}
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                        {saladSide.emoji || '🥗'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider">
                            Ensalada del Almuerzo
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900">
                            {activeMembersCount} {activeMembersCount === 1 ? 'ración' : 'raciones'}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {saladSide.name}
                        </h5>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium shrink-0 hidden xs:inline">
                      Mercadona / Aldi
                    </span>
                  </div>

                  {/* Lista de ingredientes de la ensalada en cápsulas visuales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {saladSide.ingredients.map((ing, idx) => {
                      const scaledQty = (ing.quantity || 1) * activeMembersCount;
                      const emoji = getIngredientEmoji(ing.name, ing.category);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/95 border border-emerald-100/90 hover:border-emerald-300 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base select-none shrink-0">{emoji}</span>
                            <span className="font-semibold text-xs text-stone-800 truncate" title={ing.name}>
                              {ing.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] font-extrabold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/70 font-mono whitespace-nowrap">
                              {scaledQty} {ing.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Elaboración paso a paso de la ensalada */}
                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-emerald-900 font-bold flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                      <span>¿Cómo preparar la ensalada?</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta ensalada paso a paso ' + saladSide.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/50 text-emerald-900 text-xs font-bold transition-all border border-emerald-200 shadow-2xs active:scale-95"
                        title="Ver preparación de la ensalada en la web"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pasos Web</span>
                      </a>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ensalada ' + saladSide.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                        title="Ver vídeo receta de la ensalada en YouTube"
                      >
                        <Play className="w-3 h-3 fill-white text-white" />
                        <span>Vídeo</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de selección y búsqueda de ensaladas (solo almuerzo) */}
      {mealType === 'almuerzo' && saladSide && (
        <SwapSaladModal
          isOpen={isSaladModalOpen}
          onClose={() => setIsSaladModalOpen(false)}
          day={day}
          mealType={mealType}
          currentSalad={saladSide}
        />
      )}
    </>
  );
};
