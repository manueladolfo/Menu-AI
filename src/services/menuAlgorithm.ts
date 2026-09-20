import type { DayOfWeek, MealType, Recipe, FreshSaladSide, QuickSnack } from '../types';
import { DAILY_FRESH_SIDES, QUICK_SNACKS } from '../data/initialSaladsAndSnacks';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];

export const MEAL_TYPES: MealType[] = ['almuerzo', 'cena'];

/**
 * Devuelve un mapa inicial de ensaladas frescas variadas y equilibradas para los 7 almuerzos de la semana.
 * Las ensaladas se consumen exclusivamente en el almuerzo.
 */
export function generateWeeklySalads(): Record<string, FreshSaladSide> {
  const result: Record<string, FreshSaladSide> = {};
  const totalSalads = DAILY_FRESH_SIDES.length;

  DAYS_OF_WEEK.forEach((day, index) => {
    // Solo almuerzos: 1 ensalada diaria al mediodía
    result[`${day}_almuerzo`] = DAILY_FRESH_SIDES[index % totalSalads];
  });

  return result;
}

/**
 * Devuelve un mapa de sugerencias diarias de snacks saciantes de lunes a domingo.
 */
export function generateWeeklySnacks(): Record<DayOfWeek, QuickSnack> {
  const result = {} as Record<DayOfWeek, QuickSnack>;
  const totalSnacks = QUICK_SNACKS.length;

  DAYS_OF_WEEK.forEach((day, index) => {
    result[day] = QUICK_SNACKS[index % totalSnacks];
  });

  return result;
}

/**
 * Devuelve el acompañamiento fresco o ensalada correspondiente al almuerzo del día (null para cenas).
 */
export function getMealSaladSide(day: DayOfWeek, mealType: MealType): FreshSaladSide | null {
  if (mealType === 'cena') return null;
  const dayIndex = DAYS_OF_WEEK.indexOf(day);
  return DAILY_FRESH_SIDES[dayIndex % DAILY_FRESH_SIDES.length];
}

/**
 * Genera un menú semanal equilibrado sin repetición interna en la misma semana,
 * combinando legumbres (2 días), pescados (2-3), carnes (2-3), pastas (1-2),
 * sopas/cremas (2-3), guisos, tortillas y platos reconfortantes/empanadas para el fin de semana.
 */
export function generateBalancedWeeklyMenu(allRecipes: Recipe[]): Record<string, Recipe> {
  const result: Record<string, Recipe> = {};
  if (allRecipes.length === 0) return result;

  // Clasificar recetas por categoría
  const legumes = allRecipes.filter((r) => r.type === 'legumbre');
  const pastas = allRecipes.filter((r) => r.type === 'pasta');
  const fish = allRecipes.filter((r) => r.type === 'pescado');
  const meats = allRecipes.filter((r) => r.type === 'carne');
  const soups = allRecipes.filter((r) => r.type === 'sopa');
  const stews = allRecipes.filter((r) => r.type === 'guiso');
  const eggs = allRecipes.filter((r) => r.type === 'huevos');
  const fastFoods = allRecipes.filter((r) => r.type === 'fast_food');
  const empanadas = allRecipes.filter((r) => r.type === 'empanada');

  const usedMealIds = new Set<string>();

  const pickUnused = (pool: Recipe[], fallbackPool: Recipe[] = allRecipes): Recipe => {
    const available = pool.filter((r) => !usedMealIds.has(r.id));
    if (available.length > 0) {
      const selected = available[Math.floor(Math.random() * available.length)];
      usedMealIds.add(selected.id);
      return selected;
    }
    const availableFallback = fallbackPool.filter((r) => !usedMealIds.has(r.id));
    if (availableFallback.length > 0) {
      const selected = availableFallback[Math.floor(Math.random() * availableFallback.length)];
      usedMealIds.add(selected.id);
      return selected;
    }
    return pool[0] || allRecipes[0];
  };

  // 1. LUNES
  // Almuerzo: Legumbre suave de inicio de semana
  result['lunes_almuerzo'] = pickUnused(legumes);
  // Cena: Pescado ligero a la plancha
  result['lunes_cena'] = pickUnused(fish);

  // 2. MARTES
  // Almuerzo: Carne blanca / pollo o pavo con guarnición
  result['martes_almuerzo'] = pickUnused(meats);
  // Cena: Sopa reconfortante o crema casera
  result['martes_cena'] = pickUnused(soups);

  // 3. MIÉRCOLES
  // Almuerzo: Pasta nutritiva
  result['miercoles_almuerzo'] = pickUnused(pastas);
  // Cena: Huevos camperos / revuelto o tortilla
  result['miercoles_cena'] = pickUnused(eggs.concat(fish));

  // 4. JUEVES
  // Almuerzo: Segunda legumbre semanal (ej. garbanzos con bacalao o alubias con verduras)
  result['jueves_almuerzo'] = pickUnused(legumes);
  // Cena: Pescado al horno o plancha
  result['jueves_cena'] = pickUnused(fish);

  // 5. VIERNES
  // Almuerzo: Guiso tradicional casero o estofado
  result['viernes_almuerzo'] = pickUnused(stews.concat(meats));
  // Cena: Inicio del fin de semana (Hamburguesa casera, pizza o croquetas)
  result['viernes_cena'] = pickUnused(fastFoods);

  // 6. SÁBADO
  // Almuerzo: Empanada gallega o plato tradicional
  result['sabado_almuerzo'] = pickUnused(empanadas.concat(pastas));
  // Cena: Pizza napolitana casera o smash burger
  result['sabado_cena'] = pickUnused(fastFoods);

  // 7. DOMINGO
  // Almuerzo: Asado familiar de carne o pescado al horno
  result['domingo_almuerzo'] = pickUnused(meats.concat(fish));
  // Cena: Sopa digestiva o cena ligera para empezar la semana descansados
  result['domingo_cena'] = pickUnused(soups.concat(eggs));

  return result;
}

