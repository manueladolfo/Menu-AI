-- ==============================================================================
-- FamilyMenu - Esquema de Base de Datos para Supabase
-- Proyecto: Planificación Nutricional Familiar Inteligente
-- Supermercados de referencia: Mercadona / Aldi
-- ==============================================================================

-- 1. Habilitar extensión pgcrypto para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA: family_members (Miembros de la familia)
-- Soporta activación estacional (active_status) y adaptaciones de dieta personal
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
    gender TEXT NOT NULL DEFAULT 'femenino' CHECK (gender IN ('femenino', 'masculino', 'otro')),
    activity_level TEXT NOT NULL DEFAULT 'moderado' CHECK (activity_level IN ('sedentario', 'ligero', 'moderado', 'muy_activo')),
    dietary_preferences TEXT[] DEFAULT '{}',
    is_on_diet BOOLEAN NOT NULL DEFAULT false,
    diet_type TEXT DEFAULT 'mantenimiento' CHECK (diet_type IN ('mantenimiento', 'deficit_calorico', 'baja_carbohidratos', 'alta_proteina', 'keto', 'vegetariana')),
    diet_notes TEXT DEFAULT '',
    active_status BOOLEAN NOT NULL DEFAULT true, -- Toggle estacional (ej. hijos en la universidad o viviendo fuera)
    target_calories INTEGER NOT NULL DEFAULT 2000,
    target_protein_g INTEGER NOT NULL DEFAULT 100,
    target_carbs_g INTEGER NOT NULL DEFAULT 220,
    target_fat_g INTEGER NOT NULL DEFAULT 65
);

-- Índices para family_members
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_active ON public.family_members(active_status);

-- 3. TABLA: recipes (Catálogo de recetas balanceadas)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('carne', 'pescado', 'guiso', 'legumbre', 'ensalada', 'pasta', 'verdura', 'huevos', 'sopa', 'fast_food', 'empanada')),
    -- Ingredients: JSONB array con items: { name, quantity, unit, category, supermarket_ref }
    -- Categorías de pasillos: 'frescos_verdura', 'carniceria_pescaderia', 'lacteos_huevos', 'despensa_legumbres', 'congelados', 'especias_aceites'
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Macros por ración: { calories, protein, carbs, fat }
    macros JSONB NOT NULL DEFAULT '{"calories": 500, "protein": 30, "carbs": 50, "fat": 15}'::jsonb,
    difficulty TEXT NOT NULL DEFAULT 'fácil' CHECK (difficulty IN ('fácil', 'media', 'difícil')),
    prep_time INTEGER NOT NULL DEFAULT 25, -- En minutos
    batch_cooking BOOLEAN NOT NULL DEFAULT false, -- Apto para adelantar el domingo
    batch_notes TEXT DEFAULT '', -- Indicaciones de preparación dominical
    diet_adaptation TEXT DEFAULT '', -- Instrucciones para quien esté a dieta (sobre la misma comida)
    emoji TEXT DEFAULT '🍲'
);

-- Índices para recipes
CREATE INDEX IF NOT EXISTS idx_recipes_type ON public.recipes(type);
CREATE INDEX IF NOT EXISTS idx_recipes_batch_cooking ON public.recipes(batch_cooking);

-- 4. TABLA: weekly_menus (Planificación semanal)
CREATE TABLE IF NOT EXISTS public.weekly_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')),
    meal_type TEXT NOT NULL CHECK (meal_type IN ('almuerzo', 'cena')),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE RESTRICT,
    servings_count INTEGER NOT NULL DEFAULT 4,
    notes TEXT DEFAULT '',
    UNIQUE(week_start_date, day_of_week, meal_type, user_id)
);

-- Índices para weekly_menus
CREATE INDEX IF NOT EXISTS idx_weekly_menus_week ON public.weekly_menus(week_start_date, day_of_week);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_menus ENABLE ROW LEVEL SECURITY;

