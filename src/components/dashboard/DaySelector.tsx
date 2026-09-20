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
    <div className="grid grid-cols-7 gap-1 sm:gap-2 py-1 w-full">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDay === day;
        const isSunday = day === 'domingo';

        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`w-full py-2 sm:py-2.5 px-0.5 sm:px-2 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all select-none ${
              isSelected
                ? 'bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/30 font-bold'
                : 'bg-[#CBD5E1]/70 text-slate-700 hover:bg-[#CBD5E1] border-none font-semibold'
            }`}
          >
            <span className="text-[11px] sm:text-xs uppercase tracking-tight sm:tracking-wider font-bold opacity-90">
              {DAY_LABELS[day].short}
            </span>
            <span className="text-[10px] opacity-75 hidden sm:inline mt-0.5">
              {isSunday ? 'Domingo' : DAY_LABELS[day].full}
            </span>
            {isSunday && !isSelected && (
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#E76F51] mt-0.5 sm:mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
};
