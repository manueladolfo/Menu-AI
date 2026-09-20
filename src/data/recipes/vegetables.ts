import type { Recipe } from '../../types';

export const VEGETABLE_RECIPES: Recipe[] = [
  {
    id: 'veg-1',
    title: 'Pisto Manchego Tradicional con Tomate Confitado',
    description: 'Verduras de la huerta (calabacín, pimientos, cebolla y berenjena) pochadas a fuego lento con tomate maduro.',
    type: 'verdura',
    prep_time: 40,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Plato rey de batch cooking. Gana sabor con los días y congela perfectamente en raciones.',
    diet_adaptation: 'Miembro a dieta: plato 100% limpio y vegetal, excelente cena saciante.',
    emoji: '🥘',
    macros: { calories: 190, protein: 4, carbs: 18, fat: 11 },
    ingredients: [
      { name: 'Calabacín fresco en dados', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabacín verde' },
      { name: 'Berenjena en dados', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Berenjena' },
      { name: 'Pimiento rojo y verde', quantity: 70, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimientos' },
      { name: 'Cebolla dulce picada', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebollas' },
      { name: 'Tomate triturado natural', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate triturado' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-2',
    title: 'Escalivada Catalana con Aceite de Ajo y Pimentón',
    description: 'Berenjenas, pimientos rojos y cebollas asadas enteras al horno, peladas en tiras y aliñadas con AOVE y ajos.',
    type: 'verdura',
    prep_time: 45,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se conserva en la nevera cubierta con su propio aceite hasta 6 días.',
    diet_adaptation: 'Miembro a dieta: verduras asadas muy ligeras, añadir proteína limpia si se desea.',
    emoji: '🍆',
    macros: { calories: 160, protein: 3, carbs: 14, fat: 10 },
    ingredients: [
      { name: 'Berenjena asada en tiras', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Berenjenas' },
      { name: 'Pimiento rojo asado en tiras', quantity: 100, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimiento rojo' },
      { name: 'Cebolla asada en juliana', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla dulce' },
      { name: 'Dientes de ajo laminados', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo malla' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-3',
    title: 'Berenjenas Rellenas de Sofrito de Verduras Gratinadas',
    description: 'Barquitas de berenjena asada rellenas con su pulpa, champiñones, puerro y tomate, gratinadas con queso dorado.',
    type: 'verdura',
    prep_time: 40,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Se pueden dejar rellenas en la nevera listas para meter al grill 10 minutos.',
    diet_adaptation: 'Miembro a dieta: moderar el queso superior para reducir grasas saturadas.',
    emoji: '🍆',
    macros: { calories: 230, protein: 9, carbs: 22, fat: 11 },
    ingredients: [
      { name: 'Berenjena entera partida por la mitad', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Berenjena' },
      { name: 'Champiñones salteados', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñón laminado' },
      { name: 'Puerro picado pochado', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Puerros' },
      { name: 'Tomate frito casero', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate frito' },
      { name: 'Queso rallado para gratinar', quantity: 25, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso rallado' }
    ]
  },
  {
    id: 'veg-4',
    title: 'Calabacines Rellenos de Arroz Integral y Piñones',
    description: 'Troncos de calabacín rellenos de arroz integral salteado con cebolla, pasas, piñones y especias dulces.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Aguanta 4 días en táper; recalentar en microondas o sartén tapada.',
    diet_adaptation: 'Miembro a dieta: hidrato de carbono complejo integral de absorción lenta.',
    emoji: '🥒',
    macros: { calories: 280, protein: 6, carbs: 46, fat: 8 },
    ingredients: [
      { name: 'Calabacín mediano', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Calabacín' },
      { name: 'Arroz integral cocido', quantity: 100, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Arroz integral' },
      { name: 'Piñones tostados', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Piñones' },
      { name: 'Cebolla picada pochada', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' },
      { name: 'Aceite de oliva virgen extra', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-5',
    title: 'Salteado de Judías Verdes Planas con Tomate y Ajos Tiernos',
    description: 'Judías verdes frescas hervidas al dente y salteadas rápidamente con ajo en láminas y salsa de tomate casera.',
    type: 'verdura',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Las judías cocidas aguantan 4 días en la nevera listas para saltear.',
    diet_adaptation: 'Miembro a dieta: cena hiperligera, añadir un huevo cocido para completar proteína.',
    emoji: '🥬',
    macros: { calories: 150, protein: 4, carbs: 16, fat: 7 },
    ingredients: [
      { name: 'Judías verdes planas tiernas', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Judía verde' },
      { name: 'Ajos tiernos o dientes de ajo', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Ajos tiernos' },
      { name: 'Tomate triturado sofrito', quantity: 50, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate triturado' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-6',
    title: 'Parrillada de Verduras de Temporada con Salsa Romesco',
    description: 'Rodajas de berenjena, calabacín, espárragos trigueros y champiñones a la plancha con romesco casero.',
    type: 'verdura',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'La verdura a la parrilla se disfruta más recién sacada del fuego.',
    diet_adaptation: 'Miembro a dieta: controlar la cantidad de romesco a una cucharada sopera.',
    emoji: '🥦',
    macros: { calories: 230, protein: 6, carbs: 19, fat: 14 },
    ingredients: [
      { name: 'Calabacín y berenjena en rodajas', quantity: 150, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabacín y berenjena' },
      { name: 'Espárragos trigueros verdes', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espárragos verdes' },
      { name: 'Setas o champiñones', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñón' },
      { name: 'Salsa romesco artesana', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Salsa romesco' },
      { name: 'Aceite de oliva y sal en escamas', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-7',
    title: 'Alcachofas Confitadas en Aceite de Oliva con Jamón Ibérico',
    description: 'Corazones tiernos de alcachofa confitados a baja temperatura con virutas de jamón ibérico.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Las alcachofas confitadas en su aceite aguantan hasta 10 días en frío.',
    diet_adaptation: 'Miembro a dieta: diurética, depurativa y muy rica en cinarina hepática.',
    emoji: '🥬',
    macros: { calories: 240, protein: 12, carbs: 14, fat: 15 },
    ingredients: [
      { name: 'Corazones de alcachofa cocidos', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Alcachofas frasco o frescas' },
      { name: 'Virutas de jamón ibérico', quantity: 25, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón ibérico virutas' },
      { name: 'Diente de ajo laminado', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-8',
    title: 'Brócoli Asado al Horno con Limón, Ajo y Parmesano',
    description: 'Ramilletes de brócoli horneados a alta temperatura con puntas crujientes, zumo de limón y queso rallado.',
    type: 'verdura',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Textura crujiente inigualable que sorprende a los escépticos del brócoli.',
    diet_adaptation: 'Miembro a dieta: preparación muy baja en calorías y rica en antioxidantes.',
    emoji: '🥦',
    macros: { calories: 180, protein: 8, carbs: 12, fat: 11 },
    ingredients: [
      { name: 'Brócoli en ramilletes pequeños', quantity: 220, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Brócoli fresco' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Ajo en polvo y pimienta negra', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Ajo molido' },
      { name: 'Limón exprimido', quantity: 10, unit: 'ml', category: 'frescos_verdura', supermarket_ref: 'Limones' },
      { name: 'Queso parmesano rallado', quantity: 15, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Parmesano polvo' }
    ]
  },
  {
    id: 'veg-9',
    title: 'Coliflor Gratinada con Bechamel Ligera de Nuez Moscada',
    description: 'Ramilletes suaves de coliflor al vapor cubiertos con bechamel casera suave y gratinados al horno.',
    type: 'verdura',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Un clásico reconfortante que gusta a toda la familia.',
    diet_adaptation: 'Miembro a dieta: elaborar la bechamel con leche desnatada y fécula de maíz ligera.',
    emoji: '🥦',
    macros: { calories: 250, protein: 10, carbs: 24, fat: 13 },
    ingredients: [
      { name: 'Coliflor en ramilletes al vapor', quantity: 250, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Coliflor pieza' },
      { name: 'Leche semidesnatada', quantity: 100, unit: 'ml', category: 'lacteos_huevos', supermarket_ref: 'Leche brick' },
      { name: 'Harina de trigo o maicena', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Harina trigo' },
      { name: 'Mantequilla o AOVE', quantity: 8, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mantequilla' },
      { name: 'Queso rallado para gratinar', quantity: 20, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso rallado' }
    ]
  },
  {
    id: 'veg-10',
    title: 'Menestra de Verduras Tradicional de la Ribera',
    description: 'Guiso limpio con espárragos, alcachofas, guisantes, habitas y zanahoria pochadas en caldo suave.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Se conserva hasta 4 días y admite congelación.',
    diet_adaptation: 'Miembro a dieta: verdura limpia hervida en caldo casero, 100% saciante.',
    emoji: '🥕',
    macros: { calories: 170, protein: 7, carbs: 24, fat: 5 },
    ingredients: [
      { name: 'Surtido de verduras para menestra', quantity: 250, unit: 'g', category: 'congelados', supermarket_ref: 'Menestra verduras congelada' },
      { name: 'Cebolla picada pochada', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla' },
      { name: 'Caldo vegetal casero', quantity: 100, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo verduras brick' },
      { name: 'Ajo y perejil picado', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Perejil' },
      { name: 'Aceite de oliva virgen extra', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-11',
    title: 'Espinacas a la Crema Suave con Piñones Tostados',
    description: 'Espinacas tiernas cocinadas con crema suave de leche evaporada, nuez moscada y piñones crujientes.',
    type: 'verdura',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Guarnición o plato de cena rápida en 15 minutos.',
    diet_adaptation: 'Miembro a dieta: la leche evaporada reduce a la mitad la grasa respecto a la nata tradicional.',
    emoji: '🥬',
    macros: { calories: 200, protein: 7, carbs: 11, fat: 15 },
    ingredients: [
      { name: 'Espinacas frescas en hojas', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas bolsa' },
      { name: 'Leche evaporada ligera', quantity: 60, unit: 'ml', category: 'lacteos_huevos', supermarket_ref: 'Leche evaporada brick' },
      { name: 'Piñones ibéricos tostados', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Piñones' },
      { name: 'Ajo y nuez moscada', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Nuez moscada' }
    ]
  },
  {
    id: 'veg-12',
    title: 'Champiñones al Ajillo con Jamón Serrano y Vino Blanco',
    description: 'Champiñones frescos en cuartos salteados a fuego alegre con ajo picado, vino blanco y taquitos de jamón.',
    type: 'verdura',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Ideal como aperitivo o para acompañar carnes y pescados.',
    diet_adaptation: 'Miembro a dieta: champiñones limpios muy bajos en calorías y ricos en agua y potasio.',
    emoji: '🍄',
    macros: { calories: 190, protein: 11, carbs: 7, fat: 12 },
    ingredients: [
      { name: 'Champiñones frescos limpios', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñones bandeja' },
      { name: 'Ajo picado y perejil', quantity: 10, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Taquitos de jamón serrano magro', quantity: 25, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón taquitos' },
      { name: 'Vino blanco de cocina', quantity: 15, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Vino blanco' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-13',
    title: 'Zanahorias Glaseadas al Horno con Tomillo y Miel',
    description: 'Zanahorias tiernas asadas enteras con un toque de miel silvestre, tomillo y sal marina.',
    type: 'verdura',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Acompañamiento versátil que mantiene su textura y dulzor varios días.',
    diet_adaptation: 'Miembro a dieta: excelente fuente de betacarotenos y antioxidantes.',
    emoji: '🥕',
    macros: { calories: 150, protein: 2, carbs: 26, fat: 4 },
    ingredients: [
      { name: 'Zanahorias frescas peladas', quantity: 250, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Zanahorias bolsa' },
      { name: 'Miel de flores', quantity: 8, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Miel' },
      { name: 'Tomillo seco y sal', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Tomillo bote' },
      { name: 'Aceite de oliva virgen extra', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-14',
    title: 'Espárragos Trigueros Envueltos en Jamón Serrano a la Plancha',
    description: 'Espárragos verdes crujientes enrollados en lonchas de jamón y dorados en sartén sin grasa añadida.',
    type: 'verdura',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Servir recién hechos para disfrutar del jamón crujiente y el espárrago jugoso.',
    diet_adaptation: 'Miembro a dieta: plato cetogénico, alto en proteína y casi nulo en hidratos.',
    emoji: '🥓',
    macros: { calories: 200, protein: 17, carbs: 5, fat: 12 },
    ingredients: [
      { name: 'Espárragos trigueros verdes', quantity: 150, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espárragos verdes' },
      { name: 'Jamón serrano en lonchas finas', quantity: 45, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón serrano lonchas' },
      { name: 'Pimienta negra molida', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimienta molida' }
    ]
  },
  {
    id: 'veg-15',
    title: 'Calabaza Asada con Romero, Ajo y Queso Feta',
    description: 'Medias lunas de calabaza caramelizadas en el horno, coronadas con queso feta cremoso y romero fresco.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'La calabaza asada se puede usar también como base para purés rápidos.',
    diet_adaptation: 'Miembro a dieta: la calabaza sacia muchísimo con apenas 30 kcal por 100g.',
    emoji: '🎃',
    macros: { calories: 200, protein: 6, carbs: 23, fat: 10 },
    ingredients: [
      { name: 'Calabaza cacahuete en gajos', quantity: 250, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabaza trozo' },
      { name: 'Queso feta en dados', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso feta' },
      { name: 'Romero fresco y ajo chafado', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Romero maceta' },
      { name: 'Aceite de oliva virgen extra', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-16',
    title: 'Salteado Wok de Verduras Asiáticas con Sésamo y Soja',
    description: 'Pimiento rojo, zanahoria en juliana, calabacín y brócoli salteados al wok con salsa de soja baja en sal y sésamo.',
    type: 'verdura',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Cocinar a fuego vivo para mantener las verduras firmes y crujientes.',
    diet_adaptation: 'Miembro a dieta: verduras crujientes con alto contenido de agua y fibra.',
    emoji: '🥢',
    macros: { calories: 150, protein: 5, carbs: 17, fat: 7 },
    ingredients: [
      { name: 'Pimiento rojo y calabacín en juliana', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimiento y calabacín' },
      { name: 'Brócoli en floretes chicos', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Brócoli fresco' },
      { name: 'Zanahoria rallada', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Zanahorias' },
      { name: 'Salsa de soja baja en sal', quantity: 15, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Soja baja sal' },
      { name: 'Semillas de sésamo y AOVE', quantity: 5, unit: 'g', category: 'especias_aceites', supermarket_ref: 'Sésamo' }
    ]
  },
  {
    id: 'veg-17',
    title: 'Tomates Asados Provenzales con Ajo, Pan Rallado y Perejil',
    description: 'Tomates maduros por la mitad horneados con una costra dorada de pan rallado, ajo, perejil y orégano.',
    type: 'verdura',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Un acompañamiento provenzal ligero y aromático.',
    diet_adaptation: 'Miembro a dieta: guarnición muy ligera y saciante para acompañar carnes magras.',
    emoji: '🍅',
    macros: { calories: 140, protein: 3, carbs: 18, fat: 6 },
    ingredients: [
      { name: 'Tomates maduros carnosos', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Tomates pera' },
      { name: 'Pan rallado fino', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pan rallado' },
      { name: 'Ajo picado y perejil fresco', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Perejil' },
      { name: 'Hierbas provenzales y AOVE', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-18',
    title: 'Acelgas Salteadas a la Extremeña con Pimentón y Patata',
    description: 'Hojas y pencas de acelga rehogadas con ajo en láminas, pimentón de la Vera y dados de patata cocida.',
    type: 'verdura',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Cena tradicional reconfortante y muy digestiva.',
    diet_adaptation: 'Miembro a dieta: cena saciante, rica en minerales y muy fácil de digerir.',
    emoji: '🥬',
    macros: { calories: 180, protein: 5, carbs: 24, fat: 7 },
    ingredients: [
      { name: 'Acelgas frescas limpias', quantity: 250, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Acelgas bolsa' },
      { name: 'Patata cocida en dados', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Patatas' },
      { name: 'Dientes de ajo y pimentón', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimentón dulce' },
      { name: 'Aceite de oliva virgen extra', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-19',
    title: 'Pimientos del Piquillo Rellenos de Brandada de Bacalao',
    description: 'Pimientos dulces rellenos de emulsión suave de bacalao desalado y patata con salsa napada fina.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Pueden dejarse preparados en bandeja para hornear antes de servir.',
    diet_adaptation: 'Miembro a dieta: plato noble y equilibrado en proteína y verdura.',
    emoji: '🌶️',
    macros: { calories: 280, protein: 18, carbs: 21, fat: 13 },
    ingredients: [
      { name: 'Pimientos del piquillo enteros', quantity: 4, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Pimientos piquillo frasco' },
      { name: 'Migas de bacalao desalado', quantity: 90, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacalao desalado migas' },
      { name: 'Patata cocida chafada', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Patatas' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-20',
    title: 'Puerros Asados con Vinagreta Templada de Mostaza y Avellanas',
    description: 'Puerros cocidos al vapor y terminados al grill con vinagreta tibia de mostaza de Dijon y avellanas picadas.',
    type: 'verdura',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Excelente primer plato templado o frío con un toque sofisticado.',
    diet_adaptation: 'Miembro a dieta: el puerro es altamente diurético y favorece el tránsito.',
    emoji: '🥢',
    macros: { calories: 180, protein: 4, carbs: 15, fat: 12 },
    ingredients: [
      { name: 'Puerros gruesos limpios', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Puerros manojo' },
      { name: 'Avellanas tostadas picadas', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Avellanas tostadas' },
      { name: 'Mostaza de Dijon y vinagre', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Mostaza Dijon' },
      { name: 'Aceite de oliva virgen extra', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-21',
    title: 'Carpaccio Tibio de Calabacín con Queso Curado y Piñones',
    description: 'Láminas ultrafinas de calabacín salteadas 1 minuto en sartén con virutas de queso curado y piñones.',
    type: 'verdura',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Preparar y servir en 10 minutos para mantener la textura crujiente.',
    diet_adaptation: 'Miembro a dieta: entrante o cena ligera con grasas saludables y fibra vegetal.',
    emoji: '🥒',
    macros: { calories: 200, protein: 8, carbs: 6, fat: 16 },
    ingredients: [
      { name: 'Calabacín en láminas finas', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabacín verde' },
      { name: 'Queso semicurado o curado en virutas', quantity: 25, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso curado' },
      { name: 'Piñones tostados', quantity: 8, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Piñones' },
      { name: 'Aceite de oliva virgen extra y sal marina', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-22',
    title: 'Coles de Bruselas Tostadas al Horno con Bacon Crujiente',
    description: 'Coles de Bruselas cortadas por la mitad asadas a fuego fuerte hasta caramelizar sus azúcares naturales.',
    type: 'verdura',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Cero amargor gracias al tostado del horno que carameliza sus hojas.',
    diet_adaptation: 'Miembro a dieta: alto contenido en vitamina C y fibra vegetal.',
    emoji: '🥬',
    macros: { calories: 210, protein: 9, carbs: 12, fat: 14 },
    ingredients: [
      { name: 'Coles de Bruselas frescas limpias', quantity: 200, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Coles de Bruselas' },
      { name: 'Bacon ahumado en tiras', quantity: 30, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacon tiras' },
      { name: 'Aceite de oliva virgen extra', quantity: 6, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Pimienta negra recién molida', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimienta molida' }
    ]
  },
  {
    id: 'veg-23',
    title: 'Guiso de Cardo con Salsa Ligera de Almendras',
    description: 'Cardo en trozos tiernos guisado en salsa espesada de almendras tostadas majadas con ajo frito y caldo.',
    type: 'verdura',
    prep_time: 35,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Plato tradicional del norte que se conserva 4 días de forma excelente.',
    diet_adaptation: 'Miembro a dieta: el cardo es casi 95% agua, perfecto para controlar el balance calórico.',
    emoji: '🥬',
    macros: { calories: 220, protein: 7, carbs: 17, fat: 14 },
    ingredients: [
      { name: 'Cardo en conserva limpio', quantity: 250, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Cardo en conserva frasco' },
      { name: 'Almendras crudas peladas tostadas', quantity: 25, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Almendra pelada' },
      { name: 'Dientes de ajo', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Caldo vegetal', quantity: 100, unit: 'ml', category: 'despensa_legumbres', supermarket_ref: 'Caldo vegetal' },
      { name: 'Aceite de oliva virgen extra', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-24',
    title: 'Bimi Salteado al Ajillo con Guindilla y Semillas de Lino',
    description: 'Tallos tiernos de bimi salteados 4 minutos al dente con ajo dorado, toque picante y semillas crujientes.',
    type: 'verdura',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Cocción breve para preservar su color verde vivo y sus nutrientes.',
    diet_adaptation: 'Miembro a dieta: verdura de diseño natural con bajo impacto glucémico.',
    emoji: '🥦',
    macros: { calories: 130, protein: 5, carbs: 8, fat: 9 },
    ingredients: [
      { name: 'Bimi fresco entero', quantity: 180, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Bimi bandeja' },
      { name: 'Dientes de ajo laminados', quantity: 2, unit: 'uds', category: 'frescos_verdura', supermarket_ref: 'Ajo' },
      { name: 'Guindilla seca o cayena', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Guindilla' },
      { name: 'Aceite de oliva virgen extra', quantity: 7, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'veg-25',
    title: 'Milhojas de Calabacín, Tomate y Mozzarella al Horno',
    description: 'Capas alternadas de calabacín en rodajas, tomate natural y mozzarella fresca con orégano y albahaca.',
    type: 'verdura',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Hornear a 190°C hasta fundir y dorar ligeramente.',
    diet_adaptation: 'Miembro a dieta: cena vegetariana ligera, alta en agua y calcio.',
    emoji: '🍅',
    macros: { calories: 230, protein: 12, carbs: 12, fat: 15 },
    ingredients: [
      { name: 'Calabacín en rodajas finas', quantity: 140, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Calabacín verde' },
      { name: 'Tomate de ensalada en rodajas', quantity: 120, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomates rama' },
      { name: 'Mozzarella fresca escurrida', quantity: 70, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mozzarella fresca bola' },
      { name: 'Orégano seco y AOVE', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  }
];
