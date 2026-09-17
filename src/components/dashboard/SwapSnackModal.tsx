import React, { useState, useMemo } from 'react';
import type { DayOfWeek, QuickSnack } from '../../types';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { generateSingleSnackWithGemini } from '../../services/geminiService';
import {
  X,
  Check,
  Search,
  Sparkles,
  Clock,
  Bot,
  Star,
  RefreshCw,
  SmilePlus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface SwapSnackModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  currentSnack: QuickSnack | null;
}

type FilterChip =
  | 'todas'
  | 'sugerencias'
  | 'ia'
  | 'crujiente'
  | 'fruta_lacteo'
  | 'salado_encurtido'
  | 'frutos_secos';

export const SwapSnackModal: React.FC<SwapSnackModalProps> = ({
  isOpen,
  onClose,
  day,
  currentSnack,
}) => {
  const { allSnacks, swapSnack, addSnackToCatalog, customSnacks } = useFamilyMenu();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('todas');
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Estado para generación de snack con IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSnack, setAiSnack] = useState<QuickSnack | null>(null);
  const [saveToCatalog, setSaveToCatalog] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // 3 sugerencias inmediatas diferentes al snack actual
  const quickAlternatives = useMemo(() => {
    return allSnacks.filter((s) => s.id !== currentSnack?.id).slice(0, 3);
  }, [allSnacks, currentSnack]);

  const quickAlternativeIds = useMemo(() => {
    return new Set(quickAlternatives.map((s) => s.id));
  }, [quickAlternatives]);

  const customSnackIds = useMemo(() => {
    return new Set(customSnacks.map((s) => s.id));
  }, [customSnacks]);

  const filteredSnacks = useMemo(() => {
    return allSnacks.filter((snack) => {
      // Excluir snack actual
      if (currentSnack && snack.id === currentSnack.id) return false;

      // Filtros rápidos
      if (activeFilter === 'sugerencias') {
        if (!quickAlternativeIds.has(snack.id)) return false;
      } else if (activeFilter === 'ia') {
        const isAi = customSnackIds.has(snack.id) || snack.id.startsWith('ai-');
        if (!isAi) return false;
      } else if (activeFilter !== 'todas') {
        if (snack.category !== activeFilter) return false;
      }

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = snack.name.toLowerCase().includes(q);
        const matchDesc = snack.description.toLowerCase().includes(q);
        const matchIng = snack.ingredients.some(
          (i) => i.name.toLowerCase().includes(q) || (i.supermarket_ref && i.supermarket_ref.toLowerCase().includes(q))
        );
        return matchTitle || matchDesc || matchIng;
      }

      return true;
    }).sort((a, b) => {
      // Priorizar sugerencias de hoy y creaciones con IA
      if (activeFilter === 'todas' && !searchQuery.trim()) {
        const aSug = quickAlternativeIds.has(a.id) ? 1 : 0;
        const bSug = quickAlternativeIds.has(b.id) ? 1 : 0;
        if (aSug !== bSug) return bSug - aSug;

        const aAi = (customSnackIds.has(a.id) || a.id.startsWith('ai-')) ? 1 : 0;
        const bAi = (customSnackIds.has(b.id) || b.id.startsWith('ai-')) ? 1 : 0;
        if (aAi !== bAi) return bAi - aAi;
      }
      return 0;
    });
  }, [allSnacks, currentSnack, activeFilter, searchQuery, quickAlternativeIds, customSnackIds]);

  if (!isOpen) return null;

  const handleSelectSnack = (snack: QuickSnack, shouldSaveToCatalog = false) => {
    if (shouldSaveToCatalog) {
      addSnackToCatalog(snack);
    }
    swapSnack(day, snack);
    onClose();
  };

  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    setAiFeedback(null);
    try {
      const res = await generateSingleSnackWithGemini(aiPrompt);
      if (res.success && res.snack) {
        setAiSnack(res.snack);
        setSaveToCatalog(false); // Desmarcado por defecto según requisito
        setAiFeedback(res.message);
      } else {
        setAiFeedback(res.message || 'No se pudo generar el snack.');
      }
    } catch (err: any) {
      setAiFeedback(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiSnacksCount = allSnacks.filter(
    (s) => customSnackIds.has(s.id) || s.id.startsWith('ai-')
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#faf7f2] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-amber-950/10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/90 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <SmilePlus className="w-3.5 h-3.5 text-amber-700" />
              <span>Snack Saciante Sin Cocinar (0-2 min)</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mt-0.5">
              Alternativas de Snack para el {day}
            </h2>
            <p className="text-xs text-stone-500">
              Actual: <span className="font-semibold text-stone-700">{currentSnack?.name || 'Snack sugerido'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: en móvil se unifica el scroll para que el snack de IA nunca se corte; en escritorio se conserva la barra superior fija y el listado con scroll propio */}
        <div className="flex-1 overflow-y-auto min-h-0 sm:overflow-hidden sm:flex sm:flex-col divide-y sm:divide-y-0 divide-amber-950/5">
          {/* Top Action Bar: Search + Toggle AI */}
          <div className="p-3 sm:p-4 bg-white/60 sm:border-b sm:border-amber-950/5 space-y-3 sm:shrink-0">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar snack o ingrediente (ej. almendras, queso batido, piparras, pistachos...)"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-800 placeholder:text-stone-400 shadow-2xs"
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
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/80'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inventar con IA</span>
              <span className="sm:hidden">IA</span>
              {showAiDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* AI Drawer for Snacks */}
          {showAiDrawer && (
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>¿Qué snack te apetece para merendar o picar?</span>
                </div>
                <span className="text-[10px] text-amber-800/80 font-medium">Google Gemini</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: Snack dulce saludable con chocolate negro al 85% y crema de cacahuete..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-stone-800"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateAI();
                  }}
                />
                <button
                  onClick={handleGenerateAI}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
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
                <p className="text-[11px] text-amber-900/80 italic">{aiFeedback}</p>
              )}

              {/* Generated Snack Proposal Card */}
              {aiSnack && (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs space-y-3 sm:max-h-[52vh] sm:overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none">{aiSnack.emoji || '🍿'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          Propuesta Gemini IA
                        </span>
                        <span className="text-[11px] text-stone-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          0-1 min
                        </span>
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mt-1">
                        {aiSnack.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {aiSnack.description}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-700 block mb-1">
                      Ingredientes listos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSnack.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-stone-50 border border-stone-200/60 text-stone-700 px-2 py-0.5 rounded-lg"
                        >
                          {ing.name} ({ing.quantity} {ing.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 🔗 Enlace de referencia y elaboración */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ver elaboración y combinaciones:</span>
                    </div>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent('receta snack ' + aiSnack.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors border border-stone-200"
                      title="Ver preparación, combinaciones y consejos en Google"
                    >
                      <ExternalLink className="w-3 h-3 text-stone-500" />
                      <span>Ver preparación y pasos</span>
                    </a>
                  </div>

                  {/* User Opt-In Checkbox */}
                  <div className="pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 p-2.5 rounded-xl">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveToCatalog}
                        onChange={(e) => setSaveToCatalog(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-700 focus:ring-amber-700"
                      />
                      <span className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${saveToCatalog ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                        Guardar también en mi catálogo de snacks permanentes
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
                        onClick={() => handleSelectSnack(aiSnack, saveToCatalog)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir este snack</span>
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
              onClick={() => setActiveFilter('todas')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'todas'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] opacity-75">({allSnacks.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('sugerencias')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'sugerencias'
                  ? 'bg-amber-800 text-white shadow-2xs'
                  : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100/70'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Sugerencias rápidas</span>
              <span className="text-[10px] opacity-75">({quickAlternatives.length})</span>
            </button>

            {aiSnacksCount > 0 && (
              <button
                onClick={() => setActiveFilter('ia')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'ia'
                    ? 'bg-purple-800 text-white shadow-2xs'
                    : 'bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>Creados con IA</span>
                <span className="text-[10px] opacity-75">({aiSnacksCount})</span>
              </button>
            )}

            <span className="w-px h-4 bg-stone-300 mx-1 shrink-0" />

            <button
              onClick={() => setActiveFilter('frutos_secos')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'frutos_secos'
                  ? 'bg-amber-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥜 Frutos Secos
            </button>

            <button
              onClick={() => setActiveFilter('fruta_lacteo')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'fruta_lacteo'
                  ? 'bg-rose-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🍓 Fruta & Lácteo
            </button>

            <button
              onClick={() => setActiveFilter('crujiente')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'crujiente'
                  ? 'bg-amber-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🥖 Crujiente & Tostas
            </button>

            <button
              onClick={() => setActiveFilter('salado_encurtido')}
              className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'salado_encurtido'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🫒 Salado & Encurtidos
            </button>
          </div>
        </div>

        {/* Unified List of Snacks */}
        <div className="p-3 sm:p-5 space-y-3 sm:overflow-y-auto sm:flex-1">
          {filteredSnacks.length === 0 ? (
            <div className="text-center py-10 bg-white/80 rounded-2xl border border-dashed border-stone-200">
              <p className="text-sm font-bold text-stone-700">No encontramos snacks con ese filtro</p>
              <p className="text-xs text-stone-400 mt-1">
                Prueba con otro término o pide a la IA que invente un snack a tu gusto arriba.
              </p>
            </div>
          ) : (
            filteredSnacks.map((snack) => {
              const isSuggested = quickAlternativeIds.has(snack.id);
              const isAiCustom = customSnackIds.has(snack.id) || snack.id.startsWith('ai-');

              return (
                <div
                  key={snack.id}
                  className={`group p-3.5 sm:p-4 rounded-2xl bg-white/95 border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                    isSuggested
                      ? 'border-amber-400/80 bg-gradient-to-r from-white via-amber-50/25 to-white hover:border-amber-600'
                      : isAiCustom
                      ? 'border-purple-200 bg-gradient-to-r from-white via-purple-50/20 to-white hover:border-purple-400'
                      : 'border-amber-950/10 hover:border-amber-600/40 hover:bg-[#fffdfa]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl select-none filter drop-shadow-xs shrink-0 mt-0.5">
                      {snack.emoji || '🍿'}
                    </span>
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSuggested && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-amber-800 px-2 py-0.5 rounded-full shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5" /> Sugerido para hoy
                          </span>
                        )}
                        {isAiCustom && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                            <Bot className="w-2.5 h-2.5" /> Creado con IA
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {snack.category.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3" /> 0-2 min
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug mt-1">
                        {snack.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {snack.description}
                      </p>

                      {/* Ingredients Pills */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {snack.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-50 border border-stone-200/60 text-stone-600 px-2 py-0.5 rounded-md"
                          >
                            {ing.name} ({ing.quantity} {ing.unit})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Select Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-amber-950/5 gap-2">
                    <span className="text-[11px] text-stone-400">
                      Listo al instante
                    </span>

                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('receta snack ' + snack.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200/80"
                        title="Ver preparación e ideas en la web"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                        <span>Ideas</span>
                      </a>
                      <button
                        onClick={() => handleSelectSnack(snack)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Elegir este snack</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white/80 border-t border-amber-950/5 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500">
            {filteredSnacks.length} opciones disponibles
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
          >
            Mantener snack actual
          </button>
        </div>
      </div>
    </div>
  );
};
