import React from 'react';
import type { DayOfWeek } from '../../types';
import { DAYS_OF_WEEK } from '../../services/menuAlgorithm';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

const DAY_LABELS: Record<DayOfWeek, { short: string; full: string }> = {
  lunes: { short: 'Lun', full: 'Lunes' },
  martes: { short: 'Mar', full: 'Martes' },
  miercoles: { short: 'Mié', full: 'Miércoles' },
  jueves: { short: 'Jue', full: 'Jueves' },
  viernes: { short: 'Vie', full: 'Viernes' },
  sabado: { short: 'Sáb', full: 'Sábado' },
  domingo: { short: 'Dom', full: 'Domingo' },
};

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onSelectDay }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDay === day;
        const isSunday = day === 'domingo';

        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`flex-1 min-w-[52px] sm:min-w-[72px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isSelected
                ? 'bg-[#d97757] text-white shadow-sm shadow-[#d97757]/30 scale-102 font-bold'
                : 'bg-white/90 text-stone-600 hover:bg-amber-50/70 border border-amber-950/10 font-semibold'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-bold opacity-90">
              {DAY_LABELS[day].short}
            </span>
            <span className="text-[10px] opacity-75 hidden sm:inline mt-0.5">
              {isSunday ? 'Domingo' : DAY_LABELS[day].full}
            </span>
            {isSunday && !isSelected && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
};
