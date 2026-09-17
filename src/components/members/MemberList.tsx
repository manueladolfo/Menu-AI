import React, { useState } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { MemberCard } from './MemberCard';
import { MemberModal } from './MemberModal';
import type { FamilyMember } from '../../types';
import { UserPlus, Users, Info } from 'lucide-react';

export const MemberList: React.FC = () => {
  const {
    members,
    toggleMemberActive,
    addMember,
    updateMember,
    deleteMember,
    activeTargets,
    activeMembersCount,
  } = useFamilyMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingMember) {
      updateMember(data);
    } else {
      addMember(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner en tonos suaves de albaricoque y crema */}
      <div className="bg-gradient-to-r from-[#fff9f4] via-[#fbf3eb] to-[#f8ede2] border border-amber-950/10 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Familia & Perfiles Estacionales
              </h2>
              <p className="text-xs text-stone-600">
                {activeMembersCount} comensales en casa • Las raciones y compras se adaptan solas
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#d97757] hover:bg-[#c66a4c] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Añadir Familiar</span>
        </button>
      </div>

      {/* Aggregate Nutritional Goals Bar */}
      <div className="bg-white/95 rounded-2xl p-4 border border-amber-950/10 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600">
          <Info className="w-4 h-4 text-[#c26546] shrink-0" />
          <span>
            Promedio diario por comensal activo:{' '}
            <strong className="text-stone-900">{activeTargets.avgCalories} kcal</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 font-bold">
          <span className="text-[#2c532f]">{activeTargets.avgProteinG}g Prot</span>
          <span className="text-stone-300">•</span>
          <span className="text-[#80501d]">{activeTargets.avgCarbsG}g Carbos</span>
          <span className="text-stone-300">•</span>
          <span className="text-[#87393d]">{activeTargets.avgFatG}g Grasas</span>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onToggleActive={toggleMemberActive}
            onEdit={handleOpenEdit}
            onDelete={deleteMember}
          />
        ))}
      </div>

      {/* Edit/Add Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialMember={editingMember}
      />
    </div>
  );
};
