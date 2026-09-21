import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import type { DayOfWeek, FamilyMember, GroceryItem, MealType, Recipe, QuickSnack, FreshSaladSide, OmittableSlot } from '../types';
import { INITIAL_MEMBERS } from '../data/initialMembers';
import { INITIAL_RECIPES } from '../data/initialRecipes';
import { DAILY_FRESH_SIDES, QUICK_SNACKS } from '../data/initialSaladsAndSnacks';
import { generateBalancedWeeklyMenu, generateWeeklySalads, generateWeeklySnacks, getMealSaladSide, DAYS_OF_WEEK } from '../services/menuAlgorithm';
import type { WeeklyMenuCriteria } from '../services/menuAlgorithm';
import { calculateMemberNutritionalTargets, getActiveFamilyTargets } from '../services/nutritionCalculator';
import { generateMenuWithGemini } from '../services/geminiService';
import type { GenerateWithAIOptions, DayMenuProposal } from '../services/geminiService';
import { getSupabaseClient } from '../services/supabaseClient';
import { clearStoredAdminPin } from '../services/adminAuth';

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
  generateWeek: (criteria?: WeeklyMenuCriteria) => void;
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
  getSaladForMeal: (day: DayOfWeek, mealType: MealType) => FreshSaladSide | null;
  getSnackForDay: (day: DayOfWeek) => QuickSnack;
  omittedSlots: Record<string, boolean>;
  toggleOmitSlot: (day: DayOfWeek, slot: OmittableSlot) => void;
  isSlotOmitted: (day: DayOfWeek, slot: OmittableSlot) => boolean;
  restoreAllSlotsForDay: (day: DayOfWeek) => void;
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
const LOCAL_STORAGE_OMITTED_SLOTS = 'familymenu_omitted_slots_v1';

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

  // 11. Slots de comidas, ensaladas o snacks omitidos por día
  const [omittedSlots, setOmittedSlots] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_OMITTED_SLOTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando slots omitidos de localStorage', e);
      }
    }
    return {};
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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_OMITTED_SLOTS, JSON.stringify(omittedSlots));
  }, [omittedSlots]);

  // ==============================================================================
  // SINCRONIZACIÓN EN LA NUBE CON SUPABASE (Bidireccional + Realtime)
  // Permite que cualquier miembro de la familia abra la app desde su móvil
  // y comparta el mismo menú, cambios y lista de la compra en tiempo real.
  // ==============================================================================
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local');
  const isInitialLoad = useRef(true);
  const isIncomingRemoteUpdate = useRef(false);

  // Mantenemos siempre la referencia actualizada al último estado para guardado seguro
  const currentStateRef = useRef({
    members,
    weeklyMeals,
    weeklySalads,
    weeklySnacks,
    customRecipes,
    customSalads,
    customSnacks,
    groceryChecks,
    omittedSlots,
  });

  useEffect(() => {
    currentStateRef.current = {
      members,
      weeklyMeals,
      weeklySalads,
      weeklySnacks,
      customRecipes,
      customSalads,
      customSnacks,
      groceryChecks,
      omittedSlots,
    };
  }, [members, weeklyMeals, weeklySalads, weeklySnacks, customRecipes, customSalads, customSnacks, groceryChecks, omittedSlots]);

  // Función reutilizable para procesar datos que vienen de Supabase (carga inicial o Realtime)
  const applyRemoteState = (data: any) => {
    if (!data) return;
    isIncomingRemoteUpdate.current = true;

    if (data.members && Array.isArray(data.members) && data.members.length > 0) {
      setMembers(data.members);
    }
    if (data.weekly_meals && typeof data.weekly_meals === 'object' && Object.keys(data.weekly_meals).length > 0) {
      setWeeklyMeals(data.weekly_meals);
    }
    if (data.weekly_salads && typeof data.weekly_salads === 'object' && Object.keys(data.weekly_salads).length > 0) {
      setWeeklySalads(data.weekly_salads);
    }
    if (data.weekly_snacks && typeof data.weekly_snacks === 'object' && Object.keys(data.weekly_snacks).length > 0) {
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

    // Extraer checks de la compra y recuperar omitted_slots si venía empaquetado en fallback
    let remoteOmittedSlots = data.omitted_slots;
    if (data.grocery_checks && typeof data.grocery_checks === 'object') {
      const { __meta_omitted_slots, ...cleanChecks } = data.grocery_checks;
      setGroceryChecks(cleanChecks);
      if (!remoteOmittedSlots && __meta_omitted_slots) {
        try {
          remoteOmittedSlots = typeof __meta_omitted_slots === 'string'
            ? JSON.parse(__meta_omitted_slots)
            : __meta_omitted_slots;
        } catch (e) {
          console.warn('Error parseando __meta_omitted_slots:', e);
        }
      }
    }

    if (remoteOmittedSlots && typeof remoteOmittedSlots === 'object') {
      setOmittedSlots(remoteOmittedSlots);
    }

    setSyncStatus('synced');
    setTimeout(() => {
      isIncomingRemoteUpdate.current = false;
      isInitialLoad.current = false;
    }, 250);
  };

  // Función de guardado en Supabase robusta con fallback automático
  const saveToSupabase = async () => {
    if (isInitialLoad.current || isIncomingRemoteUpdate.current) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const state = currentStateRef.current;
    setSyncStatus('syncing');

    const payload: any = {
      id: 'family_default',
      updated_at: new Date().toISOString(),
      members: state.members,
      weekly_meals: state.weeklyMeals,
      weekly_salads: state.weeklySalads,
      weekly_snacks: state.weeklySnacks,
      custom_recipes: state.customRecipes,
      custom_salads: state.customSalads,
      custom_snacks: state.customSnacks,
      grocery_checks: state.groceryChecks,
      omitted_slots: state.omittedSlots,
    };

    try {
      let { error } = await supabase.from('family_sync').upsert(payload);

      // Si falla porque la columna omitted_slots no existe en Supabase (error PGRST204),
      // reintentamos automáticamente sin la columna y empaquetamos omitted_slots en grocery_checks
      if (error && (error.code === 'PGRST204' || error.message?.includes('omitted_slots'))) {
        console.warn('Columna omitted_slots no detectada en Supabase, aplicando guardado compatible...');
        const fallbackPayload = { ...payload };
        delete fallbackPayload.omitted_slots;
        fallbackPayload.grocery_checks = {
          ...state.groceryChecks,
          __meta_omitted_slots: state.omittedSlots,
        };
        const retry = await supabase.from('family_sync').upsert(fallbackPayload);
        error = retry.error;
      }

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
  };

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
          applyRemoteState(data);
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
          if (payload.new) {
            applyRemoteState(payload.new);
          }
        }
      )
      .subscribe();

    // Guardar inmediatamente si el usuario minimiza la pestaña o cierra la ventana
    const handleFlushSync = () => {
      saveToSupabase();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleFlushSync();
      }
    };

    window.addEventListener('beforeunload', handleFlushSync);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('beforeunload', handleFlushSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 2. Subir cambios automáticamente a Supabase cuando el usuario modifica platos, miembros o compra
  useEffect(() => {
    if (isInitialLoad.current || isIncomingRemoteUpdate.current) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setSyncStatus('syncing');
    const timer = setTimeout(() => {
      saveToSupabase();
    }, 500);

    return () => clearTimeout(timer);
  }, [members, weeklyMeals, weeklySalads, weeklySnacks, customRecipes, customSalads, customSnacks, groceryChecks, omittedSlots]);

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
    const memberToDelete = members.find((m) => m.id === id);
    const nextMembers = members.filter((m) => m.id !== id);
    setMembers(nextMembers);

    if (memberToDelete?.isAdmin) {
      const remainingAdmins = nextMembers.filter((m) => m.isAdmin);
      if (remainingAdmins.length === 0) {
        clearStoredAdminPin();
      }
    }
  };

  const toggleMemberActive = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, activeStatus: !m.activeStatus } : m))
    );
  };

  const generateWeek = (criteria?: WeeklyMenuCriteria) => {
    const newMenu = generateBalancedWeeklyMenu(recipes, criteria);
    const newSalads = generateWeeklySalads();
    const newSnacks = generateWeeklySnacks();
    setWeeklyMeals(newMenu);
    setWeeklySalads(newSalads);
    setWeeklySnacks(newSnacks);
    setOmittedSlots({});
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
      setOmittedSlots({});
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
    }));
    setWeeklySnacks((prev) => ({
      ...prev,
      [day]: proposal.snack,
    }));
  };

  const toggleOmitSlot = (day: DayOfWeek, slot: OmittableSlot) => {
    const key = `${day}_${slot}`;
    setOmittedSlots((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  };

  const isSlotOmitted = (day: DayOfWeek, slot: OmittableSlot): boolean => {
    return !!omittedSlots[`${day}_${slot}`];
  };

  const restoreAllSlotsForDay = (day: DayOfWeek) => {
    setOmittedSlots((prev) => {
      const next = { ...prev };
      delete next[`${day}_almuerzo`];
      delete next[`${day}_cena`];
      delete next[`${day}_ensalada`];
      delete next[`${day}_snack`];
      return next;
    });
  };

  const toggleSnackInGrocery = (snackId: string) => {
    setSelectedSnackIds((prev) =>
      prev.includes(snackId) ? prev.filter((id) => id !== snackId) : [...prev, snackId]
    );
  };

  const getSaladForMeal = (day: DayOfWeek, mealType: MealType): FreshSaladSide | null => {
    if (mealType === 'cena') return null;
    const key = `${day}_${mealType}`;
    return weeklySalads[key] || getMealSaladSide(day, mealType);
  };

  const getSnackForDay = (day: DayOfWeek): QuickSnack => {
    return weeklySnacks[day] || QUICK_SNACKS[0];
  };

  // Generación consolidada y escalada de lista de la compra con clasificación por días y platos:
  const groceryItems = useMemo<GroceryItem[]>(() => {
    const itemMap = new Map<string, GroceryItem>();

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const addIngredient = (
      ing: any,
      sourceTitle: string,
      multiplier: number,
      day: DayOfWeek,
      mealType?: MealType | 'snack',
      customLabel?: string
    ) => {
      const scaledQty = (ing.quantity || 1) * multiplier;
      const normalizedKey = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
      const usageLabel = customLabel || sourceTitle;

      if (itemMap.has(normalizedKey)) {
        const existing = itemMap.get(normalizedKey)!;
        existing.totalQuantity += scaledQty;
        if (!existing.recipesUsing.includes(sourceTitle)) {
          existing.recipesUsing.push(sourceTitle);
        }
        if (!existing.days.includes(day)) {
          existing.days.push(day);
        }
        if (!existing.usages.some((u) => u.label === usageLabel)) {
          existing.usages.push({
            day,
            mealType,
            recipeTitle: sourceTitle,
            label: usageLabel,
          });
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
          days: [day],
          usages: [
            {
              day,
              mealType,
              recipeTitle: sourceTitle,
              label: usageLabel,
            },
          ],
        });
      }
    };

    // 1. Ingredientes de comidas de la semana (Almuerzos y Cenas, excluyendo slots omitidos)
    Object.entries(weeklyMeals).forEach(([slotKey, recipe]) => {
      if (!recipe || !recipe.ingredients) return;
      const parts = slotKey.split('_');
      const day = parts[0] as DayOfWeek;
      const mealType = parts[1] as MealType;

      // Si el slot está omitido por el usuario, saltar
      if (omittedSlots[`${day}_${mealType}`]) return;

      const dayLabel = capitalize(day);
      const mealLabel = mealType === 'almuerzo' ? 'Almuerzo' : 'Cena';

      recipe.ingredients.forEach((ing) => {
        addIngredient(
          ing,
          recipe.title,
          activeMembersCount,
          day,
          mealType,
          `${dayLabel} • ${mealLabel}: ${recipe.title}`
        );
      });
    });

    // 2. Ingredientes de las ensaladas frescas seleccionadas ÚNICAMENTE para el almuerzo
    DAYS_OF_WEEK.forEach((d) => {
      // Las ensaladas solo se consumen en el almuerzo. Si el almuerzo o la ensalada están omitidos, saltar
      if (omittedSlots[`${d}_almuerzo`] || omittedSlots[`${d}_ensalada`]) return;

      const key = `${d}_almuerzo`;
      const salad = weeklySalads[key] || getMealSaladSide(d, 'almuerzo');
      if (salad && salad.ingredients) {
        const dayLabel = capitalize(d);
        salad.ingredients.forEach((ing) => {
          addIngredient(
            ing,
            `🥗 ${salad.name}`,
            activeMembersCount,
            d,
            'almuerzo',
            `${dayLabel} • Ensalada Almuerzo: ${salad.name}`
          );
        });
      }
    });

    // 3. Ingredientes de los snacks programados diariamente para la semana (7 días, excluyendo omitidos)
    DAYS_OF_WEEK.forEach((d) => {
      if (omittedSlots[`${d}_snack`]) return;

      const snack = weeklySnacks[d];
      if (snack && snack.ingredients) {
        const dayLabel = capitalize(d);
        snack.ingredients.forEach((ing) => {
          addIngredient(
            ing,
            `🍿 Snack: ${snack.name}`,
            1,
            d,
            'snack',
            `${dayLabel} • Snack: ${snack.name}`
          );
        });
      }
    });

    // 4. Ingredientes de snacks extras seleccionados
    selectedSnackIds.forEach((snackId) => {
      const snack = allSnacks.find((s) => s.id === snackId);
      if (snack && snack.ingredients) {
        snack.ingredients.forEach((ing) => {
          addIngredient(
            ing,
            `🍿 Snack extra: ${snack.name}`,
            1,
            'lunes',
            'snack',
            `Snack extra: ${snack.name}`
          );
        });
      }
    });

    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [weeklyMeals, weeklySalads, weeklySnacks, activeMembersCount, groceryChecks, selectedSnackIds, allSnacks, omittedSlots]);

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
        omittedSlots,
        toggleOmitSlot,
        isSlotOmitted,
        restoreAllSlotsForDay,
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
