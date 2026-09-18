import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import type { DayOfWeek, FamilyMember, GroceryItem, MealType, Recipe, QuickSnack, FreshSaladSide } from '../types';
import { INITIAL_MEMBERS } from '../data/initialMembers';
import { INITIAL_RECIPES } from '../data/initialRecipes';
import { DAILY_FRESH_SIDES, QUICK_SNACKS } from '../data/initialSaladsAndSnacks';
import { generateBalancedWeeklyMenu, generateWeeklySalads, generateWeeklySnacks, getMealSaladSide, DAYS_OF_WEEK } from '../services/menuAlgorithm';
import { calculateMemberNutritionalTargets, getActiveFamilyTargets } from '../services/nutritionCalculator';
import { generateMenuWithGemini } from '../services/geminiService';
import type { GenerateWithAIOptions, DayMenuProposal } from '../services/geminiService';
import { getSupabaseClient } from '../services/supabaseClient';

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'local';

interface FamilyMenuContextType {
  members: FamilyMember[];
  recipes: Recipe[];
  weeklyMeals: Record<string, Recipe>;
  weeklySalads: Record<string, FreshSaladSide>;
  weeklySnacks: Record<DayOfWeek, QuickSnack>;
  allSalads: FreshSaladSide[];
  allSnacks: QuickSnack[];
  customRecipes: Recipe[];
  customSalads: FreshSaladSide[];
  customSnacks: QuickSnack[];
  activeDay: DayOfWeek;
  syncStatus: CloudSyncStatus;
  setActiveDay: (day: DayOfWeek) => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (member: FamilyMember) => void;
  deleteMember: (id: string) => void;
  toggleMemberActive: (id: string) => void;
  generateWeek: () => void;
  generateWeekWithAI: (options: GenerateWithAIOptions) => Promise<{ success: boolean; message: string }>;
  swapMeal: (day: DayOfWeek, mealType: MealType, newRecipe: Recipe) => void;
  swapSalad: (day: DayOfWeek, mealType: MealType, newSalad: FreshSaladSide) => void;
  swapSnack: (day: DayOfWeek, newSnack: QuickSnack) => void;
  addRecipeToCatalog: (recipe: Recipe) => void;
  addSaladToCatalog: (salad: FreshSaladSide) => void;
  addSnackToCatalog: (snack: QuickSnack) => void;
  applyFullDayMenu: (day: DayOfWeek, proposal: DayMenuProposal) => void;
  groceryItems: GroceryItem[];
  toggleGroceryItem: (name: string) => void;
  resetGroceryChecks: () => void;
  activeTargets: ReturnType<typeof getActiveFamilyTargets>;
  activeMembersCount: number;
  isSupabaseConfigured: boolean;
  selectedSnackIds: string[];
  toggleSnackInGrocery: (snackId: string) => void;
  getSaladForMeal: (day: DayOfWeek, mealType: MealType) => FreshSaladSide;
  getSnackForDay: (day: DayOfWeek) => QuickSnack;
}

const FamilyMenuContext = createContext<FamilyMenuContextType | undefined>(undefined);

const LOCAL_STORAGE_MEMBERS = 'familymenu_members_v1';
const LOCAL_STORAGE_MEALS = 'familymenu_meals_v1';
const LOCAL_STORAGE_SALADS = 'familymenu_salads_v1';
const LOCAL_STORAGE_WEEKLY_SNACKS = 'familymenu_weekly_snacks_v1';
const LOCAL_STORAGE_CUSTOM_RECIPES = 'familymenu_custom_recipes_v1';
const LOCAL_STORAGE_CUSTOM_SALADS = 'familymenu_custom_salads_v1';
const LOCAL_STORAGE_CUSTOM_SNACKS = 'familymenu_custom_snacks_v1';
const LOCAL_STORAGE_GROCERY_CHECKS = 'familymenu_grocery_checks_v1';
const LOCAL_STORAGE_SNACKS = 'familymenu_snacks_v1';

