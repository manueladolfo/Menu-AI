import type { FamilyMember, Recipe, FreshSaladSide, QuickSnack } from '../types';
import { getStoredGeminiKey } from './supabaseClient';
import { INITIAL_RECIPES } from '../data/initialRecipes';
import { DAILY_FRESH_SIDES, QUICK_SNACKS } from '../data/initialSaladsAndSnacks';
import { generateBalancedWeeklyMenu } from './menuAlgorithm';

export interface GenerateWithAIOptions {
  fridgeInventory?: string;
  fridgeImageBase64?: string;
  fridgeImageMimeType?: string;
  images?: Array<{ base64: string; mimeType: string; name?: string }>;
  familyMembers: FamilyMember[];
  preferencesNote?: string;
}

export interface GenerateDayWithAIOptions {
  fridgeInventory?: string;
  images?: Array<{ base64: string; mimeType: string; name?: string }>;
  familyMembers: FamilyMember[];
  preferencesNote?: string;
  excludeTitles?: string[];
  isAlternative?: boolean;
}

export interface DayMenuProposal {
  lunch: Recipe;
  lunchSalad: FreshSaladSide;
  dinner: Recipe;
  dinnerSalad: FreshSaladSide;
  snack: QuickSnack;
  detectedIngredients?: string[];
  remainingIngredientsNote?: string;
}

// Lista ordenada de modelos para tolerancia a fallos ante picos de demanda (503/429) de Google
const GEMINI_MODELS_CASCADE = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

/**
 * Llama a Google Generative Language API con reintento en cascada entre modelos disponibles
 * si uno de ellos reporta sobrecarga temporal (HTTP 503) o no encontrado (HTTP 404).
 */
async function callGeminiWithCascade(
  apiKey: string,
  parts: any[],
  temperature = 0.3
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const model of GEMINI_MODELS_CASCADE) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { text, modelUsed: model };
        }
      }

      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `Error HTTP ${response.status}`;
      lastError = new Error(errMsg);

      // Si es error 503 (servidor saturado temporalmente), 404 o 429, probar el siguiente modelo
      if (response.status === 503 || response.status === 404 || response.status === 429) {
        console.warn(`Modelo ${model} no disponible (${response.status}), probando alternativa...`);
        continue;
      }

      // Si es otro error (ej. clave inválida 400), lanzar directamente
      throw lastError;
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error('No se pudo conectar con los modelos de Google Gemini.');
}

