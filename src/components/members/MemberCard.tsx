import React from 'react';
import type { FamilyMember } from '../../types';
import { Power, Edit2, Trash2, Heart, Activity } from 'lucide-react';

interface MemberCardProps {
  member: FamilyMember;
  onToggleActive: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 border transition-all ${
        member.activeStatus
          ? 'bg-white/95 border-amber-950/10 shadow-sm'
          : 'bg-[#faf7f2]/70 border-dashed border-stone-300 opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
              member.activeStatus
                ? 'bg-[#fbf4eb] text-[#8a4b27]'
                : 'bg-stone-200 text-stone-500'
            }`}
          >
            {member.name.slice(0, 1).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-stone-900 text-base">{member.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                {member.age} años
              </span>
              {member.isOnDiet && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#fdf8ed] text-[#78541c] border border-[#f5e5be]">
                  En Dieta
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-stone-400" />
              <span>Actividad: {member.activityLevel}</span>
              <span>•</span>
              <span className="capitalize">{member.gender}</span>
            </p>
          </div>
        </div>

        {/* Seasonal Active Toggle en tono pastel sereno */}
        <button
          onClick={() => onToggleActive(member.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            member.activeStatus
              ? 'bg-[#edf6ed] text-[#2c532f] border border-[#cfe2cf] hover:bg-[#e2f0e2]'
              : 'bg-stone-200/80 text-stone-600 hover:bg-stone-300'
          }`}
          title={member.activeStatus ? 'Come en casa (Activo)' : 'Fuera de casa (Pausado)'}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{member.activeStatus ? 'En Casa' : 'Fuera'}</span>
        </button>
      </div>

      {/* Target Nutritional Requirements en pasteles cálidos */}
      <div className="mt-3.5 grid grid-cols-4 gap-2 text-center bg-[#faf7f2] rounded-2xl p-2.5 border border-amber-950/5">
        <div>
          <span className="block text-[10px] text-stone-400 uppercase font-bold">Calorías</span>
          <span className="text-sm font-extrabold text-stone-800">{member.targetCalories}</span>
        </div>
        <div>
          <span className="block text-[10px] text-[#3b6e3f] uppercase font-bold">Proteína</span>
          <span className="text-sm font-extrabold text-[#2c532f]">{member.targetProteinG}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-[#a06822] uppercase font-bold">Carbos</span>
          <span className="text-sm font-extrabold text-[#754a13]">{member.targetCarbsG}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-[#a64e52] uppercase font-bold">Grasas</span>
          <span className="text-sm font-extrabold text-[#7d3337]">{member.targetFatG}g</span>
        </div>
      </div>

      {/* Diet note detail if active */}
      {member.isOnDiet && member.dietNotes && (
        <div className="mt-3 p-2.5 rounded-2xl bg-[#fdf8ed] border border-[#f5e5be] text-xs text-[#78541c]">
          <span className="font-bold flex items-center gap-1 mb-0.5">
            <Heart className="w-3 h-3 text-amber-600" />
            Objetivo: {member.dietType.replace('_', ' ')}
          </span>
          <p className="text-[11px] leading-relaxed opacity-90">{member.dietNotes}</p>
        </div>
      )}

      {/* Card Actions */}
      <div className="mt-3 pt-2.5 border-t border-amber-950/5 flex items-center justify-between text-xs">
        <span className="text-stone-400 text-[11px]">
          {member.activeStatus ? 'Incluido en raciones y compra' : 'No contabilizado en compras'}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            title="Editar miembro"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Eliminar miembro"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
