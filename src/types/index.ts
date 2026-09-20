export type SupermarketAisle = 
  | 'frescos_verdura' 
  | 'carniceria_pescaderia' 
  | 'lacteos_huevos' 
  | 'despensa_legumbres' 
  | 'congelados' 
  | 'especias_aceites';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: SupermarketAisle;
  supermarket_ref?: string;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type RecipeType = 
  | 'carne' 
  | 'pescado' 
  | 'guiso' 
  | 'legumbre' 
  | 'ensalada' 
  | 'pasta' 
  | 'verdura' 
  | 'huevos'
  | 'sopa'
  | 'fast_food'
  | 'empanada'
  | 'salsa'
  | 'embutido';

export type OmittableSlot = 'almuerzo' | 'cena' | 'ensalada' | 'snack';

export interface FreshSaladSide {
  id: string;
  name: string;
  description: string;
  emoji: string;
  ingredients: Ingredient[];
}

export interface QuickSnack {
  id: string;
  name: string;
  description: string;
  prepTime: string; // "0 min" o "2 min"
  calories: number;
  emoji: string;
  category: 'fruta_lacteo' | 'frutos_secos' | 'salado_encurtido' | 'crujiente';
  ingredients: Ingredient[];
}

export type Difficulty = 'fácil' | 'media' | 'difícil';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  type: RecipeType;
  ingredients: Ingredient[];
  macros: Macros; // por ración
  difficulty: Difficulty;
  prep_time: number; // minutos
  batch_cooking: boolean;
  batch_notes?: string;
  diet_adaptation?: string;
  emoji?: string;
}

export type DayOfWeek = 
  | 'lunes' 
  | 'martes' 
  | 'miercoles' 
  | 'jueves' 
  | 'viernes' 
  | 'sabado' 
  | 'domingo';

export type MealType = 'almuerzo' | 'cena';

export interface MealSlotData {
  day: DayOfWeek;
  mealType: MealType;
  recipe: Recipe;
  servingsCount: number;
  customNotes?: string;
}

export interface WeeklyMenu {
  id?: string;
  weekStartDate: string;
  meals: Record<string, Recipe>; // key: `${day}_${mealType}`
}

export type Gender = 'femenino' | 'masculino' | 'otro';
export type ActivityLevel = 'sedentario' | 'ligero' | 'moderado' | 'muy_activo';
export type DietType = 
  | 'mantenimiento' 
  | 'deficit_calorico' 
  | 'baja_carbohidratos' 
  | 'alta_proteina' 
  | 'keto' 
  | 'vegetariana';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  dietaryPreferences: string[];
  isOnDiet: boolean;
  dietType: DietType;
  dietNotes: string;
  activeStatus: boolean; // toggle estacional: ej. hijo fuera o en casa
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
}

export interface GroceryItemUsage {
  day: DayOfWeek;
  mealType?: MealType | 'snack';
  recipeTitle: string;
  label: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  totalQuantity: number;
  unit: string;
  category: SupermarketAisle;
  supermarketRef?: string;
  checked: boolean;
  recipesUsing: string[];
  days: DayOfWeek[];
  usages: GroceryItemUsage[];
}