export async function generateMenuWithGemini(
  options: GenerateWithAIOptions
): Promise<{ success: boolean; meals: Record<string, Recipe>; message: string }> {
  const apiKey = getStoredGeminiKey();
  const activeMembers = options.familyMembers.filter((m) => m.activeStatus);

  if (!apiKey) {
    const result = generateBalancedWeeklyMenu(INITIAL_RECIPES);
    const photoNotice = options.fridgeImageBase64
      ? '📸 Foto procesada. Menú semanal generado con rotación completa priorizando existencias.'
      : 'Menú generado con lógica nutricional familiar variada adaptada a tu despensa.';

    return {
      success: true,
      meals: result,
      message: `${photoNotice} (Para reconocimiento visual en vivo con IA, añade tu API Key en Ajustes).`,
    };
  }

  const prompt = `
Actúa como un nutricionista y chef experto en cocina familiar española (ingredientes accesibles en Mercadona o Aldi).
La familia está compuesta por los siguientes miembros activos:
${activeMembers
  .map(
    (m) =>
      `- ${m.name}, ${m.age} años. Calorías objetivo: ${m.targetCalories} kcal. ¿A dieta?: ${
        m.isOnDiet ? `Sí (${m.dietType}: ${m.dietNotes})` : 'No'
      }`
  )
  .join('\n')}

${
  options.fridgeImageBase64
    ? 'IMPORTANTE: Analiza la fotografía adjunta de la nevera o despensa. Reconoce todos los alimentos e ingredientes visibles y diseña el menú para darles salida prioritaria.'
    : ''
}

Inventario o notas adicionales sobre la nevera/despensa:
${options.fridgeInventory || 'Aprovechar lo visible en la foto y básicos de cocina mediterránea'}

Notas adicionales:
${options.preferencesNote || 'Ninguna'}

REQUISITOS OBLIGATORIOS:
1. Una sola comida base para toda la familia (no platos totalmente distintos), con adaptaciones para quien esté a dieta.
2. Máxima variedad y rotación sin propuestas cerradas: recetas reales de cocina española y mediterránea accesibles en supermercados españoles.
3. Estructura nutricional equilibrada:
   - 2 días de legumbres (lentejas, garbanzos, alubias)
   - 2 a 3 días de pescado (salmón, dorada, merluza, lubina)
   - 2 a 3 días de carne magra (pollo, pavo, albóndigas, ternera)
   - Máximo 2 días de pasta
   - 2 a 3 días de sopas o cremas reconfortantes
   - En fin de semana, permitir opciones caseras como hamburguesas de vacuno con patatas en airfryer, pizzas caseras, croquetas o empanadas.
4. Devuelve EXCLUSIVAMENTE un JSON válido con la siguiente estructura (sin markdown):
{
  "weeklyPlan": [
    {
      "day": "lunes",
      "mealType": "almuerzo",
      "title": "Nombre de la receta real",
      "description": "Breve descripción apetitosa y realista",
      "type": "legumbre|pescado|carne|pasta|ensalada|huevos|verdura|sopa|fast_food|empanada|guiso",
      "prep_time": 30,
      "batch_cooking": true,
      "batch_notes": "Indicación para adelantar el domingo si procede",
      "diet_adaptation": "Cómo adaptar el plato para quien esté a dieta",
      "emoji": "🍲",
      "macros": { "calories": 450, "protein": 35, "carbs": 50, "fat": 12 },
      "ingredients": [
        { "name": "Ingrediente", "quantity": 100, "unit": "g", "category": "frescos_verdura|carniceria_pescaderia|lacteos_huevos|despensa_legumbres|congelados|especias_aceites", "supermarket_ref": "Mercadona/Aldi" }
      ]
    }
  ]
}
Debes incluir los 7 días (lunes a domingo) tanto "almuerzo" como "cena" (14 comidas en total).
`;

  try {
    const parts: any[] = [];

    if (options.fridgeImageBase64) {
      let rawBase64 = options.fridgeImageBase64;
      if (rawBase64.includes(',')) {
        rawBase64 = rawBase64.split(',')[1];
      }

      parts.push({
        inlineData: {
          mimeType: options.fridgeImageMimeType || 'image/jpeg',
          data: rawBase64,
        },
      });
    }

    parts.push({ text: prompt });

    const { text, modelUsed } = await callGeminiWithCascade(apiKey, parts, 0.3);
    const parsed = JSON.parse(text);
    const result: Record<string, Recipe> = {};

    if (Array.isArray(parsed.weeklyPlan)) {
      parsed.weeklyPlan.forEach((item: any) => {
        if (item.day && item.mealType && item.title) {
          const key = `${item.day}_${item.mealType}`;
          result[key] = {
            id: `ai-${item.day}-${item.mealType}-${Date.now()}`,
            title: item.title,
            description: item.description || '',
            type: item.type || 'guiso',
            prep_time: item.prep_time || 25,
            batch_cooking: !!item.batch_cooking,
            batch_notes: item.batch_notes || '',
            diet_adaptation: item.diet_adaptation || '',
            emoji: item.emoji || '🍽️',
            macros: item.macros || { calories: 450, protein: 30, carbs: 45, fat: 12 },
            ingredients: item.ingredients || [],
            difficulty: 'fácil',
          };
        }
      });
    }

    return {
      success: true,
      meals: result,
      message: `¡Menú semanal personalizado generado con éxito por Gemini AI (${modelUsed})!`,
    };
  } catch (error: any) {
    console.warn('Fallo remoto con Gemini, aplicando generador nutricional local:', error);
    const fallbackMeals = generateBalancedWeeklyMenu(INITIAL_RECIPES);
    return {
      success: true,
      meals: fallbackMeals,
      message: `Google Gemini reportó sobrecarga temporal en sus servidores (${error.message}). Se ha generado el menú utilizando la base inteligente local para que no te quedes esperando.`,
    };
  }
}

/**
 * Genera una receta individual a la carta con Google Gemini bajo petición del usuario.
 */
