import type { Recipe } from '../../types';

export const FAST_FOOD_RECIPES: Recipe[] = [
  {
    id: 'ff-1',
    title: 'Hamburguesa Casera de Ternera con Cebolla Caramelizada',
    description: 'Hamburguesas de ternera magra especiada con cebolla pochada lentamente y queso semicurado en pan brioche.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Puedes formar los medallones de carne y congelarlos en crudo separados con papel vegetal.',
    diet_adaptation: 'Miembro a dieta: consumir la hamburguesa al plato sin pan acompañada de ensalada verde o verduras.',
    emoji: '🍔',
    macros: { calories: 590, protein: 38, carbs: 46, fat: 28 },
    ingredients: [
      { name: 'Carne picada de ternera magra', quantity: 150, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Ternera picada fresca' },
      { name: 'Pan de hamburguesa brioche', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan burger brioche' },
      { name: 'Cebolla dulce', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Cebolla dulce' },
      { name: 'Queso semicurado en lonchas', quantity: 1, unit: 'loncha', category: 'lacteos_huevos', supermarket_ref: 'Queso semicurado lonchas' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'ff-2',
    title: 'Pizza Casera Margarita al Horno',
    description: 'Masa fina y crujiente con salsa de tomate triturado natural, orégano, mozzarella fundente y albahaca fresca.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'La masa se puede prehornear durante 5 minutos y congelar lista para añadir ingredientes.',
    diet_adaptation: 'Miembro a dieta: tomar 1-2 porciones acompañando con abundante ensalada de tomate y pepino.',
    emoji: '🍕',
    macros: { calories: 520, protein: 22, carbs: 64, fat: 18 },
    ingredients: [
      { name: 'Masa de pizza fina', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa fresca pizza' },
      { name: 'Tomate triturado natural', quantity: 70, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate triturado' },
      { name: 'Queso mozzarella rallado', quantity: 60, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mozzarella rallada' },
      { name: 'Albahaca fresca y orégano', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Albahaca maceta' },
      { name: 'Aceite de oliva virgen extra', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'ff-3',
    title: 'Tacos de Pollo Desmechado con Guacamole y Pico de Gallo',
    description: 'Tortillas de maíz rellenas de pechuga de pollo marinada con comino, lima y pico de gallo refrescante.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'El pollo marinado desmechado se conserva hasta 4 días en la nevera.',
    diet_adaptation: 'Miembro a dieta: consumir el pollo y guacamole sobre hojas de lechuga tipo cogollo como wrap vegetal.',
    emoji: '🌮',
    macros: { calories: 480, protein: 35, carbs: 42, fat: 16 },
    ingredients: [
      { name: 'Pechuga de pollo limpia', quantity: 150, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga entera' },
      { name: 'Tortillas de maíz', quantity: 2, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Tortillas de maíz' },
      { name: 'Aguacate maduro', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Aguacate' },
      { name: 'Tomate maduro y cebolleta', quantity: 60, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomate ensalada' },
      { name: 'Lima y cilantro fresco', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Cilantro fresco' }
    ]
  },
  {
    id: 'ff-4',
    title: 'Quesadillas Doradas de Pavo y Queso Gouda',
    description: 'Tortillas tostadas en sartén hasta quedar doradas con queso fundente y fiambre de pavo artesano.',
    type: 'fast_food',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Consumir al instante para disfrutar del queso fundido y la masa crujiente.',
    diet_adaptation: 'Miembro a dieta: utilizar tortilla integral y queso bajo en grasa.',
    emoji: '🧀',
    macros: { calories: 440, protein: 26, carbs: 38, fat: 19 },
    ingredients: [
      { name: 'Tortilla de trigo o integral', quantity: 1, unit: 'ud grande', category: 'despensa_legumbres', supermarket_ref: 'Tortillas wrap' },
      { name: 'Pechuga de pavo braseada', quantity: 80, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pavo en lonchas 95%' },
      { name: 'Queso gouda rallado', quantity: 50, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso gouda' },
      { name: 'Orégano seco', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Orégano' }
    ]
  },
  {
    id: 'ff-5',
    title: 'Burrito Completo de Frijoles Negros, Arroz y Pollo',
    description: 'Rollo mexicano con frijoles sazonados, pollo tierno y arroz con toque de cilantro.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se pueden envolver en papel de aluminio individualmente y congelar.',
    diet_adaptation: 'Miembro a dieta: plato completo; prescindir de salsas procesadas y añadir lima.',
    emoji: '🌯',
    macros: { calories: 540, protein: 34, carbs: 60, fat: 16 },
    ingredients: [
      { name: 'Tortilla wrap grande', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Tortillas XL' },
      { name: 'Frijoles negros cocidos', quantity: 80, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Frijoles negros bote' },
      { name: 'Pechuga de pollo a la plancha', quantity: 120, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga de pollo' },
      { name: 'Arroz blanco cocido', quantity: 60, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Vasito arroz' },
      { name: 'Salsa mexicana suave', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Salsa dip mexicana' }
    ]
  },
  {
    id: 'ff-6',
    title: 'Perrito Caliente Gourmet con Chucrut y Mostaza Antigua',
    description: 'Salchicha frankfurt de calidad superior con pepinillo agridulce, cebolla y mostaza de grano.',
    type: 'fast_food',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Montar al momento.',
    diet_adaptation: 'Miembro a dieta: consumir la salchicha a la plancha con el chucrut y mostaza sin el pan.',
    emoji: '🌭',
    macros: { calories: 460, protein: 18, carbs: 40, fat: 23 },
    ingredients: [
      { name: 'Pan de hot dog', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan perrito' },
      { name: 'Salchicha bratwurst premium', quantity: 1, unit: 'ud (90g)', category: 'carniceria_pescaderia', supermarket_ref: 'Salchicha bratwurst' },
      { name: 'Pepinillos agridulces en láminas', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pepinillos bote' },
      { name: 'Mostaza a la antigua en grano', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Mostaza Dijon grano' },
      { name: 'Cebolla frita crujiente', quantity: 10, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Cebolla frita bote' }
    ]
  },
  {
    id: 'ff-7',
    title: 'Nuggets Caseros de Pollo Crujientes al Horno con Copos de Maíz',
    description: 'Tiras tiernas de pechuga rebozadas en copos de maíz sin azúcar triturados y doradas al horno sin fritura.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Congelan fenomenal ya empanados en crudo. Hornear directos del congelador 20 min.',
    diet_adaptation: 'Miembro a dieta: rebozado al horno muy saludable y ligero.',
    emoji: '🍗',
    macros: { calories: 410, protein: 38, carbs: 30, fat: 11 },
    ingredients: [
      { name: 'Pechuga de pollo limpia en trozos', quantity: 160, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga de pollo' },
      { name: 'Copos de maíz sin azúcar', quantity: 40, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Corn flakes' },
      { name: 'Huevo fresco', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos camperos' },
      { name: 'Ajo en polvo y pimentón', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Ajo molido' },
      { name: 'Aceite de oliva en spray', quantity: 3, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE spray' }
    ]
  },
  {
    id: 'ff-8',
    title: 'Pizza Cuatro Quesos con Base Fina',
    description: 'Combinación equilibrada de mozzarella, gorgonzola, emmental y parmesano con orégano silvestre.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Hornear a temperatura máxima en la parte baja del horno para base crujiente.',
    diet_adaptation: 'Miembro a dieta: controlar el tamaño de la ración y acompañar con ensalada de rúcula.',
    emoji: '🍕',
    macros: { calories: 580, protein: 26, carbs: 52, fat: 28 },
    ingredients: [
      { name: 'Base fina de pizza', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Base de pizza fresca' },
      { name: 'Tomate frito suave', quantity: 40, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate frito casero' },
      { name: 'Mezcla cuatro quesos rallados', quantity: 80, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Cuatro quesos bolsa' },
      { name: 'Orégano seco silvestre', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Orégano' }
    ]
  },
  {
    id: 'ff-9',
    title: 'Wrap Ligero de Pollo Asado con Aguacate y Espinacas',
    description: 'Tortilla de trigo integral con tiras de pollo a la plancha, aguacate cremoso, espinacas baby y salsa de yogur.',
    type: 'fast_food',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Ideal para llevar en táper envuelto bien prensado.',
    diet_adaptation: 'Miembro a dieta: perfecto tal cual, alto en proteína y fibra.',
    emoji: '🌯',
    macros: { calories: 410, protein: 32, carbs: 35, fat: 14 },
    ingredients: [
      { name: 'Tortilla integral wrap', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Tortillas integrales' },
      { name: 'Pechuga de pollo a la plancha', quantity: 120, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga pollo' },
      { name: 'Aguacate en láminas', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Aguacate' },
      { name: 'Espinacas baby frescas', quantity: 30, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Espinacas baby' },
      { name: 'Yogur natural griego', quantity: 30, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Yogur griego' }
    ]
  },
  {
    id: 'ff-10',
    title: 'Hamburguesa Crujiente de Pollo al Horno con Mayonesa de Lima',
    description: 'Filete de contramuslo jugoso empanado con panko al horno, lechuga iceberg crujiente y toque de lima.',
    type: 'fast_food',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Consumir recién hecho para mantener el rebozado crocante.',
    diet_adaptation: 'Miembro a dieta: consumir el pollo crujiente sobre ensalada mixta sin pan.',
    emoji: '🍔',
    macros: { calories: 510, protein: 36, carbs: 45, fat: 19 },
    ingredients: [
      { name: 'Contramuslo de pollo deshuesado', quantity: 150, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Contramuslos deshuesados' },
      { name: 'Pan rallado panko', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Panko japonés' },
      { name: 'Pan de hamburguesa rústico', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan de hamburguesa' },
      { name: 'Lechuga iceberg y tomate', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Lechuga iceberg' },
      { name: 'Mayonesa ligera con lima', quantity: 15, unit: 'g', category: 'especias_aceites', supermarket_ref: 'Mayonesa ligera' }
    ]
  },
  {
    id: 'ff-11',
    title: 'Boniatos en Gajos al Horno con Especias Cajún',
    description: 'Gajos crujientes por fuera y tiernos por dentro con pimentón, romero, tomillo y ajo.',
    type: 'fast_food',
    prep_time: 30,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Hornear a 200°C con aire para máxima textura crujiente.',
    diet_adaptation: 'Miembro a dieta: excelente fuente de carbohidrato complejo rico en betacarotenos.',
    emoji: '🍟',
    macros: { calories: 250, protein: 4, carbs: 48, fat: 6 },
    ingredients: [
      { name: 'Boniato o batata naranja', quantity: 250, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Boniato fresco' },
      { name: 'Aceite de oliva virgen extra', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' },
      { name: 'Especias cajún o pimentón dulce', quantity: 1, unit: 'cdta', category: 'especias_aceites', supermarket_ref: 'Pimentón dulce' },
      { name: 'Sal marina fina', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Sal fina' }
    ]
  },
  {
    id: 'ff-12',
    title: 'Fajitas de Ternera con Pimientos Salteados Tricolor',
    description: 'Tiras de ternera salteadas a fuego vivo junto a pimientos rojo, verde y cebolla servidas con tortillas templadas.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'El salteado de verduras y ternera aguanta 3 días en refrigeración.',
    diet_adaptation: 'Miembro a dieta: consumir el salteado en plato con guacamole sin las tortillas de trigo.',
    emoji: '🌮',
    macros: { calories: 470, protein: 34, carbs: 42, fat: 16 },
    ingredients: [
      { name: 'Filetes de ternera en tiras', quantity: 150, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Ternera en tiras' },
      { name: 'Pimiento rojo y verde', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Pimientos' },
      { name: 'Cebolla morada', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Cebolla morada' },
      { name: 'Tortillas de trigo', quantity: 2, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Tortillas trigo' },
      { name: 'Sazonador de fajitas y AOVE', quantity: 8, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'ff-13',
    title: 'Pizza Barbacoa Casera con Pollo y Tiras de Bacon',
    description: 'Masa fina con salsa barbacoa suave, dados de pollo asado, cebolla morada y tiras doradas de bacon.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Alternativa deliciosa y mucho menos procesada que las pizzas comerciales.',
    diet_adaptation: 'Miembro a dieta: tomar 2 porciones y acompañar con ensalada de hojas verdes.',
    emoji: '🍕',
    macros: { calories: 570, protein: 32, carbs: 58, fat: 21 },
    ingredients: [
      { name: 'Base de pizza fresca', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa de pizza' },
      { name: 'Pechuga de pollo cocida picada', quantity: 80, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Pechuga pollo' },
      { name: 'Bacon ahumado en tiras', quantity: 25, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacon tiras' },
      { name: 'Salsa barbacoa', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Salsa barbacoa' },
      { name: 'Queso mozzarella rallado', quantity: 50, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mozzarella rallada' }
    ]
  },
  {
    id: 'ff-14',
    title: 'Sándwich Club Tradicional de Tres Pisos',
    description: 'Clásico sándwich tostado con jamón cocido, queso emmental, bacon, pechuga a la plancha, lechuga y tomate.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Tostar el pan en el último momento para que conserve su textura crujiente.',
    diet_adaptation: 'Miembro a dieta: prescindir de la rebanada intermedia y de la mayonesa.',
    emoji: '🥪',
    macros: { calories: 520, protein: 34, carbs: 38, fat: 22 },
    ingredients: [
      { name: 'Pan de molde rústico', quantity: 3, unit: 'rebanadas', category: 'despensa_legumbres', supermarket_ref: 'Pan de molde rústico' },
      { name: 'Pechuga de pollo a la plancha', quantity: 80, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Filetes pollo' },
      { name: 'Bacon en lonchas dorado', quantity: 20, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Bacon lonchas' },
      { name: 'Queso emmental', quantity: 1, unit: 'loncha', category: 'lacteos_huevos', supermarket_ref: 'Queso emmental' },
      { name: 'Tomate y lechuga fresca', quantity: 50, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Tomate ensalada' }
    ]
  },
  {
    id: 'ff-15',
    title: 'Totopos Caseros al Horno con Queso Fundido y Jalapeños',
    description: 'Triángulos de maíz horneados con carne picada sazonada, queso cheddar fundido y rodajas de jalapeño.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Servir en la misma bandeja del horno bien caliente.',
    diet_adaptation: 'Miembro a dieta: moderar la porción y acompañar con abundante pico de gallo natural.',
    emoji: '🧀',
    macros: { calories: 490, protein: 24, carbs: 45, fat: 23 },
    ingredients: [
      { name: 'Totopos de maíz naturales', quantity: 60, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Totopos maíz bolsa' },
      { name: 'Carne picada especiada', quantity: 80, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Carne picada mixta' },
      { name: 'Queso cheddar rallado', quantity: 50, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Cheddar rallado' },
      { name: 'Jalapeños en conserva en rodajas', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Jalapeños bote' }
    ]
  },
  {
    id: 'ff-16',
    title: 'Bao Buns al Vapor Rellenos de Cerdo Laqueado Teriyaki',
    description: 'Panecillos orientales al vapor rellenos de tiras de magro de cerdo meloso y cebolleta fina.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'El relleno de carne teriyaki se conserva 4 días en la nevera.',
    diet_adaptation: 'Miembro a dieta: consumir la carne teriyaki sobre base de arroz basmati y verduras al vapor.',
    emoji: '🥟',
    macros: { calories: 450, protein: 25, carbs: 54, fat: 13 },
    ingredients: [
      { name: 'Panecillos bao para vapor', quantity: 2, unit: 'uds', category: 'despensa_legumbres', supermarket_ref: 'Bao buns' },
      { name: 'Magro de cerdo en tiras', quantity: 140, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Lomo de cerdo' },
      { name: 'Salsa teriyaki', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Salsa teriyaki' },
      { name: 'Cebolleta y sésamo tostado', quantity: 1, unit: 'pizca', category: 'frescos_verdura', supermarket_ref: 'Cebolleta' }
    ]
  },
  {
    id: 'ff-17',
    title: 'Smash Burger Casera Doble con Cheddar y Pepinillos',
    description: 'Medallones finos aplastados en sartén caliente para lograr bordes extra crujientes y queso fundido.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Hacer al momento en sartén humeante.',
    diet_adaptation: 'Miembro a dieta: preparar un solo medallón de carne y servir al plato con mostaza y pepinillos.',
    emoji: '🍔',
    macros: { calories: 610, protein: 40, carbs: 35, fat: 32 },
    ingredients: [
      { name: 'Carne picada de ternera fresca', quantity: 160, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Ternera picada' },
      { name: 'Pan de hamburguesa brioche', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan brioche' },
      { name: 'Queso cheddar en lonchas', quantity: 2, unit: 'lonchas', category: 'lacteos_huevos', supermarket_ref: 'Cheddar lonchas' },
      { name: 'Pepinillos en vinagre y mostaza', quantity: 20, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Pepinillos agridulces' }
    ]
  },
  {
    id: 'ff-18',
    title: 'Falafel Casero al Horno en Pan de Pita con Salsa Tahini',
    description: 'Croquetas especiadas de garbanzos triturados con perejil, comino y ajo, horneadas en pan de pita.',
    type: 'fast_food',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'La masa de falafel aguanta 3 días en crudo o se puede congelar en bolitas.',
    diet_adaptation: 'Miembro a dieta: hornear el falafel y servirlo sobre ensalada verde con aderezo de limón.',
    emoji: '🧆',
    macros: { calories: 450, protein: 17, carbs: 56, fat: 15 },
    ingredients: [
      { name: 'Garbanzos cocidos escurridos', quantity: 150, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Garbanzos bote' },
      { name: 'Pan de pita integral', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan pita integral' },
      { name: 'Perejil y cilantro frescos picados', quantity: 20, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Perejil' },
      { name: 'Pasta de tahini y limón', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tahini' },
      { name: 'Comino molido y AOVE', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE' }
    ]
  },
  {
    id: 'ff-19',
    title: 'Pizza Calzone de Ricotta, Jamón Cocido y Champiñones',
    description: 'Pizza doblada en media luna que retiene todo el vapor interno, dejando el relleno cremoso y aromático.',
    type: 'fast_food',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Hornear a 220°C con un pincelado fino de aceite por encima.',
    diet_adaptation: 'Miembro a dieta: consumir media ración acompañada de ensalada de canónigos.',
    emoji: '🥟',
    macros: { calories: 540, protein: 27, carbs: 62, fat: 18 },
    ingredients: [
      { name: 'Masa de pizza fresca', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa pizza fresca' },
      { name: 'Queso ricotta o requesón fresco', quantity: 50, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Ricotta' },
      { name: 'Jamón cocido en daditos', quantity: 50, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón cocido' },
      { name: 'Champiñones laminados', quantity: 40, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñones' },
      { name: 'Salsa de tomate triturado', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Tomate triturado' }
    ]
  },
  {
    id: 'ff-20',
    title: 'Sándwich Bikini Trufado Gourmet',
    description: 'Sándwich tostado con jamón ibérico, queso brie fundido y un toque aromático de crema de trufa.',
    type: 'fast_food',
    prep_time: 15,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Tostar a fuego suave con sartén tapada para fundir el queso sin quemar el pan.',
    diet_adaptation: 'Miembro a dieta: utilizar pan integral fino y jamón serrano magro.',
    emoji: '🥪',
    macros: { calories: 450, protein: 22, carbs: 32, fat: 25 },
    ingredients: [
      { name: 'Pan de masa madre rebanadas', quantity: 2, unit: 'rebanadas', category: 'despensa_legumbres', supermarket_ref: 'Pan masa madre' },
      { name: 'Jamón ibérico de cebo', quantity: 40, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Jamón ibérico' },
      { name: 'Queso brie', quantity: 45, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Queso brie' },
      { name: 'Salsa tartufata o aceite de trufa', quantity: 5, unit: 'g', category: 'especias_aceites', supermarket_ref: 'Tartufata' },
      { name: 'Mantequilla para tostar', quantity: 5, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mantequilla' }
    ]
  },
  {
    id: 'ff-21',
    title: 'Costillas de Cerdo al Horno Glaseadas con Barbacoa Suave',
    description: 'Tiras de costilla tiernas asadas en papillote y doradas con glaseado dulce y ahumado.',
    type: 'fast_food',
    prep_time: 45,
    difficulty: 'media',
    batch_cooking: true,
    batch_notes: 'Se pueden hornear previamente y dar el toque de grill antes de servir.',
    diet_adaptation: 'Miembro a dieta: retirar la grasa visible y acompañar con calabacín a la plancha.',
    emoji: '🍖',
    macros: { calories: 560, protein: 42, carbs: 20, fat: 32 },
    ingredients: [
      { name: 'Costillar de cerdo carnoso', quantity: 280, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Costillas de cerdo' },
      { name: 'Salsa barbacoa ahumada', quantity: 30, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Salsa barbacoa' },
      { name: 'Miel de flores', quantity: 5, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Miel' },
      { name: 'Pimentón y ajo molido', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimentón dulce' }
    ]
  },
  {
    id: 'ff-22',
    title: 'Aros de Cebolla Dulce al Horno con Rebozado Crujiente',
    description: 'Aros gruesos de cebolla dulce marinados y rebozados con panko especiado, horneados muy crujientes.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: false,
    batch_notes: 'Servir inmediatamente con salsa casera.',
    diet_adaptation: 'Miembro a dieta: rebozado horneado con apenas grasa añadida.',
    emoji: '🧅',
    macros: { calories: 260, protein: 6, carbs: 40, fat: 8 },
    ingredients: [
      { name: 'Cebolla dulce grande', quantity: 1, unit: 'ud', category: 'frescos_verdura', supermarket_ref: 'Cebolla dulce' },
      { name: 'Panko japonés crujiente', quantity: 45, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Panko' },
      { name: 'Huevo batido', quantity: 1, unit: 'ud', category: 'lacteos_huevos', supermarket_ref: 'Huevos camperos' },
      { name: 'Pimentón dulce y sal marina', quantity: 1, unit: 'pizca', category: 'especias_aceites', supermarket_ref: 'Pimentón' },
      { name: 'Aceite de oliva en spray', quantity: 4, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'AOVE spray' }
    ]
  },
  {
    id: 'ff-23',
    title: 'Perrito Caliente Tex-Mex con Chile Suave y Queso Fundido',
    description: 'Chili dog casero con salchicha de calidad, carne especiada con alubias y queso cheddar fundido.',
    type: 'fast_food',
    prep_time: 20,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'El chili con carne aguanta 4 días en la nevera o 3 meses congelado.',
    diet_adaptation: 'Miembro a dieta: tomar el chili sobre plato hondo con ensalada verde prescindiendo del pan.',
    emoji: '🌭',
    macros: { calories: 510, protein: 26, carbs: 45, fat: 22 },
    ingredients: [
      { name: 'Pan de hot dog tierno', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan hot dog' },
      { name: 'Salchicha frankfurt de carne', quantity: 1, unit: 'ud', category: 'carniceria_pescaderia', supermarket_ref: 'Salchicha carne' },
      { name: 'Carne picada cocinada con alubias', quantity: 80, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Carne picada' },
      { name: 'Queso cheddar rallado', quantity: 25, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Cheddar rallado' }
    ]
  },
  {
    id: 'ff-24',
    title: 'Pizza Blanca (Bianca) con Láminas de Patata y Romero',
    description: 'Especialidad romana sin tomate con láminas ultrafinas de patata dorada, romero fresco y panceta curada.',
    type: 'fast_food',
    prep_time: 30,
    difficulty: 'media',
    batch_cooking: false,
    batch_notes: 'Cortar la patata muy fina con mandolina para que se cocine en el horno.',
    diet_adaptation: 'Miembro a dieta: cambiar la panceta por tiras de pavo y aumentar la cantidad de romero.',
    emoji: '🍕',
    macros: { calories: 530, protein: 18, carbs: 60, fat: 21 },
    ingredients: [
      { name: 'Masa de pizza fresca', quantity: 120, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Masa fresca pizza' },
      { name: 'Patata cortada finísima', quantity: 80, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Patatas' },
      { name: 'Mozzarella fresca escurrida', quantity: 60, unit: 'g', category: 'lacteos_huevos', supermarket_ref: 'Mozzarella fresca' },
      { name: 'Panceta curada en tiras finas', quantity: 20, unit: 'g', category: 'carniceria_pescaderia', supermarket_ref: 'Panceta lonchas' },
      { name: 'Romero fresco y AOVE', quantity: 5, unit: 'ml', category: 'especias_aceites', supermarket_ref: 'Romero fresco' }
    ]
  },
  {
    id: 'ff-25',
    title: 'Hamburguesa Vegetal Casera de Lentejas y Champiñones',
    description: 'Medallones consistentes y sabrosos hechos con lentejas cocidas, champiñones dorados y nueces picadas.',
    type: 'fast_food',
    prep_time: 25,
    difficulty: 'fácil',
    batch_cooking: true,
    batch_notes: 'Se pueden congelar formadas en crudo separadas con film.',
    diet_adaptation: 'Miembro a dieta: 100% vegetal, ligera y saciante por su alto contenido en fibra.',
    emoji: '🍔',
    macros: { calories: 420, protein: 18, carbs: 55, fat: 12 },
    ingredients: [
      { name: 'Lentejas cocidas escurridas', quantity: 140, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Lentejas cocidas tarro' },
      { name: 'Champiñones salteados picados', quantity: 70, unit: 'g', category: 'frescos_verdura', supermarket_ref: 'Champiñones' },
      { name: 'Copos de avena suave', quantity: 25, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Copos avena' },
      { name: 'Nueces peladas picadas', quantity: 15, unit: 'g', category: 'despensa_legumbres', supermarket_ref: 'Nueces peladas' },
      { name: 'Pan de hamburguesa integral', quantity: 1, unit: 'ud', category: 'despensa_legumbres', supermarket_ref: 'Pan integral burger' }
    ]
  }
];