export const FamilyMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Estado de miembros
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando miembros de localStorage', e);
      }
    }
    return INITIAL_MEMBERS;
  });

  // 2. Estado de recetas personalizadas guardadas por el usuario
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RECIPES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando recetas personalizadas', e);
      }
    }
    return [];
  });

  const recipes = useMemo(() => {
    return [...customRecipes, ...INITIAL_RECIPES];
  }, [customRecipes]);

  // 3. Ensaladas personalizadas guardadas por el usuario
  const [customSalads, setCustomSalads] = useState<FreshSaladSide[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SALADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando ensaladas personalizadas', e);
      }
    }
    return [];
  });

  const allSalads = useMemo(() => {
    return [...customSalads, ...DAILY_FRESH_SIDES];
  }, [customSalads]);

  // 4. Snacks personalizados guardados por el usuario
  const [customSnacks, setCustomSnacks] = useState<QuickSnack[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SNACKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando snacks personalizados', e);
      }
    }
    return [];
  });

  const allSnacks = useMemo(() => {
    return [...customSnacks, ...QUICK_SNACKS];
  }, [customSnacks]);

  // 5. Estado de comidas semanales
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, Recipe>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MEALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando comidas de localStorage', e);
      }
    }
    return generateBalancedWeeklyMenu(INITIAL_RECIPES);
  });

  // 6. Estado de ensaladas frescas semanales por comida (14 slots)
  const [weeklySalads, setWeeklySalads] = useState<Record<string, FreshSaladSide>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SALADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando ensaladas de localStorage', e);
      }
    }
    return generateWeeklySalads();
  });

  // 7. Estado de snacks saciantes semanales por día (7 días)
  const [weeklySnacks, setWeeklySnacks] = useState<Record<DayOfWeek, QuickSnack>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WEEKLY_SNACKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando snacks semanales de localStorage', e);
      }
    }
    return generateWeeklySnacks();
  });

  // 8. Día activo seleccionado
  const [activeDay, setActiveDay] = useState<DayOfWeek>('lunes');

  // 9. Estado de checks en la lista de la compra
  const [groceryChecks, setGroceryChecks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_GROCERY_CHECKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando checks de compra', e);
      }
    }
    return {};
  });

  // 10. Snacks adicionales seleccionados
  const [selectedSnackIds, setSelectedSnackIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SNACKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando snacks de localStorage', e);
      }
    }
    return ['snack-1', 'snack-2'];
  });

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_RECIPES, JSON.stringify(customRecipes));
  }, [customRecipes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SALADS, JSON.stringify(customSalads));
  }, [customSalads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SNACKS, JSON.stringify(customSnacks));
  }, [customSnacks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MEALS, JSON.stringify(weeklyMeals));
  }, [weeklyMeals]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SALADS, JSON.stringify(weeklySalads));
  }, [weeklySalads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_WEEKLY_SNACKS, JSON.stringify(weeklySnacks));
  }, [weeklySnacks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_GROCERY_CHECKS, JSON.stringify(groceryChecks));
  }, [groceryChecks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SNACKS, JSON.stringify(selectedSnackIds));
  }, [selectedSnackIds]);

  // ==============================================================================
  // SINCRONIZACIÓN EN LA NUBE CON SUPABASE (Bidireccional + Realtime)
  // Permite que cualquier miembro de la familia abra la app desde su móvil
  // y comparta el mismo menú, cambios y lista de la compra en tiempo real.
  // ==============================================================================
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local');
  const isInitialLoad = useRef(true);
  const isIncomingRemoteUpdate = useRef(false);

  // 1. Descarga inicial y suscripción a cambios en tiempo real desde Supabase
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setSyncStatus('local');
      return;
    }

    setSyncStatus('syncing');

    // Cargar datos remotos compartidos
    const loadRemoteState = async () => {
      try {
        const { data, error } = await supabase
          .from('family_sync')
          .select('*')
          .eq('id', 'family_default')
          .single();

        if (data && !error) {
          isIncomingRemoteUpdate.current = true;
          if (data.members && Array.isArray(data.members) && data.members.length > 0) {
            setMembers(data.members);
          }
          if (data.weekly_meals && Object.keys(data.weekly_meals).length > 0) {
            setWeeklyMeals(data.weekly_meals);
          }
          if (data.weekly_salads && Object.keys(data.weekly_salads).length > 0) {
            setWeeklySalads(data.weekly_salads);
          }
          if (data.weekly_snacks && Object.keys(data.weekly_snacks).length > 0) {
            setWeeklySnacks(data.weekly_snacks);
          }
          if (data.custom_recipes && Array.isArray(data.custom_recipes)) {
            setCustomRecipes(data.custom_recipes);
          }
          if (data.custom_salads && Array.isArray(data.custom_salads)) {
            setCustomSalads(data.custom_salads);
          }
          if (data.custom_snacks && Array.isArray(data.custom_snacks)) {
            setCustomSnacks(data.custom_snacks);
          }
          if (data.grocery_checks && typeof data.grocery_checks === 'object') {
            setGroceryChecks(data.grocery_checks);
          }
          setSyncStatus('synced');
          setTimeout(() => {
            isIncomingRemoteUpdate.current = false;
            isInitialLoad.current = false;
          }, 400);
        } else {
          // Si es la primera vez que se usa y no existe la fila, se creará en el siguiente guardado
          setSyncStatus('synced');
          isInitialLoad.current = false;
        }
      } catch (err) {
        console.warn('Error conectando con Supabase:', err);
        setSyncStatus('offline');
        isInitialLoad.current = false;
      }
    };

    loadRemoteState();

    // Suscripción Realtime para actualizar la pantalla al instante si otro familiar hace un cambio
    const channel = supabase
      .channel('family_sync_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'family_sync', filter: 'id=eq.family_default' },
        (payload: any) => {
          const newData = payload.new;
          if (newData) {
            isIncomingRemoteUpdate.current = true;
            if (newData.members && Array.isArray(newData.members)) setMembers(newData.members);
            if (newData.weekly_meals) setWeeklyMeals(newData.weekly_meals);
            if (newData.weekly_salads) setWeeklySalads(newData.weekly_salads);
            if (newData.weekly_snacks) setWeeklySnacks(newData.weekly_snacks);
            if (newData.custom_recipes) setCustomRecipes(newData.custom_recipes);
            if (newData.custom_salads) setCustomSalads(newData.custom_salads);
            if (newData.custom_snacks) setCustomSnacks(newData.custom_snacks);
            if (newData.grocery_checks) setGroceryChecks(newData.grocery_checks);
            setSyncStatus('synced');
            setTimeout(() => {
              isIncomingRemoteUpdate.current = false;
            }, 400);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Subir cambios automáticamente a Supabase cuando el usuario modifica platos, miembros o compra
  useEffect(() => {
    if (isInitialLoad.current || isIncomingRemoteUpdate.current) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setSyncStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        const { error } = await supabase.from('family_sync').upsert({
          id: 'family_default',
          updated_at: new Date().toISOString(),
          members,
          weekly_meals: weeklyMeals,
          weekly_salads: weeklySalads,
          weekly_snacks: weeklySnacks,
          custom_recipes: customRecipes,
          custom_salads: customSalads,
          custom_snacks: customSnacks,
          grocery_checks: groceryChecks,
        });

        if (error) {
          console.warn('Error guardando en Supabase:', error);
          setSyncStatus('offline');
        } else {
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Fallo de red en sync con Supabase:', err);
        setSyncStatus('offline');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [members, weeklyMeals, weeklySalads, weeklySnacks, customRecipes, customSalads, customSnacks, groceryChecks]);

  const activeTargets = useMemo(() => getActiveFamilyTargets(members), [members]);
  const activeMembersCount = Math.max(1, activeTargets.activeCount);

  // Gestión de miembros
  const addMember = (newMemberData: Omit<FamilyMember, 'id'>) => {
    const targets = calculateMemberNutritionalTargets(
      newMemberData.age,
      newMemberData.gender,
      newMemberData.activityLevel,
      newMemberData.isOnDiet,
      newMemberData.dietType
    );

    const newMember: FamilyMember = {
      ...newMemberData,
      id: `mem-${Date.now()}`,
      targetCalories: targets.calories,
      targetProteinG: targets.proteinG,
      targetCarbsG: targets.carbsG,
      targetFatG: targets.fatG,
    };

    setMembers((prev) => [...prev, newMember]);
  };

  const updateMember = (updated: FamilyMember) => {
    const targets = calculateMemberNutritionalTargets(
      updated.age,
      updated.gender,
      updated.activityLevel,
      updated.isOnDiet,
      updated.dietType
    );

    const fullUpdated: FamilyMember = {
      ...updated,
      targetCalories: targets.calories,
      targetProteinG: targets.proteinG,
      targetCarbsG: targets.carbsG,
      targetFatG: targets.fatG,
    };

    setMembers((prev) => prev.map((m) => (m.id === fullUpdated.id ? fullUpdated : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMemberActive = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, activeStatus: !m.activeStatus } : m))
    );
  };

  const generateWeek = () => {
    const newMenu = generateBalancedWeeklyMenu(recipes);
    const newSalads = generateWeeklySalads();
    const newSnacks = generateWeeklySnacks();
    setWeeklyMeals(newMenu);
    setWeeklySalads(newSalads);
    setWeeklySnacks(newSnacks);
  };

  const generateWeekWithAI = async (options: GenerateWithAIOptions) => {
    const res = await generateMenuWithGemini({
      ...options,
      familyMembers: members,
    });

    if (res.success && Object.keys(res.meals).length > 0) {
      setWeeklyMeals(res.meals);
      setWeeklySalads(generateWeeklySalads());
      setWeeklySnacks(generateWeeklySnacks());
    }
    return { success: res.success, message: res.message };
  };

  const swapMeal = (day: DayOfWeek, mealType: MealType, newRecipe: Recipe) => {
    const key = `${day}_${mealType}`;
    setWeeklyMeals((prev) => ({
      ...prev,
      [key]: newRecipe,
    }));
  };

  const swapSalad = (day: DayOfWeek, mealType: MealType, newSalad: FreshSaladSide) => {
    const key = `${day}_${mealType}`;
    setWeeklySalads((prev) => ({
      ...prev,
      [key]: newSalad,
    }));
  };

  const swapSnack = (day: DayOfWeek, newSnack: QuickSnack) => {
    setWeeklySnacks((prev) => ({
      ...prev,
      [day]: newSnack,
    }));
  };

  const addRecipeToCatalog = (recipe: Recipe) => {
    setCustomRecipes((prev) => {
      if (prev.some((r) => r.id === recipe.id || r.title.toLowerCase() === recipe.title.toLowerCase())) {
        return prev;
      }
      return [recipe, ...prev];
    });
  };

  const addSaladToCatalog = (salad: FreshSaladSide) => {
    setCustomSalads((prev) => {
      if (prev.some((s) => s.id === salad.id || s.name.toLowerCase() === salad.name.toLowerCase())) {
        return prev;
      }
      return [salad, ...prev];
    });
  };

  const addSnackToCatalog = (snack: QuickSnack) => {
    setCustomSnacks((prev) => {
      if (prev.some((s) => s.id === snack.id || s.name.toLowerCase() === snack.name.toLowerCase())) {
        return prev;
      }
      return [snack, ...prev];
    });
  };

  const applyFullDayMenu = (day: DayOfWeek, proposal: DayMenuProposal) => {
    setWeeklyMeals((prev) => ({
      ...prev,
      [`${day}_almuerzo`]: proposal.lunch,
      [`${day}_cena`]: proposal.dinner,
    }));
    setWeeklySalads((prev) => ({
      ...prev,
      [`${day}_almuerzo`]: proposal.lunchSalad,
      [`${day}_cena`]: proposal.dinnerSalad,
    }));
    setWeeklySnacks((prev) => ({
      ...prev,
      [day]: proposal.snack,
    }));
  };

  const toggleSnackInGrocery = (snackId: string) => {
    setSelectedSnackIds((prev) =>
      prev.includes(snackId) ? prev.filter((id) => id !== snackId) : [...prev, snackId]
    );
  };

  const getSaladForMeal = (day: DayOfWeek, mealType: MealType): FreshSaladSide => {
    const key = `${day}_${mealType}`;
    return weeklySalads[key] || getMealSaladSide(day, mealType);
  };

  const getSnackForDay = (day: DayOfWeek): QuickSnack => {
    return weeklySnacks[day] || QUICK_SNACKS[0];
  };

  // Generación consolidada y escalada de lista de la compra:
  const groceryItems = useMemo<GroceryItem[]>(() => {
    const itemMap = new Map<string, GroceryItem>();

    const addIngredient = (ing: any, sourceTitle: string, multiplier: number) => {
      const scaledQty = (ing.quantity || 1) * multiplier;
      const normalizedKey = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;

      if (itemMap.has(normalizedKey)) {
        const existing = itemMap.get(normalizedKey)!;
        existing.totalQuantity += scaledQty;
        if (!existing.recipesUsing.includes(sourceTitle)) {
          existing.recipesUsing.push(sourceTitle);
        }
      } else {
        itemMap.set(normalizedKey, {
          id: normalizedKey,
          name: ing.name,
          totalQuantity: scaledQty,
          unit: ing.unit,
          category: ing.category,
          supermarketRef: ing.supermarket_ref,
          checked: !!groceryChecks[normalizedKey],
          recipesUsing: [sourceTitle],
        });
      }
    };

    // 1. Ingredientes de comidas de la semana
    Object.entries(weeklyMeals).forEach(([_slotKey, recipe]) => {
      if (!recipe || !recipe.ingredients) return;
      recipe.ingredients.forEach((ing) => {
        addIngredient(ing, recipe.title, activeMembersCount);
      });
    });

    // 2. Ingredientes de las ensaladas frescas seleccionadas para cada comida diaria (14 comidas)
    DAYS_OF_WEEK.forEach((d) => {
      (['almuerzo', 'cena'] as MealType[]).forEach((mType) => {
        const key = `${d}_${mType}`;
        const salad = weeklySalads[key] || getMealSaladSide(d, mType);
        if (salad && salad.ingredients) {
          salad.ingredients.forEach((ing) => {
            addIngredient(ing, `🥗 ${salad.name}`, activeMembersCount);
          });
        }
      });
    });

    // 3. Ingredientes de los snacks programados diariamente para la semana (7 días)
    DAYS_OF_WEEK.forEach((d) => {
      const snack = weeklySnacks[d];
      if (snack && snack.ingredients) {
        snack.ingredients.forEach((ing) => {
          addIngredient(ing, `🍿 Snack (${d}): ${snack.name}`, 1);
        });
      }
    });

    // 4. Ingredientes de snacks extras seleccionados
    selectedSnackIds.forEach((snackId) => {
      const snack = allSnacks.find((s) => s.id === snackId);
      if (snack && snack.ingredients) {
        snack.ingredients.forEach((ing) => {
          addIngredient(ing, `🍿 Snack extra: ${snack.name}`, 1);
        });
      }
    });

    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [weeklyMeals, weeklySalads, weeklySnacks, activeMembersCount, groceryChecks, selectedSnackIds, allSnacks]);

  const toggleGroceryItem = (id: string) => {
    setGroceryChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetGroceryChecks = () => {
    setGroceryChecks({});
  };

  const isSupabaseConfigured = !!getSupabaseClient();

  return (
    <FamilyMenuContext.Provider
      value={{
        members,
        recipes,
        weeklyMeals,
        weeklySalads,
        weeklySnacks,
        allSalads,
        allSnacks,
        customRecipes,
        customSalads,
        customSnacks,
        activeDay,
        syncStatus,
        setActiveDay,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberActive,
        generateWeek,
        generateWeekWithAI,
        swapMeal,
        swapSalad,
        swapSnack,
        addRecipeToCatalog,
        addSaladToCatalog,
        addSnackToCatalog,
        applyFullDayMenu,
        groceryItems,
        toggleGroceryItem,
        resetGroceryChecks,
        activeTargets,
        activeMembersCount,
        isSupabaseConfigured,
        selectedSnackIds,
        toggleSnackInGrocery,
        getSaladForMeal,
        getSnackForDay,
      }}
    >
      {children}
    </FamilyMenuContext.Provider>
  );
};

export const useFamilyMenu = () => {
  const context = useContext(FamilyMenuContext);
  if (!context) {
    throw new Error('useFamilyMenu debe ser usado dentro de un FamilyMenuProvider');
  }
  return context;
};
