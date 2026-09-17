# 🍽️ FamilyMenu - Planificación Nutricional Familiar Inteligente

<p align="center">
  <img src="public/pwa-192x192.png" width="120" height="120" alt="FamilyMenu Logo" style="border-radius: 28px;" />
</p>

<p align="center">
  <strong>Planificador de menús semanales familiares, rotación equilibrada, batch cooking y lista de la compra inteligente con ingredientes accesibles de supermercado (Mercadona / Aldi).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Supabase-Database_%26_Realtime-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel" alt="Vercel" />
</p>

---

## 🌟 Características Principales

* **🍲 Rotación Nutricional Familiar:** Distribución equilibrada de legumbres, pescados blancos y azules, carnes magras, pastas integrales, sopas reconfortantes y opciones caseras de fin de semana (hamburguesas y pizzas saludables).
* **🥗 Ensaladas Frescas Diarias (0 min):** Acompañamiento fresco obligatorio para cada comida (tomate kumato aliñado, ensalada César ligera, caprese con pesto, campera, pipirrana, etc.).
* **🍿 Snacks Saciantes Inmediatos (0-2 min):** Propuestas rápidas sin cocinar (frutos secos, fruta con queso fresco batido, encurtidos y tostas crujientes).
* **🤖 Asistente Gemini AI a la Carta:**
  * Generación de recetas personalizadas según lo que tengas en la nevera.
  * Adaptación automática para familiares a dieta sin cocinar dos menús separados.
  * Opción de guardar selectivamente en el catálogo permanente de la familia.
* **🔗 Enlaces Directos a Elaboración:** Cada plato incluye accesos directos a la receta paso a paso en la web y vídeos de preparación en YouTube.
* **👥 Perfiles Familiares y Cálculo Metabólico:** Cálculo de calorías y macronutrientes individualizado por edad, sexo y nivel de actividad, con interruptores estacionales para miembros que están fuera.
* **🛒 Lista de la Compra Inteligente por Pasillos:** Consolida y escala automáticamente los ingredientes según las personas activas en casa, organizada por secciones del súper (Frutería, Carnicería/Pescadería, Lácteos, Despensa, etc.).
* **☁️ Sincronización en la Nube con Supabase:** Menú y lista de la compra compartida en tiempo real entre todos los móviles de la familia.
* **📱 Soporte PWA (Web, iPhone, iPad y Android):** Instalable en la pantalla de inicio con iconos oficiales adaptados.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19, TypeScript, Vite.
* **Estilos:** Tailwind CSS con paleta cálida mediterránea.
* **Inteligencia Artificial:** Google Generative AI (Gemini 2.5 Flash Lite y Flash) con sistema de cascada anti-sobrecarga.
* **Base de Datos & Tiempo Real:** Supabase (PostgreSQL + Realtime).
* **Iconografía:** Lucide React.
* **Alojamiento:** Vercel con integración continua desde GitHub.

---

## 🚀 Despliegue y Variables de Entorno

Para ejecutar o desplegar el proyecto, configura las siguientes variables en tu archivo `.env` o en el panel de Vercel:

```env
VITE_GEMINI_API_KEY=tu_clave_de_google_gemini
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/manueladolfo/Menu-AI.git

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```