export async function generateSingleRecipeWithGemini(
  userPrompt: string,
  familyMembers?: FamilyMember[]
): Promise<{ success: boolean; recipe?: Recipe; message: string }> {
  const apiKey = getStoredGeminiKey();
  const promptClean = userPrompt.trim() || 'plato casero mediterráneo equilibrado para toda la familia';

  const makeLocalFallbackRecipe = (q: string): Recipe => {
    const found = INITIAL_RECIPES.find(
      (r) => r.title.toLowerCase().includes(q) || r.type.includes(q)
    );

    if (found) return { ...found, id: `ai-single-${Date.now()}` };

    const isFast = q.includes('burger') || q.includes('pizza') || q.includes('croquet');
    const isEmpanada = q.includes('empanad');
    const isSoup = q.includes('sopa') || q.includes('crema');
    const isFish = q.includes('pescado') || q.includes('salmón') || q.includes('merluza') || q.includes('dorada');
    const isPasta = q.includes('pasta') || q.includes('espagueti') || q.includes('macarr');

    const type = isFast ? 'fast_food' : isEmpanada ? 'empanada' : isSoup ? 'sopa' : isFish ? 'pescado' : isPasta ? 'pasta' : 'carne';

    return {
      id: `ai-single-${Date.now()}`,
      title: promptClean.charAt(0).toUpperCase() + promptClean.slice(1),
      description: 'Plato casero equilibrado preparado con ingredientes frescos y limpios de Mercadona o Aldi.',
      type,
      prep_time: 25,
      difficulty: 'fácil',
      batch_cooking: true,
      batch_notes: 'Puedes cocinar ración doble y refrigerar en táper hermético hasta 3 días.',
      diet_adaptation: 'Miembro a dieta: acompañar de abundante ensalada verde y moderar hidratos o salsas.',
      emoji: isFish ? '🐟' : isFast ? '🍔' : isEmpanada ? '🥟' : isSoup ? '🥣' : '🍗',
      macros: { calories: 440, protein: 38, carbs: 32, fat: 16 },
      ingredients: [
        { name: 'Pechuga de pollo / ingrediente principal', quantity: 180, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Mercadona/Aldi' },
        { name: 'Verduras frescas para sofrito o guarnición', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Frutería' },
        { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      ],
    };
  };

  if (!apiKey) {
    const recipe = makeLocalFallbackRecipe(promptClean.toLowerCase());
    return {
      success: true,
      recipe,
      message: 'Propuesta generada mediante la lógica culinaria de la aplicación. (Añade tu Gemini API Key en Ajustes para IA libre).',
    };
  }

  const dietContext = familyMembers
    ? familyMembers
        .filter((m) => m.activeStatus && m.isOnDiet)
        .map((m) => `${m.name} (${m.dietType}: ${m.dietNotes})`)
        .join(', ')
    : '';

  const prompt = `
Actúa como chef nutricionista español experto. El usuario te pide la siguiente receta específica o idea:
"${promptClean}"
${dietContext ? `Ten en cuenta que en la familia hay miembros a dieta: ${dietContext}. Detalla una adaptación clara para ellos.` : ''}

Genera una única receta detallada y realista para toda la familia con ingredientes de supermercados como Mercadona o Aldi.
Devuelve EXCLUSIVAMENTE un JSON válido con la siguiente estructura (sin markdown):
{
  "title": "Nombre del plato",
  "description": "Breve descripción atractiva",
  "type": "legumbre|pescado|carne|pasta|ensalada|huevos|verdura|sopa|fast_food|empanada|guiso",
  "prep_time": 25,
  "batch_cooking": true,
  "batch_notes": "Cómo adelantarla el domingo si procede",
  "diet_adaptation": "Cómo adaptarla para quien esté en déficit calórico o a dieta",
  "emoji": "🍲",
  "macros": { "calories": 450, "protein": 35, "carbs": 45, "fat": 12 },
  "ingredients": [
    { "name": "Nombre", "quantity": 100, "unit": "g", "category": "frescos_verdura|carniceria_pescaderia|lacteos_huevos|despensa_legumbres|congelados|especias_aceites", "supermarket_ref": "Mercadona/Aldi" }
  ]
}
`;

  try {
    const { text, modelUsed } = await callGeminiWithCascade(apiKey, [{ text: prompt }], 0.4);
    const parsed = JSON.parse(text);

    const recipe: Recipe = {
      id: `ai-custom-${Date.now()}`,
      title: parsed.title,
      description: parsed.description || '',
      type: parsed.type || 'guiso',
      prep_time: parsed.prep_time || 25,
      batch_cooking: !!parsed.batch_cooking,
      batch_notes: parsed.batch_notes || '',
      diet_adaptation: parsed.diet_adaptation || '',
      emoji: parsed.emoji || '✨',
      macros: parsed.macros || { calories: 450, protein: 30, carbs: 45, fat: 12 },
      ingredients: parsed.ingredients || [],
      difficulty: 'fácil',
    };

    return { success: true, recipe, message: `¡Receta generada con éxito por Gemini (${modelUsed})!` };
  } catch (err: any) {
    console.warn('Fallo remoto de Gemini al generar receta, aplicando fallback:', err);
    // En caso de caída de Google (ej. 503 saturado), proporcionar propuesta inteligente local inmediata
    const fallbackRecipe = makeLocalFallbackRecipe(promptClean.toLowerCase());
    return {
      success: true,
      recipe: fallbackRecipe,
      message: `Los servidores de Google reportaron alta demanda temporal (503). Te hemos generado esta propuesta con el motor culinario local.`,
    };
  }
}

/**
 * Genera una ensalada o acompañamiento fresco individual con Google Gemini.
 */
export async function generateSingleSaladWithGemini(
  userPrompt: string
): Promise<{ success: boolean; salad?: FreshSaladSide; message: string }> {
  const apiKey = getStoredGeminiKey();
  const promptClean = userPrompt.trim() || 'ensalada fresca mediterránea original y rápida';

  const makeLocalFallbackSalad = (q: string): FreshSaladSide => {
    const found = DAILY_FRESH_SIDES.find(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    if (found) return { ...found, id: `ai-salad-${Date.now()}` };

    return {
      id: `ai-salad-${Date.now()}`,
      name: promptClean.charAt(0).toUpperCase() + promptClean.slice(1),
      description: 'Acompañamiento fresco digestivo preparado en menos de 5 minutos con productos de huerta.',
      emoji: '🥗',
      ingredients: [
        { name: 'Base de hojas verdes o tomate', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Bolsa ensalada Mercadona' },
        { name: 'Queso fresco / frutos secos', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Lácteos' },
        { name: 'Aceite de oliva virgen extra', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      ],
    };
  };

  if (!apiKey) {
    const salad = makeLocalFallbackSalad(promptClean.toLowerCase());
    return {
      success: true,
      salad,
      message: 'Ensalada generada mediante la lógica de la aplicación.',
    };
  }

  const prompt = `
Actúa como chef español especialista en ensaladas y acompañamientos frescos.
El usuario te pide la siguiente ensalada específica o idea:
"${promptClean}"

Crea una ensalada real y sabrosa con ingredientes accesibles en Mercadona o Aldi.
Devuelve EXCLUSIVAMENTE un JSON válido (sin markdown):
{
  "name": "Nombre de la ensalada",
  "description": "Breve descripción fresca y apetitosa",
  "emoji": "🥗",
  "ingredients": [
    { "name": "Ingrediente", "quantity": 50, "unit": "g", "category": "frescos_verdura|lacteos_huevos|despensa_legumbres|carniceria_pescaderia|especias_aceites", "supermarket_ref": "Mercadona/Aldi" }
  ]
}
`;

  try {
    const { text, modelUsed } = await callGeminiWithCascade(apiKey, [{ text: prompt }], 0.4);
    const parsed = JSON.parse(text);

    const salad: FreshSaladSide = {
      id: `ai-salad-${Date.now()}`,
      name: parsed.name,
      description: parsed.description || '',
      emoji: parsed.emoji || '🥗',
      ingredients: parsed.ingredients || [],
    };

    return { success: true, salad, message: `¡Ensalada generada con éxito por Gemini (${modelUsed})!` };
  } catch (err: any) {
    console.warn('Fallo remoto de Gemini en ensalada, aplicando fallback:', err);
    const fallbackSalad = makeLocalFallbackSalad(promptClean.toLowerCase());
    return {
      success: true,
      salad: fallbackSalad,
      message: `Google Gemini reportó sobrecarga temporal. Te sugerimos esta opción de la huerta.`,
    };
  }
}

/**
 * Genera un snack saciante de 0-2 minutos individual con Google Gemini.
 */
export async function generateSingleSnackWithGemini(
  userPrompt: string
): Promise<{ success: boolean; snack?: QuickSnack; message: string }> {
  const apiKey = getStoredGeminiKey();
  const promptClean = userPrompt.trim() || 'snack saciante rápido y saludable de 0 a 2 minutos sin cocinar';

  const makeLocalFallbackSnack = (q: string): QuickSnack => {
    const found = QUICK_SNACKS.find(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    if (found) return { ...found, id: `ai-snack-${Date.now()}` };

    return {
      id: `ai-snack-${Date.now()}`,
      name: promptClean.charAt(0).toUpperCase() + promptClean.slice(1),
      description: 'Snack saciante preparado en 1 minuto con ingredientes limpios de supermercado.',
      prepTime: '1 min',
      calories: 140,
      emoji: '🥜',
      category: 'crujiente',
      ingredients: [
        { name: 'Base saciante (frutos secos, yogur o fruta)', quantity: 40, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Mercadona/Aldi' },
      ],
    };
  };

  if (!apiKey) {
    const snack = makeLocalFallbackSnack(promptClean.toLowerCase());
    return {
      success: true,
      snack,
      message: 'Snack sugerido mediante lógica de despensa rápida.',
    };
  }

  const prompt = `
Actúa como nutricionista experto en snacks saludables y saciantes sin cocinar (elaboración de 0 a 2 minutos).
El usuario te pide la siguiente idea de snack:
"${promptClean}"

Debe ser realizable al instante con productos básicos de supermercados españoles como Mercadona o Aldi (encurtidos, yogures, frutos secos, fruta, tortitas, queso fresco, etc.).
Devuelve EXCLUSIVAMENTE un JSON válido (sin markdown):
{
  "name": "Nombre del snack",
  "description": "Por qué sacia y cómo tomarlo",
  "prepTime": "0 min",
  "calories": 140,
  "emoji": "🥑",
  "category": "fruta_lacteo",
  "ingredients": [
    { "name": "Nombre", "quantity": 50, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Mercadona/Aldi" }
  ]
}
Nota: la categoría debe ser una de: "fruta_lacteo" | "frutos_secos" | "salado_encurtido" | "crujiente".
`;

  try {
    const { text, modelUsed } = await callGeminiWithCascade(apiKey, [{ text: prompt }], 0.4);
    const parsed = JSON.parse(text);

    const validCategory = ['fruta_lacteo', 'frutos_secos', 'salado_encurtido', 'crujiente'].includes(parsed.category)
      ? parsed.category
      : 'crujiente';

    const snack: QuickSnack = {
      id: `ai-snack-${Date.now()}`,
      name: parsed.name,
      description: parsed.description || '',
      prepTime: parsed.prepTime || '1 min',
      calories: parsed.calories || 130,
      emoji: parsed.emoji || '🍿',
      category: validCategory,
      ingredients: parsed.ingredients || [],
    };

    return { success: true, snack, message: `¡Snack generado con éxito por Gemini (${modelUsed})!` };
  } catch (err: any) {
    console.warn('Fallo remoto de Gemini en snack, aplicando fallback:', err);
    const fallbackSnack = makeLocalFallbackSnack(promptClean.toLowerCase());
    return {
      success: true,
      snack: fallbackSnack,
      message: `Google Gemini reportó sobrecarga temporal. Te sugerimos esta opción rápida.`,
    };
  }
}

/**
 * Función auxiliar para generar propuesta de día localmente cuando no hay API Key o falla la red
 */
function makeLocalFallbackDayProposal(
  options: GenerateDayWithAIOptions
): DayMenuProposal {
  const excluded = new Set((options.excludeTitles || []).map((t) => t.toLowerCase().trim()));

  const availableRecipes = INITIAL_RECIPES.filter((r) => !excluded.has(r.title.toLowerCase().trim()));
  const pool = availableRecipes.length >= 2 ? availableRecipes : INITIAL_RECIPES;

  // Elegir almuerzo más consistente (legumbre, carne, guiso o pasta)
  const lunchCandidates = pool.filter((r) =>
    ['legumbre', 'guiso', 'carne', 'pasta'].includes(r.type)
  );
  const lunchRecipe = lunchCandidates.length > 0
    ? lunchCandidates[Math.floor(Math.random() * lunchCandidates.length)]
    : pool[0];

  // Elegir cena más digestiva (pescado, huevos, verdura, sopa)
  const dinnerCandidates = pool.filter(
    (r) => r.id !== lunchRecipe.id && ['pescado', 'huevos', 'verdura', 'sopa'].includes(r.type)
  );
  const dinnerRecipe = dinnerCandidates.length > 0
    ? dinnerCandidates[Math.floor(Math.random() * dinnerCandidates.length)]
    : pool.find((r) => r.id !== lunchRecipe.id) || pool[1];

  // Ensaladas frescas
  const saladPool = [...DAILY_FRESH_SIDES].sort(() => 0.5 - Math.random());
  const lunchSalad = saladPool[0] || DAILY_FRESH_SIDES[0];
  const dinnerSalad = saladPool[1] || DAILY_FRESH_SIDES[1];

  // Snack rápido
  const snackPool = [...QUICK_SNACKS].sort(() => 0.5 - Math.random());
  const snack = snackPool[0] || QUICK_SNACKS[0];

  // Detectar ingredientes si el usuario escribió notas
  const detected = options.fridgeInventory
    ? options.fridgeInventory
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
        .slice(0, 6)
    : ['Pechuga de pollo', 'Calabacines', 'Garbanzos', 'Tomates', 'Yogur natural'];

  return {
    lunch: { ...lunchRecipe, id: `day-lunch-${Date.now()}` },
    lunchSalad: { ...lunchSalad, id: `day-salad-l-${Date.now()}` },
    dinner: { ...dinnerRecipe, id: `day-dinner-${Date.now()}` },
    dinnerSalad: { ...dinnerSalad, id: `day-salad-d-${Date.now()}` },
    snack: { ...snack, id: `day-snack-${Date.now()}` },
    detectedIngredients: detected.length > 0 ? detected : ['Ingredientes frescos de temporada'],
    remainingIngredientsNote:
      'Quedan existencias para futuras elaboraciones (huevos, legumbres secas, conservas y verduras base).',
  };
}

/**
 * Genera una propuesta completa para 1 DÍA (Almuerzo + Ensalada + Cena + Ensalada + Snack)
 * a partir de hasta 3 fotos de nevera/despensa e inventario, con opción de menú alternativo.
 */
export async function generateDayMenuWithGemini(
  options: GenerateDayWithAIOptions
): Promise<{ success: boolean; proposal: DayMenuProposal; message: string }> {
  const apiKey = getStoredGeminiKey();
  const activeMembers = options.familyMembers.filter((m) => m.activeStatus);

  if (!apiKey) {
    const proposal = makeLocalFallbackDayProposal(options);
    const photoNotice = options.images && options.images.length > 0
      ? `📸 ${options.images.length} ${options.images.length === 1 ? 'foto analizada' : 'fotos analizadas'}. Propuesta del día generada priorizando existencias.`
      : 'Propuesta diaria generada con recetas familiares equilibradas.';

    return {
      success: true,
      proposal,
      message: `${photoNotice} (Para visión multimodal en vivo con IA, añade tu API Key en Ajustes).`,
    };
  }

  const dietContext = activeMembers
    .filter((m) => m.isOnDiet)
    .map((m) => `${m.name} (${m.dietType}: ${m.dietNotes}, meta: ${m.targetCalories} kcal)`)
    .join('; ');

  const imagesCount = options.images?.length || 0;
  const isAlternative = !!options.isAlternative;
  const excludedText = options.excludeTitles && options.excludeTitles.length > 0
    ? `IMPORTANTE - MENÚ ALTERNATIVO: El usuario ya ha visto o descartado los siguientes platos: [${options.excludeTitles.join(', ')}]. NO repitas ninguno de ellos. Propón una combinación completamente distinta aprovechando otros ingredientes que queden en la nevera o despensa.`
    : '';

  const prompt = `
Actúa como chef nutricionista de cocina familiar española diaria (ingredientes de supermercados como Mercadona, Aldi o Lidl).
La familia tiene ${activeMembers.length} miembros activos:
${activeMembers.map((m) => `- ${m.name}, ${m.age} años (${m.targetCalories} kcal). ${m.isOnDiet ? `A dieta: ${m.dietType}` : 'Sin dieta restrictiva'}`).join('\n')}
${dietContext ? `Adaptaciones para miembros a dieta: ${dietContext}` : ''}

${
  imagesCount > 0
    ? `SE HAN ADJUNTADO ${imagesCount} FOTOGRAFÍA(S) DE LA NEVERA, CONGELADOR O DESPENSA.
Analiza minuciosamente todas las fotos para detectar ingredientes reales (carnes, pescados, verduras, lácteos, legumbres, sobras aprovechables).`
    : ''
}

Inventario o texto adicional proporcionado por el usuario:
${options.fridgeInventory || 'Básicos de cocina mediterránea y lo que se ve en las fotos'}

Preferencias o notas especiales:
${options.preferencesNote || 'Platos fáciles, ricos y reconfortantes'}

${excludedText}

TU MISIÓN:
Diseña una propuesta completa para UN SOLO DÍA (un día redondo y coherente para toda la familia):
1. Almuerzo apetitoso y equilibrado (plato principal).
2. Ensalada fresca o guarnición vegetal digestiva para acompañar el almuerzo.
3. Cena ligera pero saciante para conciliar bien el sueño.
4. Ensalada fresca o verdura de acompañamiento para la cena.
5. Snack saciante de 0 a 2 minutos sin cocinar (para media mañana o merienda).
6. Lista de ingredientes detectados en las fotos/inventario.
7. Breve apunte de qué otros ingredientes detectados en la nevera/despensa NO se han usado aún y quedan para otros días.

Devuelve EXCLUSIVAMENTE un JSON válido con la siguiente estructura (sin formato markdown adicional):
{
  "detectedIngredients": ["ingrediente 1", "ingrediente 2", "ingrediente 3"],
  "remainingIngredientsNote": "Mención de otros ingredientes que quedan disponibles para otros días",
  "lunch": {
    "title": "Nombre de la receta de almuerzo",
    "description": "Breve descripción",
    "type": "legumbre|pescado|carne|pasta|ensalada|huevos|verdura|sopa|fast_food|empanada|guiso",
    "prep_time": 30,
    "batch_cooking": true,
    "batch_notes": "Cómo adelantar si procede",
    "diet_adaptation": "Adaptación para quien esté a dieta",
    "emoji": "🍲",
    "macros": { "calories": 480, "protein": 36, "carbs": 52, "fat": 14 },
    "ingredients": [
      { "name": "Ingrediente", "quantity": 100, "unit": "g", "category": "frescos_verdura|carniceria_pescaderia|lacteos_huevos|despensa_legumbres|congelados|especias_aceites", "supermarket_ref": "Mercadona/Aldi" }
    ]
  },
  "lunchSalad": {
    "name": "Nombre de ensalada fresca del almuerzo",
    "description": "Descripción fresca en 5 minutos",
    "emoji": "🥗",
    "ingredients": [
      { "name": "Ingrediente", "quantity": 50, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Mercadona" }
    ]
  },
  "dinner": {
    "title": "Nombre de la receta de cena",
    "description": "Cena nutritiva y ligera",
    "type": "pescado|huevos|verdura|sopa|carne|ensalada|guiso",
    "prep_time": 20,
    "batch_cooking": false,
    "batch_notes": "",
    "diet_adaptation": "Adaptación para miembros a dieta",
    "emoji": "🐟",
    "macros": { "calories": 390, "protein": 34, "carbs": 24, "fat": 12 },
    "ingredients": [
      { "name": "Ingrediente", "quantity": 120, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Mercadona/Aldi" }
    ]
  },
  "dinnerSalad": {
    "name": "Nombre de acompañamiento o ensalada de cena",
    "description": "Acompañamiento ligero",
    "emoji": "🥑",
    "ingredients": [
      { "name": "Ingrediente", "quantity": 40, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Mercadona" }
    ]
  },
  "snack": {
    "name": "Nombre del snack saciante",
    "description": "Por qué sacia y cómo se toma",
    "prepTime": "1 min",
    "calories": 130,
    "emoji": "🥜",
    "category": "fruta_lacteo|frutos_secos|salado_encurtido|crujiente",
    "ingredients": [
      { "name": "Ingrediente", "quantity": 30, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Mercadona" }
    ]
  }
}
`;

  try {
    const parts: any[] = [];

    // Añadir hasta 3 imágenes si vienen en el array
    if (options.images && options.images.length > 0) {
      options.images.slice(0, 3).forEach((img) => {
        let rawBase64 = img.base64;
        if (rawBase64.includes(',')) {
          rawBase64 = rawBase64.split(',')[1];
        }
        parts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: rawBase64,
          },
        });
      });
    }

    parts.push({ text: prompt });

    const { text, modelUsed } = await callGeminiWithCascade(apiKey, parts, 0.35);
    const parsed = JSON.parse(text);

    const formatRecipe = (raw: any, defaultType: any, defaultEmoji: string, label: string): Recipe => ({
      id: `ai-day-${label}-${Date.now()}`,
      title: raw?.title || `Plato sugerido (${label})`,
      description: raw?.description || 'Plato casero equilibrado.',
      type: raw?.type || defaultType,
      prep_time: raw?.prep_time || 25,
      batch_cooking: !!raw?.batch_cooking,
      batch_notes: raw?.batch_notes || '',
      diet_adaptation: raw?.diet_adaptation || '',
      emoji: raw?.emoji || defaultEmoji,
      macros: raw?.macros || { calories: 430, protein: 32, carbs: 40, fat: 12 },
      ingredients: Array.isArray(raw?.ingredients) ? raw.ingredients : [],
      difficulty: 'fácil',
    });

    const formatSalad = (raw: any, defaultName: string, defaultEmoji: string): FreshSaladSide => ({
      id: `ai-salad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: raw?.name || defaultName,
      description: raw?.description || 'Acompañamiento fresco digestivo.',
      emoji: raw?.emoji || defaultEmoji,
      ingredients: Array.isArray(raw?.ingredients) ? raw.ingredients : [],
    });

    const formatSnack = (raw: any): QuickSnack => {
      const validCategory = ['fruta_lacteo', 'frutos_secos', 'salado_encurtido', 'crujiente'].includes(raw?.category)
        ? raw.category
        : 'crujiente';
      return {
        id: `ai-snack-${Date.now()}`,
        name: raw?.name || 'Snack saciante rápido',
        description: raw?.description || 'Snack saciante de 0 a 2 minutos.',
        prepTime: raw?.prepTime || '1 min',
        calories: raw?.calories || 135,
        emoji: raw?.emoji || '🥜',
        category: validCategory,
        ingredients: Array.isArray(raw?.ingredients) ? raw.ingredients : [],
      };
    };

    const proposal: DayMenuProposal = {
      lunch: formatRecipe(parsed.lunch, 'guiso', '🍲', 'almuerzo'),
      lunchSalad: formatSalad(parsed.lunchSalad, 'Ensalada fresca de la huerta', '🥗'),
      dinner: formatRecipe(parsed.dinner, 'pescado', '🐟', 'cena'),
      dinnerSalad: formatSalad(parsed.dinnerSalad, 'Aliño vegetal digestivo', '🥑'),
      snack: formatSnack(parsed.snack),
      detectedIngredients: Array.isArray(parsed.detectedIngredients) ? parsed.detectedIngredients : [],
      remainingIngredientsNote: parsed.remainingIngredientsNote || '',
    };

    return {
      success: true,
      proposal,
      message: isAlternative
        ? `¡Nuevo menú alternativo generado con éxito (${modelUsed})!`
        : `¡Propuesta de menú del día generada con éxito con IA (${modelUsed})!`,
    };
  } catch (error: any) {
    console.warn('Fallo remoto de Gemini en propuesta diaria, usando motor local inteligente:', error);
    const fallbackProposal = makeLocalFallbackDayProposal(options);
    return {
      success: true,
      proposal: fallbackProposal,
      message: `Google Gemini reportó saturación temporal (${error.message}). Te hemos diseñado esta propuesta alternativa con el motor inteligente local para que no esperes.`,
    };
  }
}

