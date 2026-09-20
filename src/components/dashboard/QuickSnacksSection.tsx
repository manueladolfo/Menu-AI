import React, { useState } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { SwapSnackModal } from './SwapSnackModal';
import { Clock, RefreshCw, SmilePlus, ChevronDown, ChevronUp, ShoppingBag, ExternalLink, Play, BookOpen, EyeOff, Plus } from 'lucide-react';
import type { DayOfWeek } from '../../types';
import { DAYS_OF_WEEK } from '../../services/menuAlgorithm';

export const QuickSnacksSection: React.FC = () => {
  const { activeDay, getSnackForDay, weeklySnacks, setActiveDay, isSlotOmitted, toggleOmitSlot } = useFamilyMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayOfWeek>(activeDay);
  const [showAllDays, setShowAllDays] = useState(false);

  // Comprobar si el snack de hoy está omitido
  const isSnackOmitted = isSlotOmitted(activeDay, 'snack');

  // Snack sugerido para el día activo actualmente seleccionado
  const currentDailySnack = getSnackForDay(activeDay);

  const handleOpenSwapForDay = (day: DayOfWeek) => {
    setModalDay(day);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-950/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold">
              <SmilePlus className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 text-base">
                  Snack Saciante del Día ({activeDay})
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {currentDailySnack.prepTime}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Sugerencia ligera sin cocinar para matar el hambre entre horas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200/70 transition-colors"
            >
              <span>{showAllDays ? 'Ocultar resto de semana' : 'Ver semana completa'}</span>
              {showAllDays ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Snack Destacado del Día Activo */}
        {isSnackOmitted ? (
          <div className="p-4 rounded-2xl bg-stone-50/90 border-2 border-dashed border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none opacity-40">🍿</span>
              <div>
                <h4 className="font-bold text-stone-700 text-sm">
                  Sin snack planificado para hoy ({activeDay})
                </h4>
                <p className="text-xs text-stone-500">
                  Día de comida tardía, menú contundente o ayuno. Sus ingredientes no se sumarán a la lista de compra.
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleOmitSlot(activeDay, 'snack')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Reactivar snack</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <span className="text-3xl sm:text-4xl select-none filter drop-shadow-xs">
                {currentDailySnack.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded-full border border-stone-200/60 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-stone-400" />
                    {currentDailySnack.prepTime}
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    ~{currentDailySnack.calories} kcal
                  </span>
                  <span className="text-[11px] text-[#3b6e3f] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    Súper: Mercadona / Aldi
                  </span>
                </div>
                <h4 className="font-extrabold text-stone-900 text-base mt-1 leading-snug">
                  {currentDailySnack.name}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  {currentDailySnack.description}
                </p>

                {/* Ingredientes chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentDailySnack.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white border border-stone-200/70 text-stone-700 px-2 py-0.5 rounded-lg"
                    >
                      {ing.name} ({ing.quantity} {ing.unit})
                    </span>
                  ))}
                </div>

                {/* Paso a paso del Snack destacado */}
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-amber-900 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    ¿Cómo prepararlo?
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent('receta snack ' + currentDailySnack.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold transition-colors border border-stone-200"
                      title="Ver elaboración e ideas en Google"
                    >
                      <ExternalLink className="w-3 h-3 text-stone-500" />
                      <span>Pasos Web</span>
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta snack ' + currentDailySnack.name)}`}
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
              </div>
            </div>

            {/* Action buttons: Omitir & Cambiar */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-100">
              <button
                onClick={() => toggleOmitSlot(activeDay, 'snack')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200/70 transition-all border border-stone-200/80 shadow-2xs"
                title="Omitir snack de hoy"
              >
                <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                <span>Omitir</span>
              </button>

              <button
                onClick={() => handleOpenSwapForDay(activeDay)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 active:scale-95 transition-all border border-amber-200/80 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cambiar Snack</span>
              </button>
            </div>
          </div>
        )}

        {/* Vista Expandible de la Semana Completa de Snacks */}
        {showAllDays && (
          <div className="pt-2 border-t border-amber-950/5 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                Planificación de snacks para toda la semana:
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                Con ingredientes y paso a paso incluidos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DAYS_OF_WEEK.map((d) => {
                const daySnack = weeklySnacks[d] || currentDailySnack;
                const isSelectedDay = d === activeDay;

                return (
                  <div
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelectedDay
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/50 shadow-2xs'
                        : 'bg-stone-50/70 border-stone-200/70 hover:bg-white hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-2xl select-none shrink-0 mt-0.5">{daySnack.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">
                            {d}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            {daySnack.prepTime} • ~{daySnack.calories} kcal
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-stone-800 leading-snug mt-0.5">
                          {daySnack.name}
                        </h5>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {daySnack.description}
                        </p>

                        {/* Ingredientes del snack de cada día */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {daySnack.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-stone-200/80 text-stone-600 px-1.5 py-0.5 rounded-md"
                            >
                              {ing.name} ({ing.quantity} {ing.unit})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Paso a paso y botón cambiar */}
                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent('receta snack ' + daySnack.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200"
                          title="Ver en Google"
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                          <span>Pasos Web</span>
                        </a>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta snack ' + daySnack.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-semibold border border-red-200"
                          title="Ver en YouTube"
                        >
                          <Play className="w-2 h-2 fill-red-600 text-red-600" />
                          <span>Vídeo</span>
                        </a>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSwapForDay(d);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 transition-colors shrink-0"
                        title={`Cambiar snack para el ${d}`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Cambiar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal para cambiar snack con sugerencias, catálogo o IA */}
      <SwapSnackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={modalDay}
        currentSnack={getSnackForDay(modalDay)}
      />
    </>
  );
};