/**
 * Sistema Hot-Swap (Intercambio en Caliente):
 * Devuelve 3 alternativas inmediatas y equilibradas para sustituir una comida específica.
 */
export function getSwapAlternatives(
  currentRecipe: Recipe,
  allRecipes: Recipe[],
  currentMeals: Record<string, Recipe>,
  mealType: MealType
): Recipe[] {
  const candidates = allRecipes.filter((r: Recipe) => r.id !== currentRecipe.id);
  let primaryPool: Recipe[] = [];

  if (currentRecipe.type === 'fast_food' || currentRecipe.type === 'empanada') {
    // Si es fast food o empanada, sugerir otras comidas de fin de semana
    primaryPool = candidates.filter(
      (r: Recipe) =>
        r.type === 'fast_food' || r.type === 'empanada' || r.type === 'pasta' || r.type === 'carne'
    );
  } else if (currentRecipe.type === 'salsa') {
    primaryPool = candidates.filter((r: Recipe) => r.type === 'salsa');
  } else if (currentRecipe.type === 'embutido') {
    primaryPool = candidates.filter((r: Recipe) => r.type === 'embutido' || r.type === 'carne');
  } else if (mealType === 'cena') {
    primaryPool = candidates.filter((r: Recipe) =>
      ['sopa', 'pescado', 'huevos', 'verdura', 'ensalada'].includes(r.type)
    );
  } else {
    if (currentRecipe.type === 'legumbre') {
      primaryPool = candidates.filter((r: Recipe) => r.type === 'legumbre' || r.type === 'guiso');
    } else if (currentRecipe.type === 'pasta') {
      primaryPool = candidates.filter((r: Recipe) => r.type === 'pasta' || r.type === 'legumbre');
    } else if (currentRecipe.type === 'pescado') {
      primaryPool = candidates.filter((r: Recipe) => r.type === 'pescado' || r.type === 'carne');
    } else if (currentRecipe.type === 'sopa') {
      primaryPool = candidates.filter(
        (r: Recipe) => r.type === 'sopa' || r.type === 'verdura' || r.type === 'guiso'
      );
    } else if (currentRecipe.type === 'verdura') {
      primaryPool = candidates.filter(
        (r: Recipe) => r.type === 'verdura' || r.type === 'sopa' || r.type === 'huevos'
      );
    } else {
      primaryPool = candidates.filter((r: Recipe) => r.type === currentRecipe.type);
    }
  }

  const scoredCandidates = (primaryPool.length >= 3 ? primaryPool : candidates)
    .map((candidate: Recipe) => {
      const calorieDiff = Math.abs(candidate.macros.calories - currentRecipe.macros.calories);
      const proteinDiff = Math.abs(candidate.macros.protein - currentRecipe.macros.protein);
      const isAlreadyUsedInWeek = Object.values(currentMeals).filter(
        (m) => m.id === candidate.id
      ).length;
      const score = calorieDiff + proteinDiff * 2 + isAlreadyUsedInWeek * 150;
      return { recipe: candidate, score };
    })
    .sort((a, b) => a.score - b.score);

  return scoredCandidates.slice(0, 3).map((item) => item.recipe);
}
