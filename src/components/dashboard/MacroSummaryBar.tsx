import React from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { Dumbbell, Wheat, Droplet, HeartHandshake } from 'lucide-react';

export const MacroSummaryBar: React.FC = () => {
  const { weeklyMeals, activeTargets, activeDay, isSlotOmitted } = useFamilyMenu();

  const isLunchOmitted = isSlotOmitted(activeDay, 'almuerzo');
  const isDinnerOmitted = isSlotOmitted(activeDay, 'cena');

  // Calcular macros del día seleccionado (excluyendo comidas omitidas)
  const lunch = isLunchOmitted ? null : weeklyMeals[`${activeDay}_almuerzo`];
  const dinner = isDinnerOmitted ? null : weeklyMeals[`${activeDay}_cena`];

  const dayCalories = (lunch?.macros.calories || 0) + (dinner?.macros.calories || 0);
  const dayProtein = (lunch?.macros.protein || 0) + (dinner?.macros.protein || 0);
  const dayCarbs = (lunch?.macros.carbs || 0) + (dinner?.macros.carbs || 0);
  const dayFat = (lunch?.macros.fat || 0) + (dinner?.macros.fat || 0);

  const totalMeals = Object.values(weeklyMeals).filter(Boolean);
  const weekCalories = totalMeals.reduce((sum, m) => sum + (m.macros?.calories || 0), 0);

  // Almuerzo + Cena aportan ~70-75% del total diario
  const expectedMealShare = isLunchOmitted && isDinnerOmitted ? 0 : (isLunchOmitted || isDinnerOmitted ? 0.4 : 0.75);
  const targetMealCalories = Math.round(activeTargets.avgCalories * (isLunchOmitted && isDinnerOmitted ? 0.75 : expectedMealShare));
  const targetMealProtein = Math.round(activeTargets.avgProteinG * (isLunchOmitted && isDinnerOmitted ? 0.75 : expectedMealShare));
  const targetMealCarbs = Math.round(activeTargets.avgCarbsG * (isLunchOmitted && isDinnerOmitted ? 0.75 : expectedMealShare));
  const targetMealFat = Math.round(activeTargets.avgFatG * (isLunchOmitted && isDinnerOmitted ? 0.75 : expectedMealShare));

  const calPercentage = Math.min(100, Math.round((dayCalories / (targetMealCalories || 1)) * 100));

  const mealsLabel = isLunchOmitted && isDinnerOmitted
    ? `Día sin comidas fijadas (${activeDay.toUpperCase()})`
    : isDinnerOmitted
    ? `Solo Almuerzo (${activeDay.toUpperCase()}) • Cena omitida`
    : isLunchOmitted
    ? `Solo Cena (${activeDay.toUpperCase()}) • Almuerzo omitido`
    : `Almuerzo + Cena (${activeDay.toUpperCase()})`;

  return (
    <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-900">
              Progreso Nutricional
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              {mealsLabel}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
            {dayCalories} kcal <span className="text-xs font-normal text-slate-500">/ ~{targetMealCalories} kcal objetivo</span>
          </h2>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                calPercentage > 105 ? 'bg-amber-400' : 'bg-[#10B981]'
              }`}
              style={{ width: `${Math.min(100, calPercentage)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-800">{calPercentage}%</span>
        </div>
      </div>

      {/* Macronutrient Grid: Esmeralda (Carbs), Coral (Proteína), Miel (Grasas) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3">
        {/* Carbohidratos: Esmeralda */}
        <div className="bg-emerald-50/50 rounded-2xl p-2.5 sm:p-3 border border-emerald-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
            <span className="flex items-center gap-1 font-bold">
              <Wheat className="w-3.5 h-3.5 text-[#10B981]" /> Carbs
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">obj. {targetMealCarbs}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-slate-900">{dayCarbs}g</span>
            <span className="text-[10px] font-bold text-emerald-700">
              {Math.round((dayCarbs / (targetMealCarbs || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayCarbs / (targetMealCarbs || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Proteínas: Coral Terracota */}
        <div className="bg-rose-50/50 rounded-2xl p-2.5 sm:p-3 border border-rose-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#E76F51] mb-1">
            <span className="flex items-center gap-1 font-bold">
              <Dumbbell className="w-3.5 h-3.5 text-[#E76F51]" /> Proteína
            </span>
            <span className="text-[10px] text-rose-600 font-medium">obj. {targetMealProtein}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-slate-900">{dayProtein}g</span>
            <span className="text-[10px] font-bold text-[#E76F51]">
              {Math.round((dayProtein / (targetMealProtein || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-rose-200/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#E76F51] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayProtein / (targetMealProtein || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Grasas: Miel / Ocre */}
        <div className="bg-amber-50/50 rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
            <span className="flex items-center gap-1 font-bold">
              <Droplet className="w-3.5 h-3.5 text-amber-500" /> Grasas
            </span>
            <span className="text-[10px] text-amber-600 font-medium">obj. {targetMealFat}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-slate-900">{dayFat}g</span>
            <span className="text-[10px] font-bold text-amber-700">
              {Math.round((dayFat / (targetMealFat || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#E9C46A] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayFat / (targetMealFat || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Promedio semanal: <strong className="text-slate-700">{Math.round(weekCalories / 7)} kcal/día</strong></span>
        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
          <HeartHandshake className="w-3.5 h-3.5" /> Menú familiar equilibrado
        </span>
      </div>
    </div>
  );
};
