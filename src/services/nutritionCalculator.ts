import type { ActivityLevel, DietType, FamilyMember, Gender } from '../types';

/**
 * Calcula requerimientos calóricos y de macronutrientes aproximados
 * considerando edad, género, nivel de actividad y si está a dieta.
 */
export function calculateMemberNutritionalTargets(
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  isOnDiet: boolean,
  dietType: DietType
): {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
} {
  // Estimación de peso y altura promedios según edad y género para estimar BMR
  let baseCalories = 2000;

  if (age < 5) {
    baseCalories = 1200;
  } else if (age < 10) {
    baseCalories = 1600;
  } else if (age <= 18) {
    // Adolescentes en crecimiento: alta demanda metabólica
    baseCalories = gender === 'masculino' ? 2600 : 2200;
  } else if (age < 60) {
    // Adultos (40-50 años: desaceleración metabólica moderada)
    baseCalories = gender === 'masculino' ? 2250 : 1850;
    if (age > 45) {
      baseCalories -= 100;
    }
  } else {
    // Tercera edad
    baseCalories = gender === 'masculino' ? 1900 : 1650;
  }

  // Factor de actividad física
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentario: 1.0,
    ligero: 1.15,
    moderado: 1.25,
    muy_activo: 1.45,
  };

  let targetCalories = Math.round(baseCalories * (activityMultipliers[activityLevel] || 1.15));

  // Ajuste según tipo de dieta si está activa
  if (isOnDiet) {
    switch (dietType) {
      case 'deficit_calorico':
        targetCalories = Math.round(targetCalories * 0.82); // Déficit moderado del 18%
        break;
      case 'baja_carbohidratos':
        targetCalories = Math.round(targetCalories * 0.88);
        break;
      case 'alta_proteina':
        targetCalories = Math.round(targetCalories * 0.95);
        break;
      case 'keto':
        targetCalories = Math.round(targetCalories * 0.85);
        break;
      default:
        break;
    }
  }

  // Distribución de macros recomendada
  let proteinRatio = 0.25; // 25% calorías
  let carbsRatio = 0.50;   // 50% calorías
  let fatRatio = 0.25;     // 25% calorías

  if (isOnDiet) {
    if (dietType === 'deficit_calorico' || dietType === 'alta_proteina') {
      proteinRatio = 0.35;
      carbsRatio = 0.40;
      fatRatio = 0.25;
    } else if (dietType === 'baja_carbohidratos') {
      proteinRatio = 0.30;
      carbsRatio = 0.30;
      fatRatio = 0.40;
    } else if (dietType === 'keto') {
      proteinRatio = 0.25;
      carbsRatio = 0.10;
      fatRatio = 0.65;
    }
  } else if (age <= 18) {
    // Adolescentes: mayor % de carbohidratos complejos para energía
    carbsRatio = 0.55;
    proteinRatio = 0.22;
    fatRatio = 0.23;
  }

  // 1g Proteína = 4 kcal, 1g Carbohidrato = 4 kcal, 1g Grasa = 9 kcal
  const proteinG = Math.round((targetCalories * proteinRatio) / 4);
  const carbsG = Math.round((targetCalories * carbsRatio) / 4);
  const fatG = Math.round((targetCalories * fatRatio) / 9);

  return {
    calories: targetCalories,
    proteinG,
    carbsG,
    fatG,
  };
}

/**
 * Agrega los requerimientos de todos los miembros actualmente activos.
 */
export function getActiveFamilyTargets(members: FamilyMember[]) {
  const activeMembers = members.filter((m) => m.activeStatus);

  if (activeMembers.length === 0) {
    return {
      activeCount: 0,
      avgCalories: 2000,
      totalCalories: 2000,
      avgProteinG: 100,
      avgCarbsG: 220,
      avgFatG: 65,
      totalProteinG: 100,
      totalCarbsG: 220,
      totalFatG: 65,
    };
  }

  const totalCalories = activeMembers.reduce((sum, m) => sum + m.targetCalories, 0);
  const totalProteinG = activeMembers.reduce((sum, m) => sum + m.targetProteinG, 0);
  const totalCarbsG = activeMembers.reduce((sum, m) => sum + m.targetCarbsG, 0);
  const totalFatG = activeMembers.reduce((sum, m) => sum + m.targetFatG, 0);

  const count = activeMembers.length;

  return {
    activeCount: count,
    avgCalories: Math.round(totalCalories / count),
    totalCalories,
    avgProteinG: Math.round(totalProteinG / count),
    avgCarbsG: Math.round(totalCarbsG / count),
    avgFatG: Math.round(totalFatG / count),
    totalProteinG,
    totalCarbsG,
    totalFatG,
  };
}
