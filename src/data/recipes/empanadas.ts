import type { Recipe } from '../../types';

export const EMPANADA_RECIPES: Recipe[] = [
  {
    id: 'emp-1',
    title: 'Empanada Gallega Tradicional de Atún y Pimientos',
    description: 'Masa casera dorada rellena de sofrito meloso de cebolla, pimientos morrones y atún claro en aceite.',
    type: 'empanada',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Dura hasta 4 días en perfecto estado a temperatura ambiente o refrigerada. Se puede congelar horneada.',
    diet_adaptation: 'Miembro a dieta: tomar 1 porción acompañada de abundante ensalada verde.',
    emoji: '🥧',
    macros: { calories: 480, protein: 24, carbs: 52, fat: 18 },
    ingredients: [
      { name: 'Masa para empanada fresca', quantity: 140, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Atún claro en aceite escurrido', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Atún claro lata' },
      { name: 'Cebolla pochada', quantity: 70, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla malla' },
      { name: 'Pimiento rojo y verde', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimientos' },
      { name: 'Tomate frito casero y AOVE', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate frito' }
    ]
  },
  {
    id: 'emp-2',
    title: 'Quiche Lorraine Clásica con Bacon y Emmental',
    description: 'Tarta salada francesa con base quebrada crujiente, crema suave de huevos, nata, bacon dorado y queso emmental.',
    type: 'empanada',
    prep_time: 40,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se conserva en la nevera 3 días. Recalentar en horno para mantener la masa crujiente.',
    diet_adaptation: 'Miembro a dieta: acompañar de ensalada de espinacas y tomate para equilibrar el aporte graso.',
    emoji: '🥧',
    macros: { calories: 510, protein: 18, carbs: 32, fat: 33 },
    ingredients: [
      { name: 'Masa quebrada fresca', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa quebrada' },
      { name: 'Bacon ahumado en tiras', quantity: 40, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacon tiras' },
      { name: 'Nata ligera para cocinar', quantity: 50, unit: 'ml', category: 'lacteos_huevos', supermarket_ref: 'Nata cocinar' },
      { name: 'Huevo campero', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' },
      { name: 'Queso emmental rallado', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso emmental' }
    ]
  },
  {
    id: 'emp-3',
    title: 'Empanadillas Caseras al Horno de Pollo y Maíz',
    description: 'Obleas doradas al horno rellenas de pechuga de pollo deshilachada con cebolla pochada, maíz dulce y orégano.',
    type: 'empanada',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se pueden congelar montadas en crudo y hornear directamente sin descongelar.',
    diet_adaptation: 'Miembro a dieta: al ser horneadas tienen la mitad de calorías que las fritas tradicionales.',
    emoji: '🥟',
    macros: { calories: 390, protein: 26, carbs: 42, fat: 12 },
    ingredients: [
      { name: 'Obleas para empanadilla', quantity: 4, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Obleas paquete' },
      { name: 'Pechuga de pollo cocida y deshebrada', quantity: 100, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga pollo' },
      { name: 'Maíz dulce en grano', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Maíz dulce lata' },
      { name: 'Cebolla picada y tomate frito', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' }
    ]
  },
  {
    id: 'emp-4',
    title: 'Empanada de Carne Especiada Estilo Criollo',
    description: 'Masa hojaldrada rellena de ternera jugosa sofrita con pimentón dulce, comino, aceitunas y huevo duro.',
    type: 'empanada',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'El relleno gana sabor si se cocina el día anterior y se deja enfriar.',
    diet_adaptation: 'Miembro a dieta: una porción estándar acompañada de ensalada fresca sin aderezos calóricos.',
    emoji: '🥧',
    macros: { calories: 510, protein: 28, carbs: 48, fat: 22 },
    ingredients: [
      { name: 'Masa para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Carne picada de ternera magra', quantity: 110, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Carne picada vacuno' },
      { name: 'Cebolla dulce pochada', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' },
      { name: 'Huevo cocido picado', quantity: 0.5, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos camperos' },
      { name: 'Aceitunas verdes y pimentón', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Aceitunas verdes' }
    ]
  },
  {
    id: 'emp-5',
    title: 'Quiche de Espinacas Frescas, Piñones y Queso de Cabra',
    description: 'Suave tarta horneada con masa brisa, espinacas tiernas salteadas al ajillo y medallones de rulo de cabra.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Deliciosa tanto caliente recién salida del horno como a temperatura ambiente.',
    diet_adaptation: 'Miembro a dieta: plato vegetal saciante; acompañar con ensalada de canónigos.',
    emoji: '🥧',
    macros: { calories: 450, protein: 16, carbs: 34, fat: 27 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa brisa' },
      { name: 'Espinacas frescas salteadas', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas bolsa' },
      { name: 'Queso de rulo de cabra', quantity: 35, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Rulo de cabra' },
      { name: 'Huevo fresco y leche evaporada', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' },
      { name: 'Piñones tostados', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Piñones bolsa' }
    ]
  },
  {
    id: 'emp-6',
    title: 'Hojaldre Relleno de Salmón Fresco, Espinacas y Queso Crema',
    description: 'Lomos de salmón envueltos en masa hojaldrada crujiente con capa suave de queso untable y espinacas al vapor.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Hornear justo antes de comer para que el hojaldre quede aireado y muy crujiente.',
    diet_adaptation: 'Miembro a dieta: rico en omega-3 natural y proteína de alto valor biológico.',
    emoji: '🥐',
    macros: { calories: 530, protein: 32, carbs: 36, fat: 27 },
    ingredients: [
      { name: 'Masa de hojaldre fresca', quantity: 90, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Hojaldre rectangular' },
      { name: 'Lomo de salmón fresco limpio', quantity: 120, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Salmón lomos' },
      { name: 'Queso crema untable ligero', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso crema light' },
      { name: 'Espinacas baby', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas baby' }
    ]
  },
  {
    id: 'emp-7',
    title: 'Empanada Rústica de Bacalao con Pasas Moscatel',
    description: 'Especialidad gallega tradicional de masa fina con sofrito meloso de cebolla, bacalao desalado y pasas.',
    type: 'empanada',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Mejora su sabor reposada de un día para otro.',
    diet_adaptation: 'Miembro a dieta: el bacalao aporta proteína limpia con muy poca grasa.',
    emoji: '🥧',
    macros: { calories: 460, protein: 26, carbs: 54, fat: 15 },
    ingredients: [
      { name: 'Masa de empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Migas de bacalao desalado', quantity: 100, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacalao desalado' },
      { name: 'Cebolla pochada con pimentón', quantity: 70, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebollas' },
      { name: 'Uvas pasas sin semillas', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pasas moscatel' }
    ]
  },
  {
    id: 'emp-8',
    title: 'Tartaleta Salada de Champiñones, Cebolla y Queso Azul',
    description: 'Individuales de masa quebrada con base de cebolla confitada, champiñones salteados y queso gorgonzola.',
    type: 'empanada',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Perfectas como almuerzo o cena ligera junto a una ensalada verde.',
    diet_adaptation: 'Miembro a dieta: tomar 1 tartaleta con abundante ensalada verde mixta.',
    emoji: '🥧',
    macros: { calories: 420, protein: 14, carbs: 38, fat: 23 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 75, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa brisa' },
      { name: 'Champiñones salteados', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñón entero' },
      { name: 'Cebolla caramelizada suave', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Cebolla caramelizada' },
      { name: 'Queso azul desmenuzado', quantity: 25, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso azul' }
    ]
  },
  {
    id: 'emp-9',
    title: 'Trenza de Hojaldre de Jamón Cocido y Queso Havarti Fundente',
    description: 'Hojaldre entrelazado relleno de jamón cocido en lonchas, queso havarti fundido y semillas de sésamo.',
    type: 'empanada',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Hornear a 200°C durante 20 minutos hasta que el hojaldre suba y dore.',
    diet_adaptation: 'Miembro a dieta: consumir una porción moderada acompañada de gazpacho o ensalada.',
    emoji: '🥐',
    macros: { calories: 480, protein: 22, carbs: 38, fat: 27 },
    ingredients: [
      { name: 'Masa de hojaldre', quantity: 90, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Hojaldre rectangular' },
      { name: 'Jamón cocido extra', quantity: 50, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón cocido' },
      { name: 'Queso havarti fundente', quantity: 35, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso havarti' },
      { name: 'Semillas de sésamo', quantity: 5, unit: 'g', category: 'especias_aceites', supermarket_ref: 'Sésamo' }
    ]
  },
  {
    id: 'emp-10',
    title: 'Quiche Mediterránea de Calabacín, Tomates Secos y Feta',
    description: 'Tarta salada aromática con rodajas de calabacín tierno, dados de queso feta griego y tiras de tomates secos.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Aguanta hasta 4 días refrigerada en recipiente hermético.',
    diet_adaptation: 'Miembro a dieta: excelente contenido vegetal saciante; 1 porción con ensalada.',
    emoji: '🥧',
    macros: { calories: 430, protein: 15, carbs: 32, fat: 26 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa quebrada' },
      { name: 'Calabacín salteado en rodajas', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabacín verde' },
      { name: 'Queso feta en dados', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso feta' },
      { name: 'Tomates secos hidratados', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomates secos' },
      { name: 'Huevo fresco y leche', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' }
    ]
  },
  {
    id: 'emp-11',
    title: 'Empanada de Pulpo a la Gallega con Patata Pochada',
    description: 'Relleno marinero con trozos de pulpo cocido, cebolla pochada en pimentón dulce y rodajas de patata tierna.',
    type: 'empanada',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Un clásico de fiesta que conserva su jugosidad durante días.',
    diet_adaptation: 'Miembro a dieta: el pulpo es prácticamente pura proteína magra sin apenas grasa.',
    emoji: '🐙',
    macros: { calories: 450, protein: 25, carbs: 52, fat: 14 },
    ingredients: [
      { name: 'Masa para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa fresca empanada' },
      { name: 'Pulpo cocido troceado', quantity: 90, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pulpo cocido refrigerado' },
      { name: 'Patata cocida en rodajas', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Patatas' },
      { name: 'Cebolla pochada con pimentón', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla dulce' }
    ]
  },
  {
    id: 'emp-12',
    title: 'Empanadillas de Atún, Huevo Duro y Tomate al Horno',
    description: 'La receta clásica casera: obleas selladas al horno con atún claro, huevo picado y salsa de tomate casera.',
    type: 'empanada',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Excelente para picnics, comidas de táper y cenas ligeras.',
    diet_adaptation: 'Miembro a dieta: 3 empanadillas al horno acompañadas de abundante ensalada.',
    emoji: '🥟',
    macros: { calories: 370, protein: 21, carbs: 41, fat: 13 },
    ingredients: [
      { name: 'Obleas para empanadilla', quantity: 4, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Obleas empanadilla' },
      { name: 'Atún claro escurrido', quantity: 70, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Atún claro lata' },
      { name: 'Huevo duro picado', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' },
      { name: 'Tomate frito casero', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate frito' }
    ]
  },
  {
    id: 'emp-13',
    title: 'Strudel Salado de Verduras Asadas y Requesón Suave',
    description: 'Rollo crujiente de hojaldre relleno de calabacín, pimientos asados, berenjena y requesón cremoso con albahaca.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Cortar en rodajas gruesas una vez templado para que no se desarme.',
    diet_adaptation: 'Miembro a dieta: el requesón aporta proteína limpia y reduce la densidad calórica.',
    emoji: '🥐',
    macros: { calories: 400, protein: 14, carbs: 40, fat: 20 },
    ingredients: [
      { name: 'Masa de hojaldre fresca', quantity: 85, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Hojaldre' },
      { name: 'Pimientos y berenjenas asadas', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimientos asados bote' },
      { name: 'Requesón o ricotta fresca', quantity: 50, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Requesón tarrina' },
      { name: 'Albahaca fresca', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Albahaca maceta' }
    ]
  },
  {
    id: 'emp-14',
    title: 'Quiche de Puerros Pochados y Salmón Ahumado',
    description: 'Relleno cremoso donde la dulzura del puerro confitado contrasta con lascas de salmón ahumado.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Refrigerar bien tapada; recalentar 10 min a 160°C.',
    diet_adaptation: 'Miembro a dieta: acompañar de ensalada de pepino y vinagre de manzana.',
    emoji: '🥧',
    macros: { calories: 460, protein: 21, carbs: 31, fat: 28 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa quebrada' },
      { name: 'Puerros pochados', quantity: 90, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Puerros' },
      { name: 'Salmón ahumado en lascas', quantity: 45, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Salmón ahumado' },
      { name: 'Huevo fresco y nata ligera', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' }
    ]
  },
  {
    id: 'emp-15',
    title: 'Empanada de Pollo al Curry con Manzana Dulce',
    description: 'Masa dorada rellena de pechuga de pollo sofrita con cebolla pochada, dados de manzana y toque suave de curry.',
    type: 'empanada',
    prep_time: 40,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Se puede consumir tanto fría como tibia en cualquier momento.',
    diet_adaptation: 'Miembro a dieta: pollo magro y manzana con especias antiinflamatorias.',
    emoji: '🥧',
    macros: { calories: 480, protein: 30, carbs: 48, fat: 18 },
    ingredients: [
      { name: 'Masa para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Pechuga de pollo en dados', quantity: 110, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga pollo' },
      { name: 'Manzana dulce en dados', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Manzanas' },
      { name: 'Cebolla pochada con curry', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' }
    ]
  },
  {
    id: 'emp-16',
    title: 'Pastel Rústico de Champiñones, Puerro y Parmesano',
    description: 'Tarta salada con abundante sofrito de puerro caramelizado, setas variadas y queso parmesano rallado fino.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Congela muy bien en porciones triangulares individuales.',
    diet_adaptation: 'Miembro a dieta: alto en fibra procedente de setas y puerro.',
    emoji: '🥧',
    macros: { calories: 410, protein: 17, carbs: 32, fat: 24 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa brisa' },
      { name: 'Setas y champiñones variados', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Surtido setas' },
      { name: 'Puerro en rodajas pochado', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Puerros' },
      { name: 'Huevo fresco y parmesano rallado', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Parmesano' }
    ]
  },
  {
    id: 'emp-17',
    title: 'Empanadillas de Hummus, Espinacas y Nueces al Horno',
    description: 'Empanadillas vegetales horneadas rellenas de puré de garbanzos cremoso, espinacas y nueces picadas.',
    type: 'empanada',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Ligeras, saciantes y perfectas para llevar al trabajo.',
    diet_adaptation: 'Miembro a dieta: 100% vegetal, ligera y saciante.',
    emoji: '🥟',
    macros: { calories: 360, protein: 13, carbs: 44, fat: 14 },
    ingredients: [
      { name: 'Obleas para empanadilla', quantity: 4, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Obleas' },
      { name: 'Hummus de garbanzos', quantity: 60, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Hummus tarrina' },
      { name: 'Espinacas cocidas escurridas', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas' },
      { name: 'Nueces picadas', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Nueces peladas' }
    ]
  },
  {
    id: 'emp-18',
    title: 'Quiche de Calabaza Asada, Salvia y Gorgonzola',
    description: 'Tarta salada otoñal donde la pulpa dulce de calabaza asada se funde con el queso gorgonzola y el aroma a salvia.',
    type: 'empanada',
    prep_time: 40,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'La calabaza se puede asar con antelación en el batch cooking dominical.',
    diet_adaptation: 'Miembro a dieta: la calabaza es baja en calorías y rica en agua y fibra.',
    emoji: '🥧',
    macros: { calories: 440, protein: 14, carbs: 37, fat: 25 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa brisa' },
      { name: 'Calabaza asada en dados', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabaza trozo' },
      { name: 'Queso gorgonzola', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Gorgonzola' },
      { name: 'Huevo y leche evaporada', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' }
    ]
  },
  {
    id: 'emp-19',
    title: 'Empanada de Carne y Pimientos del Padrón Salteados',
    description: 'Empanada contundente con relleno de picadillo de cerdo magro, cebolla confitada y pimientos de Padrón.',
    type: 'empanada',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Ideal para celebraciones y comidas familiares.',
    diet_adaptation: 'Miembro a dieta: consumir una ración moderada y acompañar con gazpacho casero.',
    emoji: '🥧',
    macros: { calories: 510, protein: 29, carbs: 45, fat: 23 },
    ingredients: [
      { name: 'Masa fresca para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Magro de cerdo picado magro', quantity: 110, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Carne picada cerdo' },
      { name: 'Pimientos del Padrón salteados', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimientos Padrón' },
      { name: 'Cebolla pochada con pimentón', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla malla' }
    ]
  },
  {
    id: 'emp-20',
    title: 'Hojaldre de Jamón Serrano, Rúcula y Queso de Cabra',
    description: 'Masa hojaldrada crujiente con láminas de jamón serrano, medallones de cabra y hojas frescas de rúcula.',
    type: 'empanada',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Añadir la rúcula fresca recién sacado del horno para conservar su frescor.',
    diet_adaptation: 'Miembro a dieta: acompañar de ensalada de tomate con orégano.',
    emoji: '🥐',
    macros: { calories: 470, protein: 21, carbs: 35, fat: 27 },
    ingredients: [
      { name: 'Masa de hojaldre', quantity: 85, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Hojaldre' },
      { name: 'Jamón serrano en lonchas', quantity: 35, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón serrano' },
      { name: 'Queso de rulo de cabra', quantity: 35, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Rulo de cabra' },
      { name: 'Rúcula fresca', quantity: 20, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Rúcula bolsa' }
    ]
  },
  {
    id: 'emp-21',
    title: 'Quiche de Brócoli al Vapor, Nueces y Queso Cheddar',
    description: 'Floretes tiernos de brócoli al dente sumergidos en crema ligera con queso cheddar maduro y nueces.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Excelente manera de incorporar brócoli de forma muy apetecible.',
    diet_adaptation: 'Miembro a dieta: alto contenido en sulfurofano y antioxidantes vegetales.',
    emoji: '🥦',
    macros: { calories: 450, protein: 17, carbs: 32, fat: 28 },
    ingredients: [
      { name: 'Masa quebrada', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa quebrada' },
      { name: 'Brócoli en floretes al vapor', quantity: 90, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Brócoli' },
      { name: 'Queso cheddar rallado', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Cheddar rallado' },
      { name: 'Nueces peladas troceadas', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Nueces bolsa' },
      { name: 'Huevo fresco y leche evaporada', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' }
    ]
  },
  {
    id: 'emp-22',
    title: 'Empanada de Sardinillas con Pimiento Asado',
    description: 'Guiso marinero tradicional envuelto en masa fina con sardinillas en conserva, pimiento asado y cebolla caramelizada.',
    type: 'empanada',
    prep_time: 40,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Rica en calcio y omega-3, aguanta 4 días refrigerada.',
    diet_adaptation: 'Miembro a dieta: el pescado azul en conserva es una fuente extraordinaria de calcio bioasimilable.',
    emoji: '🥧',
    macros: { calories: 460, protein: 26, carbs: 49, fat: 17 },
    ingredients: [
      { name: 'Masa para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Sardinillas en aceite escurridas', quantity: 75, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Sardinillas lata' },
      { name: 'Pimientos asados en tiras', quantity: 50, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pimientos asados bote' },
      { name: 'Cebolla pochada con pimentón', quantity: 45, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebollas' }
    ]
  },
  {
    id: 'emp-23',
    title: 'Empanadillas de Manzana Asada, Canela y Ricotta al Horno',
    description: 'Versión reconfortante horneada, ideal para meriendas o cenas ligeras con manzana salteada, canela y queso blanco.',
    type: 'empanada',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Deliciosas frías o templadas recién horneadas.',
    diet_adaptation: 'Miembro a dieta: snack o cena ligera sin azúcares añadidos.',
    emoji: '🥟',
    macros: { calories: 320, protein: 8, carbs: 48, fat: 10 },
    ingredients: [
      { name: 'Obleas para empanadilla', quantity: 4, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Obleas' },
      { name: 'Manzana salteada con canela', quantity: 70, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Manzanas' },
      { name: 'Queso ricotta o requesón', quantity: 40, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Ricotta' }
    ]
  },
  {
    id: 'emp-24',
    title: 'Tarta Tatin Salada de Tomates Cherry y Romero',
    description: 'Tomates cherry confitados con vinagre balsámico y cubiertos con hojaldre horneado invertido.',
    type: 'empanada',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Desmoldar en caliente con cuidado para que los tomates queden en la superficie.',
    diet_adaptation: 'Miembro a dieta: rica en licopeno antioxidante gracias a los tomates cherry horneados.',
    emoji: '🍅',
    macros: { calories: 380, protein: 7, carbs: 42, fat: 20 },
    ingredients: [
      { name: 'Masa de hojaldre', quantity: 85, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Hojaldre redondo' },
      { name: 'Tomates cherry variados', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomates cherry' },
      { name: 'Vinagre balsámico y romero', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vinagre balsámico' },
      { name: 'Aceite de oliva virgen extra', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'emp-25',
    title: 'Empanada de Jamón York, Queso Semicurado y Dátiles',
    description: 'Masa fina con relleno jugoso de jamón cocido, queso fundido y pequeños trozos de dátiles con toque dulce.',
    type: 'empanada',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Gusta a toda la familia por su contraste equilibrado.',
    diet_adaptation: 'Miembro a dieta: consumir una porción acompañada de ensalada verde fresca.',
    emoji: '🥧',
    macros: { calories: 470, protein: 22, carbs: 47, fat: 21 },
    ingredients: [
      { name: 'Masa fresca para empanada', quantity: 130, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa empanada' },
      { name: 'Jamón cocido extra lonchas', quantity: 60, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón cocido' },
      { name: 'Queso semicurado en lonchas', quantity: 40, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso semicurado' },
      { name: 'Dátiles deshuesados picados', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Dátiles sin hueso' }
    ]
  }
];