-- Recetas: Lectura pública o para todos los autenticados; edición solo admin
CREATE POLICY "Recetas visibles para todos los usuarios"
    ON public.recipes FOR SELECT
    USING (true);

-- Miembros de familia: Cada usuario gestiona su propia familia
CREATE POLICY "Usuarios pueden ver sus miembros de familia"
    ON public.family_members FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuarios pueden insertar miembros de familia"
    ON public.family_members FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuarios pueden actualizar sus miembros de familia"
    ON public.family_members FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuarios pueden eliminar sus miembros de familia"
    ON public.family_members FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Menús semanales: Cada usuario gestiona sus propios menús
CREATE POLICY "Usuarios pueden ver sus menús semanales"
    ON public.weekly_menus FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuarios pueden insertar o modificar sus menús semanales"
    ON public.weekly_menus FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL);

-- ==============================================================================
-- SEMILLA DE DATOS (SEED DATA): Recetas base equilibradas estilo Mercadona / Aldi
-- ==============================================================================
INSERT INTO public.recipes (title, description, type, prep_time, difficulty, batch_cooking, batch_notes, diet_adaptation, emoji, macros, ingredients)
VALUES
(
    'Lentejas Pardinas con Verduras y Pavo',
    'Guiso tradicional reconfortante con sofrito de pimientos, zanahoria, calabacín y dados de pechuga de pavo. Alto en fibra y hierro.',
    'legumbre',
    40,
    'fácil',
    true,
    'Cocinar el domingo en olla rápida y guardar en táper hermético en la nevera hasta 4 días, o congelar en raciones.',
    'Persona a dieta: reducir la ración a un cucharón y servir acompañada de una ensalada verde amplia para aumentar volumen sin calorías.',
    '🍲',
    '{"calories": 420, "protein": 34, "carbs": 48, "fat": 7}'::jsonb,
    '[
        {"name": "Lenteja pardina seca", "quantity": 70, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Mercadona paquete 1kg"},
        {"name": "Pechuga de pavo en dados", "quantity": 120, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Mercadona/Aldi bandeja"},
        {"name": "Zanahorias", "quantity": 1, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Sección frutería"},
        {"name": "Pimiento verde italiano", "quantity": 0.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Sección frutería"},
        {"name": "Cebolla dulce", "quantity": 0.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Malla cebollas"},
        {"name": "Laurel y pimentón dulce de la Vera", "quantity": 1, "unit": "pizca", "category": "especias_aceites", "supermarket_ref": "Especiero"},
        {"name": "Aceite de oliva virgen extra", "quantity": 10, "unit": "ml", "category": "especias_aceites", "supermarket_ref": "Garrafa AOVE Hacendado"}
    ]'::jsonb
),
(
    'Salmón a la Plancha con Espárragos Trigueros y Patata Asada',
    'Lomo de salmón noruego rico en omega-3 con guarnición de espárragos trigueros al grill y patata al microondas.',
    'pescado',
    20,
    'fácil',
    false,
    'Las patatas pueden dejarse asadas con piel el domingo para solo calentar.',
    'Persona a dieta: suprimir la patata asada y duplicar la guarnición de espárragos trigueros o añadir calabacín a la plancha.',
    '🐟',
    '{"calories": 490, "protein": 38, "carbs": 24, "fat": 26}'::jsonb,
    '[
        {"name": "Lomos de salmón fresco", "quantity": 150, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Pescadería Mercadona/Aldi"},
        {"name": "Espárragos trigueros verdes", "quantity": 100, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Manojo espárragos"},
        {"name": "Patatas medianas de guarnición", "quantity": 120, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Bolsa patata microondable"},
        {"name": "Aceite de oliva virgen extra", "quantity": 8, "unit": "ml", "category": "especias_aceites", "supermarket_ref": "AOVE"},
        {"name": "Sal en escamas y limón", "quantity": 1, "unit": "pizca", "category": "especias_aceites", "supermarket_ref": "Condimentos"}
    ]'::jsonb
),
(
    'Espaguetis Integrales Boloñesa con Carne Magra',
    'Pasta de trigo integral con salsa boloñesa casera de tomate triturado natural, ternera magra y orégano.',
    'pasta',
    25,
    'fácil',
    true,
    'La salsa boloñesa casera rinde el doble: congelar la mitad el domingo en recipiente de cristal.',
    'Persona a dieta: sustituir 2/3 de los espaguetis por tiras finas de calabacín salteado (espaguetis de calabacín) manteniendo la misma salsa de carne.',
    '🍝',
    '{"calories": 510, "protein": 36, "carbs": 62, "fat": 12}'::jsonb,
    '[
        {"name": "Espaguetis integrales", "quantity": 80, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Mercadona línea Integral"},
        {"name": "Carne picada de ternera magra", "quantity": 120, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Bandeja ternera vacuno"},
        {"name": "Tomate triturado natural", "quantity": 150, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Lata tomate triturado"},
        {"name": "Cebolla y ajo picado", "quantity": 0.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Frutería"},
        {"name": "Queso Grana Padano o parmesano rallado", "quantity": 10, "unit": "g", "category": "lacteos_huevos", "supermarket_ref": "Lácteos Mercadona"}
    ]'::jsonb
),
(
    'Garbanzos Salteados con Espinacas y Bacalao Desmigado',
    'Versión ligera del clásico potaje andaluz, salteado rápido en sartén con pimentón y ajo.',
    'legumbre',
    15,
    'fácil',
    true,
    'Usar garbanzos cocidos en tarro de cristal para preparar en menos de 15 minutos en cualquier momento.',
    'Persona a dieta: aumentar la proporción de espinacas y bacalao, manteniendo 3 cucharadas soperas de garbanzos.',
    '🥬',
    '{"calories": 390, "protein": 33, "carbs": 42, "fat": 9}'::jsonb,
    '[
        {"name": "Garbanzos cocidos en conserva", "quantity": 150, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Tarro cristal garbanzo Luengo/Hacendado"},
        {"name": "Espinacas frescas lavadas", "quantity": 120, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Bolsa espinacas 300g"},
        {"name": "Bacalao desalado desmigado", "quantity": 100, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Bandeja bacalao desalado"},
        {"name": "Dientes de ajo y pimentón dulce", "quantity": 2, "unit": "dientes", "category": "frescos_verdura", "supermarket_ref": "Ajos morados"}
    ]'::jsonb
),
(
    'Pechuga de Pollo al Limón con Arroz Integral y Brócoli al Vapor',
    'Plato limpio y saciante con pechuga macerada en zumo de limón y hierbas provenzales.',
    'carne',
    20,
    'fácil',
    true,
    'Cocer arroz integral y brócoli al vapor el domingo; se conserva intacto 4 días en nevera.',
    'Persona a dieta: cambiar la porción de arroz por ramilletes extra de brócoli al vapor aliñados con limón.',
    '🍗',
    '{"calories": 440, "protein": 42, "carbs": 44, "fat": 9}'::jsonb,
    '[
        {"name": "Pechuga de pollo entera fileteada", "quantity": 160, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Filetes pechuga pollo corte fino"},
        {"name": "Arroz integral", "quantity": 60, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Paquete arroz integral"},
        {"name": "Brócoli fresco", "quantity": 150, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Pieza brócoli"},
        {"name": "Limón para exprimir", "quantity": 1, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Malla limones"},
        {"name": "Hierbas provenzales", "quantity": 1, "unit": "pizca", "category": "especias_aceites", "supermarket_ref": "Especiero"}
    ]'::jsonb
),
(
    'Ensalada Campera Mediterránea con Atún Claro y Huevo Duro',
    'Cena refrescante y equilibrada con base de tomate kumato, pimiento, patata cocida, aceitunas y atún al natural.',
    'ensalada',
    15,
    'fácil',
    true,
    'Cocer 6 huevos el domingo para tenerlos listos en la nevera durante toda la semana.',
    'Persona a dieta: limitar la patata a media unidad y aliñar con vinagre de manzana y una sola cucharadita de AOVE.',
    '🥗',
    '{"calories": 360, "protein": 27, "carbs": 26, "fat": 14}'::jsonb,
    '[
        {"name": "Huevos camperos cocidos", "quantity": 1, "unit": "ud", "category": "lacteos_huevos", "supermarket_ref": "Huevos camperos M/L"},
        {"name": "Atún claro al natural o en AOVE", "quantity": 80, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Pack latas atún Mercadona/Aldi"},
        {"name": "Tomates de ensalada / kumato", "quantity": 1.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Tomate ensalada"},
        {"name": "Cebolleta fresca y pimiento rojo", "quantity": 0.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Frutería"},
        {"name": "Aceitunas manzanilla sin hueso", "quantity": 25, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Lata aceitunas"}
    ]'::jsonb
),
(
    'Tortilla de Calabacín y Cebolla con Ensalada Mixta',
    'Cena ligera, digestiva y rápida con huevos frescos camperos y calabacín pochado fino.',
    'huevos',
    20,
    'fácil',
    false,
    'El calabacín y la cebolla pochados se pueden dejar listos en un táper el día anterior.',
    'Persona a dieta: preparar tortilla francesa con 1 huevo entero + 2 claras pasteurizadas y el calabacín salteado.',
    '🍳',
    '{"calories": 340, "protein": 21, "carbs": 12, "fat": 22}'::jsonb,
    '[
        {"name": "Huevos camperos", "quantity": 2, "unit": "ud", "category": "lacteos_huevos", "supermarket_ref": "Docena huevos camperos"},
        {"name": "Calabacín mediano", "quantity": 1, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Calabacín verde"},
        {"name": "Cebolla dulce", "quantity": 0.5, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Malla cebollas"},
        {"name": "Bolsa mézclum o canónigos", "quantity": 60, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Bolsa brotes tiernos"},
        {"name": "Tomates cherry", "quantity": 6, "unit": "ud", "category": "frescos_verdura", "supermarket_ref": "Tarrina cherry"}
    ]'::jsonb
),
(
    'Lubina al Horno con Verduras Asadas',
    'Pescado blanco suave horneado con calabacín, pimiento y cebolla cortados en juliana.',
    'pescado',
    30,
    'fácil',
    false,
    'Las verduras de base se pueden hornear en bandeja doble el domingo para varias cenas.',
    'Persona a dieta: consumir la ración completa de lubina y verdura, suprimir cualquier acompañamiento de pan.',
    '🐟',
    '{"calories": 370, "protein": 36, "carbs": 14, "fat": 18}'::jsonb,
    '[
        {"name": "Lubina limpia abierta a la espalda", "quantity": 200, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Pescadería de Mercadona/Aldi"},
        {"name": "Calabacín y pimiento rojo", "quantity": 150, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Sección verdura"},
        {"name": "Aceite de oliva virgen extra", "quantity": 10, "unit": "ml", "category": "especias_aceites", "supermarket_ref": "AOVE"},
        {"name": "Ajo laminado y perejil fresco", "quantity": 1, "unit": "pizca", "category": "frescos_verdura", "supermarket_ref": "Perejil fresco manojo"}
    ]'::jsonb
),
(
    'Crema de Calabaza y Zanahoria con Dados de Pollo Salteado',
    'Cena templada reconfortante con crema casera de verduras de temporada y proteína de pollo.',
    'verdura',
    30,
    'fácil',
    true,
    'Ideal para batch cooking: preparar 2 litros de crema el domingo y refrigerar en tarros herméticos.',
    'Persona a dieta: no añadir nata ni quesitos a la crema; enriquecer con semillas de chía o lino y dados de pechuga a la plancha.',
    '🥣',
    '{"calories": 330, "protein": 28, "carbs": 26, "fat": 9}'::jsonb,
    '[
        {"name": "Calabaza fresca pelada en dados", "quantity": 200, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Bandeja calabaza pelada o pieza entera"},
        {"name": "Zanahorias y puerro", "quantity": 100, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Malla zanahoria y manojo puerros"},
        {"name": "Pechuga de pollo en dados", "quantity": 100, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Pechuga pollo"},
        {"name": "Semillas de calabaza tostadas", "quantity": 10, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Frutos secos sin sal"}
    ]'::jsonb
),
(
    'Sopa de Picadillo con Pollo, Jamón y Huevo Duro',
    'Sopa reconfortante andaluza con caldo casero suave de pollo, taquitos de jamón serrano, huevo cocido y fideos finos.',
    'sopa',
    20,
    'fácil',
    true,
    'Dejar el caldo de pollo y los huevos cocidos listos el domingo; entre semana solo hervir los fideos 4 minutos.',
    'Persona a dieta: sustituir los fideos de trigo por fideos shirataki o calabacín rallado fino, manteniendo el caldo, pollo y huevo.',
    '🥣',
    '{"calories": 320, "protein": 30, "carbs": 24, "fat": 11}'::jsonb,
    '[
        {"name": "Caldo casero de pollo bajo en sal", "quantity": 350, "unit": "ml", "category": "despensa_legumbres", "supermarket_ref": "Brick caldo de pollo Hacendado/Aldi"},
        {"name": "Pechuga de pollo cocida desmigada", "quantity": 100, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Pollo fresco"},
        {"name": "Taquitos de jamón serrano", "quantity": 25, "unit": "g", "category": "carniceria_pescaderia", "supermarket_ref": "Pack taquitos jamón"},
        {"name": "Huevos camperos cocidos", "quantity": 1, "unit": "ud", "category": "lacteos_huevos", "supermarket_ref": "Huevos camperos"},
        {"name": "Fideos finos cabello de ángel", "quantity": 30, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Paquete fideos n.º 0"},
        {"name": "Hierbabuena fresca", "quantity": 1, "unit": "ramita", "category": "frescos_verdura", "supermarket_ref": "Manojo hierbabuena"}
    ]'::jsonb
),
(
    'Sopa Minestrone Mediterránea con Alubias y Verduras',
    'Sopa completa de verduras de temporada (calabacín, zanahoria, judías verdes) con alubias blancas cocidas y toque de orégano.',
    'sopa',
    25,
    'fácil',
    true,
    'Ideal para batch cooking: preparar 2 litros de sopa el domingo; se conserva hasta 5 días en nevera.',
    'Persona a dieta: ración libre de caldo y verduras con una ración moderada de alubias.',
    '🍲',
    '{"calories": 290, "protein": 18, "carbs": 38, "fat": 6}'::jsonb,
    '[
        {"name": "Caldo de verduras natural", "quantity": 350, "unit": "ml", "category": "despensa_legumbres", "supermarket_ref": "Brick caldo verduras"},
        {"name": "Alubias blancas cocidas", "quantity": 100, "unit": "g", "category": "despensa_legumbres", "supermarket_ref": "Tarro alubias cocidas"},
        {"name": "Calabacín y zanahoria en cubitos", "quantity": 120, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Frutería"},
        {"name": "Tomate maduro rallado", "quantity": 80, "unit": "g", "category": "frescos_verdura", "supermarket_ref": "Tomate rama"},
        {"name": "Aceite de oliva virgen extra", "quantity": 8, "unit": "ml", "category": "especias_aceites", "supermarket_ref": "AOVE"},
        {"name": "Orégano seco", "quantity": 1, "unit": "pizca", "category": "especias_aceites", "supermarket_ref": "Especiero"}
    ]'::jsonb
);
