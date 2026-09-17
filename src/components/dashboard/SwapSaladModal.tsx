import React, { useState, useMemo } from 'react';
import type { DayOfWeek, MealType, FreshSaladSide } from '../../types';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { getMealSaladSide } from '../../services/menuAlgorithm';
import { generateSingleSaladWithGemini } from '../../services/geminiService';
import {
  X,
  Check,
  Search,
  Sparkles,
  Shuffle,
  Leaf,
  Bot,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Play,
} from 'lucide-react';

interface SwapSaladModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  mealType: MealType;
  currentSalad: FreshSaladSide | null;
}

type CategoryFilter =
  | 'todas'
  | 'sugeridas'
  | 'ia'
  | 'tomate_caprese'
  | 'cesar_verdes'
  | 'con_queso'
  | 'ligeras_digestivas'
  | 'campera';

export const SwapSaladModal: React.FC<SwapSaladModalProps> = ({
  isOpen,
  onClose,
  day,
  mealType,
  currentSalad,
}) => {
  const { allSalads, swapSalad, addSaladToCatalog, customSalads } = useFamilyMenu();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('todas');
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Estado para generación de ensaladas con IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSalad, setAiSalad] = useState<FreshSaladSide | null>(null);
  const [saveToCatalog, setSaveToCatalog] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Ensalada recomendada por el algoritmo de rotación para este slot
  const defaultSuggestedSalad = useMemo(() => {
    return getMealSaladSide(day, mealType);
  }, [day, mealType]);

  const customSaladIds = useMemo(() => {
    return new Set(customSalads.map((s) => s.id));
  }, [customSalads]);

  const filteredSalads = useMemo(() => {
    return allSalads.filter((salad) => {
      // 1. Filtros rápidos
      if (selectedFilter === 'sugeridas') {
        if (salad.id !== defaultSuggestedSalad.id) return false;
      } else if (selectedFilter === 'ia') {
        const isAi = customSaladIds.has(salad.id) || salad.id.startsWith('ai-');
        if (!isAi) return false;
      } else if (selectedFilter === 'tomate_caprese') {
        const isMatch =
          salad.name.toLowerCase().includes('tomate') ||
          salad.name.toLowerCase().includes('caprese') ||
          salad.name.toLowerCase().includes('kumato') ||
          salad.name.toLowerCase().includes('salmorejo');
        if (!isMatch) return false;
      } else if (selectedFilter === 'cesar_verdes') {
        const isMatch =
          salad.name.toLowerCase().includes('césar') ||
          salad.name.toLowerCase().includes('cesar') ||
          salad.name.toLowerCase().includes('cogollos') ||
          salad.name.toLowerCase().includes('rúcula') ||
          salad.name.toLowerCase().includes('canónigos') ||
          salad.name.toLowerCase().includes('brotes');
        if (!isMatch) return false;
      } else if (selectedFilter === 'con_queso') {
        const isMatch =
          salad.name.toLowerCase().includes('mozzarella') ||
          salad.name.toLowerCase().includes('feta') ||
          salad.name.toLowerCase().includes('parmesano') ||
          salad.name.toLowerCase().includes('cabra') ||
          salad.name.toLowerCase().includes('burgos') ||
          salad.ingredients.some((i) => i.category === 'lacteos_huevos');
        if (!isMatch) return false;
      } else if (selectedFilter === 'ligeras_digestivas') {
        const isMatch =
          salad.name.toLowerCase().includes('pipirrana') ||
          salad.name.toLowerCase().includes('calabacín') ||
          salad.name.toLowerCase().includes('zanahoria') ||
          salad.name.toLowerCase().includes('remolacha');
        if (!isMatch) return false;
      } else if (selectedFilter === 'campera') {
        const isMatch =
          salad.name.toLowerCase().includes('campera') ||
          salad.name.toLowerCase().includes('mixta') ||
          salad.name.toLowerCase().includes('patata');
        if (!isMatch) return false;
      }

      // 2. Búsqueda por texto o ingrediente
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = salad.name.toLowerCase().includes(q);
        const matchDesc = salad.description.toLowerCase().includes(q);
        const matchIngredient = salad.ingredients.some(
          (i) => i.name.toLowerCase().includes(q) || (i.supermarket_ref && i.supermarket_ref.toLowerCase().includes(q))
        );
        return matchTitle || matchDesc || matchIngredient;
      }

      return true;
    }).sort((a, b) => {
      // Priorizar ensalada sugerida de hoy al ver "todas"
      if (selectedFilter === 'todas' && !searchQuery.trim()) {
        const aSug = a.id === defaultSuggestedSalad.id ? 1 : 0;
        const bSug = b.id === defaultSuggestedSalad.id ? 1 : 0;
        if (aSug !== bSug) return bSug - aSug;

        const aAi = (customSaladIds.has(a.id) || a.id.startsWith('ai-')) ? 1 : 0;
        const bAi = (customSaladIds.has(b.id) || b.id.startsWith('ai-')) ? 1 : 0;
        if (aAi !== bAi) return bAi - aAi;
      }
      return 0;
    });
  }, [allSalads, selectedFilter, searchQuery, defaultSuggestedSalad, customSaladIds]);

  if (!isOpen) return null;

  const handleSelectSalad = (salad: FreshSaladSide, shouldSaveToCatalog = false) => {
    if (shouldSaveToCatalog) {
      addSaladToCatalog(salad);
    }
    swapSalad(day, mealType, salad);
    onClose();
  };

  const handleRandomSurprise = () => {
    if (allSalads.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allSalads.length);
    handleSelectSalad(allSalads[randomIndex], false);
  };

  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    setAiFeedback(null);
    try {
      const res = await generateSingleSaladWithGemini(aiPrompt);
      if (res.success && res.salad) {
        setAiSalad(res.salad);
        setSaveToCatalog(false); // Desmarcado por defecto según requisito
        setAiFeedback(res.message);
      } else {
        setAiFeedback(res.message || 'No se pudo generar la ensalada.');
      }
    } catch (err: any) {
      setAiFeedback(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiSaladsCount = allSalads.filter(
    (s) => customSaladIds.has(s.id) || s.id.startsWith('ai-')
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#faf7f2] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-amber-950/10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/90">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3b6e3f]">
              <Leaf className="w-3.5 h-3.5 text-[#3b6e3f]" />
              <span>Acompañamiento Fresco Diario Obligatorio</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mt-0.5">
              Ensalada para el {day} ({mealType})
            </h2>
            <p className="text-xs text-stone-500">
              Actual: <span className="font-semibold text-stone-700">{currentSalad?.name || 'Ensalada de temporada'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Bar: Search + Toggle AI + Surprise */}
        <div className="p-3 sm:p-4 bg-white/60 border-b border-amber-950/5 space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o ingrediente (ej. César, anchoas, pesto, feta, aguacate...)"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-[#3b6e3f]/30 text-stone-800 placeholder:text-stone-400 shadow-2xs"
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
                  ? 'bg-[#3b6e3f] text-white border-[#3b6e3f]'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/80'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inventar con IA</span>
              <span className="sm:hidden">IA</span>
              {showAiDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleRandomSurprise}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all shrink-0 border border-stone-200/80"
              title="Elegir una ensalada sorpresa"
            >
              <Shuffle className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Sorpresa</span>
            </button>
          </div>

          {/* AI Drawer for Salads */}
          {showAiDrawer && (
            <div className="bg-gradient-to-br from-emerald-50/90 to-amber-50/50 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>¿Qué ingredientes frescos te apetecen en tu ensalada?</span>
                </div>
                <span className="text-[10px] text-emerald-700/80 font-medium">Google Gemini</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: Ensalada templada con queso de cabra caramelizado, nueces y vinagreta de Módena..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-stone-800"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateAI();
                  }}
                />
                <button
                  onClick={handleGenerateAI}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3b6e3f] hover:bg-[#325c35] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
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
                <p className="text-[11px] text-emerald-800/80 italic">{aiFeedback}</p>
              )}

              {/* Generated Salad Proposal Card */}
              {aiSalad && (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none">{aiSalad.emoji || '🥗'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Propuesta Gemini IA
                        </span>
                        <span className="text-[11px] text-stone-400">0 min cocinado</span>
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mt-1">
                        {aiSalad.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {aiSalad.description}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-700 block mb-1">
                      Ingredientes frescos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSalad.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-stone-50 border border-stone-200/60 text-stone-700 px-2 py-0.5 rounded-lg"
                        >
                          {ing.name} ({ing.quantity} {ing.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 🔗 Enlace de referencia y aliño/elaboración */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
                      <BookOpen className="w-3.5 h-3.5 text-[#3b6e3f]" />
                      <span>Ver receta y aliño:</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta aliño ' + aiSalad.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors border border-stone-200"
                        title="Ver receta, aliños y elaboración en Google"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                        <span>Receta y aliño</span>
                      </a>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ensalada ' + aiSalad.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors border border-red-200"
                        title="Ver preparación en YouTube"
                      >
                        <Play className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                        <span>Vídeo</span>
                      </a>
                    </div>
                  </div>

                  {/* User Opt-In Checkbox */}
                  <div className="pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 p-2.5 rounded-xl">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveToCatalog}
                        onChange={(e) => setSaveToCatalog(e.target.checked)}
                        className="w-4 h-4 rounded text-[#3b6e3f] focus:ring-[#3b6e3f]"
                      />
                      <span className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${saveToCatalog ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                        Guardar también en mi catálogo de ensaladas permanentes
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateAI}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors"
                      >
                        Otra idea
                      </button>
                      <button
                        onClick={() => handleSelectSalad(aiSalad, saveToCatalog)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b6e3f] hover:bg-[#325c35] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir esta ensalada</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedFilter('todas')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === 'todas'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>Todas</span>
              <span className="text-[10px] opacity-75">({allSalads.length})</span>
            </button>

            <button
              onClick={() => setSelectedFilter('sugeridas')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === 'sugeridas'
                  ? 'bg-[#3b6e3f] text-white shadow-2xs'
                  : 'bg-emerald-50 border border-emerald-200 text-[#3b6e3f] hover:bg-emerald-100/70'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Sugerida de hoy</span>
            </button>

            {aiSaladsCount > 0 && (
              <button
                onClick={() => setSelectedFilter('ia')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedFilter === 'ia'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>Creadas con IA</span>
                <span className="text-[10px] opacity-75">({aiSaladsCount})</span>
              </button>
            )}

            <span className="w-px h-4 bg-stone-300 mx-1 shrink-0" />

            <button
              onClick={() => setSelectedFilter('tomate_caprese')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'tomate_caprese'
                  ? 'bg-rose-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍅 Tomate & Caprese
            </button>

            <button
              onClick={() => setSelectedFilter('cesar_verdes')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'cesar_verdes'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥗 César & Brotes
            </button>

            <button
              onClick={() => setSelectedFilter('con_queso')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'con_queso'
                  ? 'bg-amber-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🧀 Con Queso
            </button>

            <button
              onClick={() => setSelectedFilter('ligeras_digestivas')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'ligeras_digestivas'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥒 Ligeras
            </button>

            <button
              onClick={() => setSelectedFilter('campera')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'campera'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥔 Campera & Mixta
            </button>
          </div>
        </div>

        {/* Unified List of Salads */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredSalads.length === 0 ? (
            <div className="text-center py-10 bg-white/80 rounded-2xl border border-dashed border-stone-200">
              <p className="text-sm font-bold text-stone-700">No encontramos ensaladas con ese filtro</p>
              <p className="text-xs text-stone-400 mt-1">
                Prueba con otro término o pide a Gemini que invente una ensalada fresca a tu gusto arriba.
              </p>
            </div>
          ) : (
            filteredSalads.map((salad) => {
              const isSuggested = salad.id === defaultSuggestedSalad.id;
              const isAiCustom = customSaladIds.has(salad.id) || salad.id.startsWith('ai-');

              return (
                <div
                  key={salad.id}
                  className={`group p-3.5 sm:p-4 rounded-2xl bg-white/95 border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                    isSuggested
                      ? 'border-emerald-500/80 bg-gradient-to-r from-white via-emerald-50/20 to-white hover:border-[#3b6e3f]'
                      : isAiCustom
                      ? 'border-purple-200 bg-gradient-to-r from-white via-purple-50/20 to-white hover:border-purple-400'
                      : 'border-amber-950/10 hover:border-[#3b6e3f]/40 hover:bg-[#fffdfa]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none filter drop-shadow-xs shrink-0 mt-0.5">
                      {salad.emoji || '🥗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSuggested && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#3b6e3f] px-2 py-0.5 rounded-full shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5" /> Sugerida para hoy
                          </span>
                        )}
                        {isAiCustom && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                            <Bot className="w-2.5 h-2.5" /> Creada con IA
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                          Sin cocinar (0 min)
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug mt-1">
                        {salad.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {salad.description}
                      </p>

                      {/* Ingredients Pills */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {salad.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-50 border border-stone-200/60 text-stone-600 px-2 py-0.5 rounded-md"
                          >
                            {ing.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Select Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-amber-950/5 gap-2">
                    <span className="text-[11px] text-stone-400">
                      {salad.ingredients.length} ingredientes frescos
                    </span>

                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta aliño ' + salad.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200/80"
                        title="Ver receta y aliños en la web"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                        <span>Elaboración</span>
                      </a>
                      <button
                        onClick={() => handleSelectSalad(salad)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3b6e3f] hover:bg-[#325c35] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir esta ensalada</span>
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
            {filteredSalads.length} ensaladas disponibles
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
          >
            Mantener ensalada actual
          </button>
        </div>
      </div>
    </div>
  );
};
