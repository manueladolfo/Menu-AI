import type { FamilyMember } from '../types';
import { calculateMemberNutritionalTargets } from '../services/nutritionCalculator';

const fatherTargets = calculateMemberNutritionalTargets(48, 'masculino', 'moderado', true, 'deficit_calorico');
const motherTargets = calculateMemberNutritionalTargets(44, 'femenino', 'moderado', false, 'mantenimiento');
const sonTargets = calculateMemberNutritionalTargets(13, 'masculino', 'muy_activo', false, 'mantenimiento');
const daughterTargets = calculateMemberNutritionalTargets(19, 'femenino', 'ligero', false, 'mantenimiento');

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Manuel (Papá)',
    age: 48,
    gender: 'masculino',
    activityLevel: 'moderado',
    dietaryPreferences: ['mediterránea', 'menos grasas saturadas'],
    isOnDiet: true,
    dietType: 'deficit_calorico',
    dietNotes: 'Déficit calórico suave: reducir hidratos simples a la mitad y doblar ensalada o verdura al vapor.',
    activeStatus: true,
    targetCalories: fatherTargets.calories,
    targetProteinG: fatherTargets.proteinG,
    targetCarbsG: fatherTargets.carbsG,
    targetFatG: fatherTargets.fatG,
  },
  {
    id: 'mem-2',
    name: 'Carmen (Mamá)',
    age: 44,
    gender: 'femenino',
    activityLevel: 'moderado',
    dietaryPreferences: ['mediterránea'],
    isOnDiet: false,
    dietType: 'mantenimiento',
    dietNotes: 'Dieta equilibrada estándar.',
    activeStatus: true,
    targetCalories: motherTargets.calories,
    targetProteinG: motherTargets.proteinG,
    targetCarbsG: motherTargets.carbsG,
    targetFatG: motherTargets.fatG,
  },
  {
    id: 'mem-3',
    name: 'Hugo (Hijo)',
    age: 13,
    gender: 'masculino',
    activityLevel: 'muy_activo',
    dietaryPreferences: ['alta energía', 'crecimiento'],
    isOnDiet: false,
    dietType: 'mantenimiento',
    dietNotes: 'Adolescente en crecimiento y entrenamientos: raciones generosas de hidratos y legumbres.',
    activeStatus: true,
    targetCalories: sonTargets.calories,
    targetProteinG: sonTargets.proteinG,
    targetCarbsG: sonTargets.carbsG,
    targetFatG: sonTargets.fatG,
  },
  {
    id: 'mem-4',
    name: 'Lucía (Hija estudiante)',
    age: 19,
    gender: 'femenino',
    activityLevel: 'ligero',
    dietaryPreferences: ['mediterránea'],
    isOnDiet: false,
    dietType: 'mantenimiento',
    dietNotes: 'Universitaria. Toggle estacional: activar cuando regrese a casa en vacaciones/festivos.',
    activeStatus: false, // Perfil estacional: actualmente fuera
    targetCalories: daughterTargets.calories,
    targetProteinG: daughterTargets.proteinG,
    targetCarbsG: daughterTargets.carbsG,
    targetFatG: daughterTargets.fatG,
  },
];
