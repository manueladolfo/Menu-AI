import React, { useState } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { SwapSnackModal } from './SwapSnackModal';
import { Clock, RefreshCw, SmilePlus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import type { DayOfWeek } from '../../types';
import { DAYS_OF_WEEK } from '../../services/menuAlgorithm';

export const QuickSnacksSection: React.FC = () => {
  const { activeDay, getSnackForDay, weeklySnacks, setActiveDay } = useFamilyMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayOfWeek>(activeDay);
  const [showAllDays, setShowAllDays] = useState(false);

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
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-100">
            <button
              onClick={() => handleOpenSwapForDay(activeDay)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 active:scale-95 transition-all border border-amber-200/80 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cambiar Snack</span>
            </button>
          </div>
        </div>

        {/* Vista Expandible de la Semana Completa de Snacks */}
        {showAllDays && (
          <div className="pt-2 border-t border-amber-950/5 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                Planificación de snacks para toda la semana:
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                Sincronizados en la lista de compra
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {DAYS_OF_WEEK.map((d) => {
                const daySnack = weeklySnacks[d] || currentDailySnack;
                const isSelectedDay = d === activeDay;

                return (
                  <div
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelectedDay
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/50'
                        : 'bg-stone-50/70 border-stone-200/70 hover:bg-white hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl select-none">{daySnack.emoji}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase text-stone-400 block tracking-wider">
                          {d}
                        </span>
                        <h5 className="font-bold text-xs text-stone-800 truncate">
                          {daySnack.name}
                        </h5>
                        <span className="text-[10px] text-stone-500">
                          {daySnack.prepTime} • {daySnack.calories} kcal
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSwapForDay(d);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-800 hover:bg-amber-100/60 transition-colors shrink-0"
                      title={`Cambiar snack para el ${d}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
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
