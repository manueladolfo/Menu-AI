import React, { useState, useEffect } from 'react';
import type { ActivityLevel, DietType, FamilyMember, Gender } from '../../types';
import { calculateMemberNutritionalTargets } from '../../services/nutritionCalculator';
import { X, Sparkles, Heart } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: any) => void;
  initialMember?: FamilyMember | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(40);
  const [gender, setGender] = useState<Gender>('femenino');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderado');
  const [isOnDiet, setIsOnDiet] = useState(false);
  const [dietType, setDietType] = useState<DietType>('mantenimiento');
  const [dietNotes, setDietNotes] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setAge(initialMember.age);
      setGender(initialMember.gender);
      setActivityLevel(initialMember.activityLevel);
      setIsOnDiet(initialMember.isOnDiet);
      setDietType(initialMember.dietType);
      setDietNotes(initialMember.dietNotes);
      setActiveStatus(initialMember.activeStatus);
    } else {
      setName('');
      setAge(35);
      setGender('femenino');
      setActivityLevel('moderado');
      setIsOnDiet(false);
      setDietType('mantenimiento');
      setDietNotes('');
      setActiveStatus(true);
    }
  }, [initialMember, isOpen]);

  const calculatedTargets = calculateMemberNutritionalTargets(
    Number(age) || 30,
    gender,
    activityLevel,
    isOnDiet,
    dietType
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(initialMember ? { id: initialMember.id } : {}),
      name: name.trim(),
      age: Number(age) || 30,
      gender,
      activityLevel,
      dietaryPreferences: initialMember?.dietaryPreferences || ['mediterránea'],
      isOnDiet,
      dietType: isOnDiet ? dietType : 'mantenimiento',
      dietNotes: isOnDiet ? dietNotes : '',
      activeStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#faf7f2] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-amber-950/10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {initialMember ? 'Editar Familiar' : 'Añadir Familiar'}
            </h2>
            <p className="text-xs text-stone-500">
              Calculamos las necesidades de forma tranquila según la edad y metabolismo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Nombre o Rol familiar *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Manuel (Papá), Lucía, Hugo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Edad & Género */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Edad (años) *
              </label>
              <input
                type="number"
                min={1}
                max={110}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Género
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Nivel de actividad */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Nivel de Actividad Física
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="sedentario">Sedentario (poco ejercicio)</option>
              <option value="ligero">Ligero (1-2 días por semana)</option>
              <option value="moderado">Moderado (3-4 días por semana)</option>
              <option value="muy_activo">Muy activo / Deporte intenso (5-7 días)</option>
            </select>
          </div>

          {/* Toggle estacional: Come en casa */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 block">Perfil Estacional Activo</span>
              <span className="text-[11px] text-stone-500">
                Indica si come en casa esta temporada o está fuera (ej. estudios).
              </span>
            </div>
            <input
              type="checkbox"
              checked={activeStatus}
              onChange={(e) => setActiveStatus(e.target.checked)}
              className="w-5 h-5 accent-[#c26546] rounded cursor-pointer"
            />
          </div>

          {/* Switch: ¿Está a dieta? */}
          <div className="p-3.5 rounded-2xl bg-[#fdf8ed] border border-[#f5e5be] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-[#78541c]">¿Tiene un objetivo o dieta específica?</span>
              </div>
              <input
                type="checkbox"
                checked={isOnDiet}
                onChange={(e) => setIsOnDiet(e.target.checked)}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {isOnDiet && (
              <div className="space-y-2.5 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                    Tipo de dieta
                  </label>
                  <select
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value as DietType)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="deficit_calorico">Déficit calórico (Pérdida de grasa)</option>
                    <option value="baja_carbohidratos">Baja en carbohidratos (Low Carb)</option>
                    <option value="alta_proteina">Alta en proteínas (Masa muscular)</option>
                    <option value="keto">Cetogénica (Keto)</option>
                    <option value="vegetariana">Vegetariana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                    Cómo adaptar el plato común sin cocinar dos comidas distintas
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Reducir carbohidratos simples a la mitad, doblar ración de ensalada..."
                    value={dietNotes}
                    onChange={(e) => setDietNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Calculated Target Preview */}
          <div className="bg-[#edf6ed] rounded-2xl p-3.5 border border-[#cfe2cf]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2c532f] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cálculo diario estimado:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white/90 p-2 rounded-xl">
                <span className="block text-[10px] text-stone-500 font-medium">Calorías</span>
                <span className="font-extrabold text-stone-900">{calculatedTargets.calories}</span>
              </div>
              <div className="bg-white/90 p-2 rounded-xl">
                <span className="block text-[10px] text-[#3b6e3f] font-medium">Proteínas</span>
                <span className="font-extrabold text-[#2c532f]">{calculatedTargets.proteinG}g</span>
              </div>
              <div className="bg-white/90 p-2 rounded-xl">
                <span className="block text-[10px] text-[#a06822] font-medium">Carbos</span>
                <span className="font-extrabold text-[#754a13]">{calculatedTargets.carbsG}g</span>
              </div>
              <div className="bg-white/90 p-2 rounded-xl">
                <span className="block text-[10px] text-[#a64e52] font-medium">Grasas</span>
                <span className="font-extrabold text-[#7d3337]">{calculatedTargets.fatG}g</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-amber-950/5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#d97757] hover:bg-[#c66a4c] shadow-xs transition-all active:scale-95"
            >
              Guardar Familiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
