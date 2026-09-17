import React from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { Dumbbell, Wheat, Droplet, HeartHandshake } from 'lucide-react';

export const MacroSummaryBar: React.FC = () => {
  const { weeklyMeals, activeTargets, activeDay } = useFamilyMenu();

  // Calcular macros del día seleccionado
  const lunch = weeklyMeals[`${activeDay}_almuerzo`];
  const dinner = weeklyMeals[`${activeDay}_cena`];

  const dayCalories = (lunch?.macros.calories || 0) + (dinner?.macros.calories || 0);
  const dayProtein = (lunch?.macros.protein || 0) + (dinner?.macros.protein || 0);
  const dayCarbs = (lunch?.macros.carbs || 0) + (dinner?.macros.carbs || 0);
  const dayFat = (lunch?.macros.fat || 0) + (dinner?.macros.fat || 0);

  const totalMeals = Object.values(weeklyMeals).filter(Boolean);
  const weekCalories = totalMeals.reduce((sum, m) => sum + (m.macros?.calories || 0), 0);

  // Almuerzo + Cena aportan ~70-75% del total diario
  const expectedMealShare = 0.75;
  const targetMealCalories = Math.round(activeTargets.avgCalories * expectedMealShare);
  const targetMealProtein = Math.round(activeTargets.avgProteinG * expectedMealShare);
  const targetMealCarbs = Math.round(activeTargets.avgCarbsG * expectedMealShare);
  const targetMealFat = Math.round(activeTargets.avgFatG * expectedMealShare);

  const calPercentage = Math.min(100, Math.round((dayCalories / (targetMealCalories || 1)) * 100));

  return (
    <div className="bg-gradient-to-br from-[#382d27] via-[#43352e] to-[#342823] text-[#fbf8f5] rounded-3xl p-4 sm:p-5 shadow-md border border-amber-900/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              Tranquilidad & Nutrición
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#4e3f37] text-amber-200 font-medium">
              Almuerzo + Cena ({activeDay.toUpperCase()})
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            {dayCalories} kcal <span className="text-xs font-normal text-amber-200/80">/ ~{targetMealCalories} kcal objetivo diario</span>
          </h2>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-32 bg-[#4e3f37] rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                calPercentage > 105 ? 'bg-amber-300' : 'bg-emerald-300'
              }`}
              style={{ width: `${Math.min(100, calPercentage)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-200">{calPercentage}%</span>
        </div>
      </div>

      {/* Macronutrient Grid con colores pasteles cálidos y serenos */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3">
        {/* Proteínas: pastel sage */}
        <div className="bg-[#444e41]/80 rounded-2xl p-2.5 sm:p-3 border border-[#5a6855]/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#c6d6c3] mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Dumbbell className="w-3.5 h-3.5 text-[#b0ccab]" /> Prot
            </span>
            <span className="text-[10px] text-[#c6d6c3]/80">obj. {targetMealProtein}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-[#d8ebd5]">{dayProtein}g</span>
            <span className="text-[10px] font-semibold text-[#b0ccab]">
              {Math.round((dayProtein / (targetMealProtein || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#353d32] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#a2c99c] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayProtein / (targetMealProtein || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Carbohidratos: pastel miel / albaricoque */}
        <div className="bg-[#524131]/80 rounded-2xl p-2.5 sm:p-3 border border-[#6d5743]/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#ebd8be] mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Wheat className="w-3.5 h-3.5 text-[#f5d098]" /> CH
            </span>
            <span className="text-[10px] text-[#ebd8be]/80">obj. {targetMealCarbs}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-[#fae4c8]">{dayCarbs}g</span>
            <span className="text-[10px] font-semibold text-[#f5d098]">
              {Math.round((dayCarbs / (targetMealCarbs || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#3b2e23] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#f0c27b] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayCarbs / (targetMealCarbs || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Grasas saludables: pastel rosa empolvado / melocotón */}
        <div className="bg-[#52383a]/80 rounded-2xl p-2.5 sm:p-3 border border-[#6e4d4f]/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#ebcbcc] mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Droplet className="w-3.5 h-3.5 text-[#f0afb2]" /> Grasa
            </span>
            <span className="text-[10px] text-[#ebcbcc]/80">obj. {targetMealFat}g</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-[#fae0e1]">{dayFat}g</span>
            <span className="text-[10px] font-semibold text-[#f0afb2]">
              {Math.round((dayFat / (targetMealFat || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#3d2729] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#e89fa3] h-full rounded-full"
              style={{ width: `${Math.min(100, (dayFat / (targetMealFat || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-amber-900/30 text-[11px] text-amber-200/90 flex items-center justify-between">
        <span>Promedio semanal: <strong>{Math.round(weekCalories / 7)} kcal/día</strong></span>
        <span className="text-amber-300 flex items-center gap-1 font-medium">
          <HeartHandshake className="w-3.5 h-3.5" /> Menú familiar sin agobios
        </span>
      </div>
    </div>
  );
};
