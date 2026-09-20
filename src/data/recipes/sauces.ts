import type { Recipe } from '../../types';

export const SAUCE_RECIPES: Recipe[] = [
  {
    id: 'sau-1',
    title: 'Guacamole Mexicano Auténtico con Lima y Cilantro',
    description: 'Salsa tradicional majada con aguacates hass en su punto, lima fresca, cebolla morada, jalapeño y cilantro.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Consumir en el día; guardar con el hueso dentro y film pegado a la superficie para evitar oxidación.',
    diet_adaptation: 'Miembro a dieta: grasas monoinsaturadas saludables y fibra; dipear con bastoncitos de zanahoria y pepino.',
    emoji: '🥑',
    macros: { calories: 190, protein: 3, carbs: 9, fat: 17 },
    ingredients: [
      { name: 'Aguacate Hass maduro', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Aguacate maduro' },
      { name: 'Cebolla morada picada fina', quantity: 20, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla morada' },
      { name: 'Tomate pera sin pepitas', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomate pera' },
      { name: 'Cilantro fresco y lima', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Cilantro fresco' }
    ]
  },
  {
    id: 'sau-2',
    title: 'Hummus Tradicional Cremoso con Tahini y Pimentón',
    description: 'Puré suave y sedoso de garbanzos cocidos con tahini, ajo suave, limón, aceite de oliva virgen y pimentón.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Aguanta hasta 6 días en la nevera en tarro hermético. Para dipear con crudités o pan pita.',
    diet_adaptation: 'Miembro a dieta: dip vegetal con alto poder saciante y proteína vegetal.',
    emoji: '🧆',
    macros: { calories: 210, protein: 8, carbs: 19, fat: 11 },
    ingredients: [
      { name: 'Garbanzos cocidos escurridos', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Garbanzos cocidos tarro' },
      { name: 'Pasta de tahini', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tahini bote' },
      { name: 'Diente de ajo sin germen', quantity: 0.5, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo malla' },
      { name: 'Zumo de limón y comino', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Limones' },
      { name: 'Aceite de oliva virgen extra y pimentón', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-3',
    title: 'Salsa Romesco Catalana Artesana con Almendras y Ñoras',
    description: 'Tomates y ajos asados triturados con almendras tostadas, pulpa de ñora, aceite de oliva virgen y vinagre de jerez.',
    type: 'salsa',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Se conserva en frío durante 10 días cubierta con aceite. Ideal para verduras, pescados o mojar pan.',
    diet_adaptation: 'Miembro a dieta: salsa vegetal muy nutritiva; moderar la cantidad a una cucharada sopera.',
    emoji: '🥣',
    macros: { calories: 240, protein: 4, carbs: 11, fat: 20 },
    ingredients: [
      { name: 'Tomate maduro asado', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomates rama' },
      { name: 'Ajo asado', quantity: 10, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Almendras tostadas peladas', quantity: 25, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Almendras tostadas' },
      { name: 'Carne de pimiento choricero', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Carne de choricero' },
      { name: 'Aceite de oliva virgen extra', quantity: 15, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-4',
    title: 'Salsa Alioli Casero Tradicional al Mortero',
    description: 'Emulsión potente de ajo y aceite virgen ligada pacientemente con mortero. Para arroces, carnes y pan.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Consumir en 48 horas en refrigeración.',
    diet_adaptation: 'Miembro a dieta: salsa de alta densidad calórica; usar con moderación como potenciador de sabor.',
    emoji: '🧄',
    macros: { calories: 270, protein: 1, carbs: 2, fat: 30 },
    ingredients: [
      { name: 'Dientes de ajo pelados', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Ajo malla' },
      { name: 'Aceite de oliva virgen extra', quantity: 30, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE suave' },
      { name: 'Zumo de limón y sal marina', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Limones' }
    ]
  },
  {
    id: 'sau-5',
    title: 'Salsa Vizcaína Tradicional para Guisos de Pescado y Carne',
    description: 'Salsa madre vasca cocinada lentamente con abundante cebolla roja pochada y pulpa de pimiento choricero.',
    type: 'salsa',
    prep_time: 40,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Congela magníficamente en porciones. La salsa base perfecta para bacalao o lomo.',
    diet_adaptation: 'Miembro a dieta: salsa prácticamente a base de hortalizas con muy pocas calorías.',
    emoji: '🥘',
    macros: { calories: 150, protein: 3, carbs: 17, fat: 8 },
    ingredients: [
      { name: 'Cebollas moradas pochadas', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla morada' },
      { name: 'Pulpa de pimiento choricero', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pimiento choricero tarro' },
      { name: 'Caldo de pescado o verduras', quantity: 80, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo pescado' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-6',
    title: 'Salsa Verde Vasca con Perejil Fresco, Ajo y Vino Blanco',
    description: 'Salsa clásica y ligera emulsionada con ajos dorados, vino blanco seco y perejil picado fino.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Ideal para acompañar merluza, almejas, patatas o huevos escalfados.',
    diet_adaptation: 'Miembro a dieta: salsa ligera y aromática perfecta para dietas hipocalóricas.',
    emoji: '🌿',
    macros: { calories: 120, protein: 2, carbs: 7, fat: 8 },
    ingredients: [
      { name: 'Dientes de ajo picados', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Ajo malla' },
      { name: 'Perejil fresco picadísimo', quantity: 25, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Perejil' },
      { name: 'Vino blanco seco', quantity: 25, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vino blanco' },
      { name: 'Caldo suave de pescado o verdura', quantity: 80, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo suave' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-7',
    title: 'Tzatziki Griego Refrescante con Pepino, Yogur y Menta',
    description: 'Dip mediterráneo cremoso de yogur griego espeso, pepino rallado bien escurrido, ajo suave y menta.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Dura 4 días en la nevera. Perfecto para dipear con crudités o pan pita.',
    diet_adaptation: 'Miembro a dieta: excelente dip proteico con yogur y agua de pepino.',
    emoji: '🥒',
    macros: { calories: 130, protein: 7, carbs: 6, fat: 9 },
    ingredients: [
      { name: 'Yogur griego natural sin azúcar', quantity: 125, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Yogur griego' },
      { name: 'Pepino rallado y escurrido', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pepino' },
      { name: 'Ajo rallado y menta fresca', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Menta' },
      { name: 'Aceite de oliva virgen extra y limón', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-8',
    title: 'Pesto Genovés Auténtico con Albahaca Fresca y Piñones',
    description: 'Salsa cruda tradicional italiana majada con hojas frescas de albahaca, piñones, parmesano y AOVE virgen.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Cubrir la superficie con aceite; dura 7 días en la nevera o se puede congelar en cubitos.',
    diet_adaptation: 'Miembro a dieta: rico en antioxidantes; dosificar 1 cucharada para pastas o verduras al vapor.',
    emoji: '🌿',
    macros: { calories: 280, protein: 7, carbs: 3, fat: 27 },
    ingredients: [
      { name: 'Hojas frescas de albahaca', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Albahaca maceta' },
      { name: 'Piñones tostados', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Piñones' },
      { name: 'Queso parmesano rallado', quantity: 20, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Parmesano' },
      { name: 'Aceite de oliva virgen extra', quantity: 25, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-9',
    title: 'Salsa Tártara Casera para Pescados y Verduras',
    description: 'Mayonesa ligera enriquecida con pepinillos agridulces, alcaparras picaditas, cebolleta y eneldo.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se conserva bien durante 5 días en la nevera en tarro de cristal.',
    diet_adaptation: 'Miembro a dieta: mezclar mayonesa con un 50% de yogur natural para aligerar calorías.',
    emoji: '🥣',
    macros: { calories: 220, protein: 2, carbs: 3, fat: 24 },
    ingredients: [
      { name: 'Mayonesa suave', quantity: 50, unit: 'g', category: 'especias_aceites', supermarket_ref: 'Mayonesa' },
      { name: 'Pepinillos agridulces picados', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pepinillos' },
      { name: 'Alcaparras escurridas', quantity: 8, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Alcaparras' },
      { name: 'Cebolleta y eneldo picado', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Eneldo' }
    ]
  },
  {
    id: 'sau-10',
    title: 'Salsa en Pepitoria Tradicional para Guisos de Ave',
    description: 'Salsa de solera castellana espesada con yema de huevo duro, azafrán en hebras, caldo y almendras majadas.',
    type: 'salsa',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'La salsa perfecta para pollo o albóndigas. Espectacular para mojar pan.',
    diet_adaptation: 'Miembro a dieta: salsa limpia sin harinas procesadas, ligada con almendra y huevo.',
    emoji: '🥘',
    macros: { calories: 200, protein: 6, carbs: 9, fat: 15 },
    ingredients: [
      { name: 'Almendras tostadas majadas', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Almendra tostada' },
      { name: 'Yema de huevo duro', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos' },
      { name: 'Cebolla pochada con azafrán', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebollas' },
      { name: 'Caldo de ave casero', quantity: 100, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo pollo' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-11',
    title: 'Mojo Picón Canario Tradicional con Pimentón y Comino',
    description: 'Salsa canaria emblemática con ajo morado, pimentón de la Vera dulce y picante, comino y vinagre de vino.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Aguanta semanas en la nevera. Perfecto para patatas cocidas, carnes o pescado.',
    diet_adaptation: 'Miembro a dieta: aderezo vegetal muy aromático; una cucharadita llena de sabor.',
    emoji: '🌶️',
    macros: { calories: 210, protein: 2, carbs: 5, fat: 22 },
    ingredients: [
      { name: 'Dientes de ajo pelados', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Ajo malla' },
      { name: 'Pimentón dulce y picante', quantity: 1, unit: 'cdta', category: 'especias_aceites', supermarket_ref: 'Pimentón de la Vera' },
      { name: 'Comino molido y sal', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Comino molido' },
      { name: 'Aceite de oliva virgen extra', quantity: 20, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Vinagre de vino', quantity: 10, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vinagre' }
    ]
  },
  {
    id: 'sau-12',
    title: 'Mojo Verde Canario de Cilantro Fresco',
    description: 'Emulsión aromática verde y fresca con abundante cilantro fresco, pimiento verde, ajo y comino.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Insuperable con pescados al vapor o a la plancha y patatas asadas.',
    diet_adaptation: 'Miembro a dieta: excelente para potenciar platos limpios sin añadir carbohidratos.',
    emoji: '🌿',
    macros: { calories: 200, protein: 1, carbs: 4, fat: 21 },
    ingredients: [
      { name: 'Cilantro fresco', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cilantro manojo' },
      { name: 'Pimiento verde en trozos', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimiento verde' },
      { name: 'Diente de ajo', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Aceite de oliva virgen extra y vinagre', quantity: 20, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-13',
    title: 'Salsa Brava Casera de Taberna Madrileña',
    description: 'Salsa auténtica ligada con caldo de carne, pimentón dulce y picante y aceite virgen, sin tomate.',
    type: 'salsa',
    prep_time: 20,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Admite congelación en porciones. Para patatas bravas, verduras o carnes.',
    diet_adaptation: 'Miembro a dieta: salsa especiada muy termogénica y saciante.',
    emoji: '🌶️',
    macros: { calories: 130, protein: 2, carbs: 9, fat: 9 },
    ingredients: [
      { name: 'Pimentón dulce y picante de la Vera', quantity: 1, unit: 'cdta cada uno', category: 'especias_aceites', supermarket_ref: 'Pimentón' },
      { name: 'Caldo de cocido o carne sabroso', quantity: 120, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo cocido' },
      { name: 'Cebolla picada fina pochada', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' },
      { name: 'Harina de trigo o maicena', quantity: 8, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Harina' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-14',
    title: 'Salsa Boloñesa Casera a Fuego Lento (Ragù Tradicional)',
    description: 'Salsa espesa y rica de carne picada sofrita con zanahoria, cebolla, apio, vino tinto y tomate natural.',
    type: 'salsa',
    prep_time: 55,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'La reina de las salsas para congelar. Cocinar en cantidad y guardar raciones.',
    diet_adaptation: 'Miembro a dieta: alta en proteína saciante; usar con calabacines en espiral o pasta integral.',
    emoji: '🥘',
    macros: { calories: 280, protein: 22, carbs: 11, fat: 16 },
    ingredients: [
      { name: 'Carne picada de ternera y cerdo magro', quantity: 140, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Carne picada mixta' },
      { name: 'Sofrito de cebolla, zanahoria y apio', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pack sofrito' },
      { name: 'Tomate triturado natural', quantity: 100, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate triturado' },
      { name: 'Vino tinto y AOVE', quantity: 15, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vino tinto' }
    ]
  },
  {
    id: 'sau-15',
    title: 'Salsa de Queso Azul Suave para Untar y Guisos',
    description: 'Crema untuosa de queso azul fundido lentamente con leche evaporada ligera y un toque de pimienta.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Dura 5 días en la nevera; deliciosa para mojar pan, verduras o carnes.',
    diet_adaptation: 'Miembro a dieta: la leche evaporada reduce la grasa a la mitad respecto a la nata tradicional.',
    emoji: '🧀',
    macros: { calories: 230, protein: 9, carbs: 4, fat: 20 },
    ingredients: [
      { name: 'Queso azul o gorgonzola', quantity: 45, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso azul' },
      { name: 'Leche evaporada o nata ligera', quantity: 60, unit: 'ml', category: 'lacteos_huevos', supermarket_ref: 'Leche evaporada' },
      { name: 'Pimienta blanca y nuez moscada', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimienta blanca' }
    ]
  },
  {
    id: 'sau-16',
    title: 'Baba Ganoush (Mutabal) de Berenjenas Asadas Ahumadas',
    description: 'Dip árabe sedoso de berenjenas asadas a la llama con tahini, zumo de limón y toque de comino.',
    type: 'salsa',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Inmejorable con pan tostado o crudités; se conserva 5 días refrigerado.',
    diet_adaptation: 'Miembro a dieta: dip vegetal con apenas 150 calorías por ración, rico en fibra.',
    emoji: '🍆',
    macros: { calories: 160, protein: 4, carbs: 11, fat: 11 },
    ingredients: [
      { name: 'Berenjena asada limpia', quantity: 150, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Berenjenas' },
      { name: 'Pasta de tahini', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tahini bote' },
      { name: 'Ajo rallado y zumo de limón', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Limón' },
      { name: 'Aceite de oliva virgen extra', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-17',
    title: 'Salsa Gravy Casera para Carnes Asadas y Puré',
    description: 'Salsa oscura nacida de los jugos caramelizados del asado desglasados con caldo de buey y mantequilla.',
    type: 'salsa',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'La acompañante definitiva para purés de patata o pollo asado.',
    diet_adaptation: 'Miembro a dieta: salsa concentrada en sabor pero baja en volumen calórico.',
    emoji: '🥩',
    macros: { calories: 120, protein: 3, carbs: 7, fat: 9 },
    ingredients: [
      { name: 'Caldo de carne o buey concentrado', quantity: 120, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo carne' },
      { name: 'Mantequilla suave', quantity: 10, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mantequilla' },
      { name: 'Maicena disuelta', quantity: 6, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Maicena' },
      { name: 'Salsa Worcestershire y pimienta', quantity: 1, unit: 'pizca', category: 'despensa_legumbres', supermarket_ref: 'Salsa Perrins' }
    ]
  },
  {
    id: 'sau-18',
    title: 'Dip Cremoso de Queso Feta y Pimientos Asados (Tirokafteri)',
    description: 'Dip griego especiado y cremoso con pimientos rojos asados, queso feta desmenuzado y toque de guindilla.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se conserva 7 días en la nevera. Ideal para mojar colines o verduras crudas.',
    diet_adaptation: 'Miembro a dieta: acompañar de bastoncitos de pepino y apio fresco.',
    emoji: '🌶️',
    macros: { calories: 200, protein: 8, carbs: 6, fat: 16 },
    ingredients: [
      { name: 'Pimientos rojos asados escurridos', quantity: 70, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pimientos asados bote' },
      { name: 'Queso feta en bloque', quantity: 45, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso feta' },
      { name: 'Aceite de oliva virgen extra y vinagre', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Copos de guindilla suave', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Guindilla' }
    ]
  },
  {
    id: 'sau-19',
    title: 'Salsa Chimichurri Clásico para Carnes a la Brasa y Pan',
    description: 'Aderezo criollo de perejil fresco muy picado, orégano silvestre, ajo triturado, ají molido y aceite virgen.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Gana muchísima potencia y aroma tras reposar 24 a 48 horas. Aguanta semanas.',
    diet_adaptation: 'Miembro a dieta: salsa cruda sin azúcar ni aditivos artificiales.',
    emoji: '🥩',
    macros: { calories: 210, protein: 1, carbs: 3, fat: 23 },
    ingredients: [
      { name: 'Perejil fresco picadísimo', quantity: 20, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Perejil' },
      { name: 'Dientes de ajo picados', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Orégano seco y ají molido', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Orégano' },
      { name: 'Aceite de oliva virgen extra', quantity: 20, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Vinagre de vino tinto', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vinagre' }
    ]
  },
  {
    id: 'sau-20',
    title: 'Tapenade Tradicional de Aceitunas Negras y Alcaparras',
    description: 'Pasta provenzal intensa y aromática de aceitunas negras machacadas con anchoas, alcaparras y tomillo.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Para untar sobre pan tostado con tomate o aderezar pescados blancos.',
    diet_adaptation: 'Miembro a dieta: pura grasa monoinsaturada cardiosaludable de aceituna.',
    emoji: '🫒',
    macros: { calories: 210, protein: 3, carbs: 4, fat: 21 },
    ingredients: [
      { name: 'Aceitunas negras deshuesadas', quantity: 60, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Aceitunas negras bote' },
      { name: 'Filetes de anchoa en aceite', quantity: 2, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Anchoas lata' },
      { name: 'Alcaparras escurridas', quantity: 5, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Alcaparras' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-21',
    title: 'Salsa Agridulce Oriental Casera para Rollitos y Pollo',
    description: 'Salsa brillante y translúcida con el equilibrio idóneo entre vinagre de manzana, tomate y toque de soja.',
    type: 'salsa',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se conserva hasta 1 mes en la nevera en tarro hermético.',
    diet_adaptation: 'Miembro a dieta: elaborada con una cantidad controlada de endulzante natural.',
    emoji: '🥢',
    macros: { calories: 120, protein: 1, carbs: 28, fat: 0 },
    ingredients: [
      { name: 'Vinagre de manzana', quantity: 20, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vinagre manzana' },
      { name: 'Tomate concentrado o ketchup casero', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate concentrado' },
      { name: 'Miel de flores', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Miel' },
      { name: 'Salsa de soja y maicena', quantity: 5, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Soja' }
    ]
  },
  {
    id: 'sau-22',
    title: 'Salsa Española Reducida para Estofados y Albóndigas',
    description: 'Fondo oscuro tradicional de cebolla caramelizada lentamente, vino tinto y caldo de carne para guisos.',
    type: 'salsa',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Base imprescindible de la cocina tradicional; congela en porciones.',
    diet_adaptation: 'Miembro a dieta: salsa sabrosa con mínimo aporte graso.',
    emoji: '🥘',
    macros: { calories: 140, protein: 4, carbs: 13, fat: 8 },
    ingredients: [
      { name: 'Cebolla muy pochada en juliana', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' },
      { name: 'Zanahoria rallada pochada', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Zanahorias' },
      { name: 'Vino tinto de mesa', quantity: 20, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vino tinto' },
      { name: 'Caldo de carne concentrado', quantity: 120, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo carne' },
      { name: 'Aceite de oliva virgen extra', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'sau-23',
    title: 'Dip Caliente de Espinacas, Alcachofas y Queso Gratinado',
    description: 'Dip tibio reconfortante horneado con corazones de alcachofa, espinacas tiernas y mozzarella fundida.',
    type: 'salsa',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Servir muy caliente con nachos, picos o verduras crujientes.',
    diet_adaptation: 'Miembro a dieta: dipear con ramitos de brócoli al dente o bastoncitos de zanahoria.',
    emoji: '🧀',
    macros: { calories: 230, protein: 9, carbs: 9, fat: 17 },
    ingredients: [
      { name: 'Corazones de alcachofa troceados', quantity: 50, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Alcachofas bote' },
      { name: 'Espinacas cocidas escurridas', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas' },
      { name: 'Queso crema suave ligero', quantity: 35, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso crema light' },
      { name: 'Mozzarella rallada para gratinar', quantity: 25, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mozzarella rallada' }
    ]
  },
  {
    id: 'sau-24',
    title: 'Salsa Holandesa Sedosa al Limón y Mantequilla',
    description: 'Emulsión tibia clásica francesa de yemas de huevo batidas suavemente con mantequilla fundida y gotas de limón.',
    type: 'salsa',
    prep_time: 20,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Hacer al momento y mantener templada; inigualable sobre espárragos, pescados o huevos.',
    diet_adaptation: 'Miembro a dieta: salsa densa para ocasiones especiales; dosificar 1 cucharada sopera.',
    emoji: '🧈',
    macros: { calories: 270, protein: 4, carbs: 1, fat: 29 },
    ingredients: [
      { name: 'Yemas de huevo camperas', quantity: 1.5, unit: 'uds', category: 'lacteos_huevos', supermarket_ref: 'Huevos camperos' },
      { name: 'Mantequilla de calidad', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mantequilla' },
      { name: 'Zumo de limón fresco', quantity: 5, unit: 'ml', category: 'frescos_verdura', supermarket_ref: 'Limón' },
      { name: 'Pimienta blanca y sal fina', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimienta blanca' }
    ]
  },
  {
    id: 'sau-25',
    title: 'Salsa Barbacoa Casera con Miel y Pimentón Ahumado',
    description: 'Salsa densa y ahumada con tomate confitado, miel pura, vinagre de manzana, mostaza y pimentón de la Vera.',
    type: 'salsa',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Mucho más saludable que las comerciales; se conserva más de 3 semanas refrigerada.',
    diet_adaptation: 'Miembro a dieta: sin jarabes artificiales ni glutamatos industriales.',
    emoji: '🍯',
    macros: { calories: 140, protein: 1, carbs: 30, fat: 1 },
    ingredients: [
      { name: 'Tomate concentrado natural', quantity: 60, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate concentrado' },
      { name: 'Miel de flores', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Miel' },
      { name: 'Vinagre de manzana', quantity: 15, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vinagre manzana' },
      { name: 'Mostaza suave y pimentón ahumado', quantity: 1, unit: 'pizca', category: 'despensa_legumbres', supermarket_ref: 'Mostaza' }
    ]
  }
];
