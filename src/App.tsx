import React, { useState } from 'react';
import { FamilyMenuProvider, useFamilyMenu } from './context/FamilyMenuContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import type { TabType } from './components/layout/BottomNav';
import { MacroSummaryBar } from './components/dashboard/MacroSummaryBar';
import { DaySelector } from './components/dashboard/DaySelector';
import { QuickSnacksSection } from './components/dashboard/QuickSnacksSection';
import { MealCard } from './components/dashboard/MealCard';
import { SwapMealModal } from './components/dashboard/SwapMealModal';
import { MemberList } from './components/members/MemberList';
import { GroceryListView } from './components/grocery/GroceryListView';
import { BatchCookingHub } from './components/batchcooking/BatchCookingHub';
import { MenuGeneratorModal } from './components/generator/MenuGeneratorModal';
import { SettingsModal } from './components/settings/SettingsModal';
import type { DayOfWeek, MealType, Recipe } from './types';
import { CalendarDays, Users, ShoppingCart, Flame, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { weeklyMeals, activeDay, setActiveDay, groceryItems } = useFamilyMenu();
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Estado para el modal de intercambio en caliente (Hot-Swap)
  const [swapState, setSwapState] = useState<{
    isOpen: boolean;
    day: DayOfWeek;
    mealType: MealType;
    recipe: Recipe | null;
  }>({
    isOpen: false,
    day: 'lunes',
    mealType: 'almuerzo',
    recipe: null,
  });

  const handleOpenSwap = (recipe: Recipe, mealType: MealType) => {
    setSwapState({
      isOpen: true,
      day: activeDay,
      mealType,
      recipe,
    });
  };

  const handleCloseSwap = () => {
    setSwapState((prev) => ({ ...prev, isOpen: false }));
  };

  // Comidas del día activo
  const lunchRecipe = weeklyMeals[`${activeDay}_almuerzo`];
  const dinnerRecipe = weeklyMeals[`${activeDay}_cena`];

  const pendingGroceryCount = groceryItems.filter((i) => !i.checked).length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Desktop Tab Switcher */}
        <div className="hidden sm:flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div className="flex items-center gap-2">
            {[
              { id: 'dashboard' as TabType, label: 'Menú Semanal', icon: CalendarDays },
              { id: 'members' as TabType, label: 'Familia & Raciones', icon: Users },
              {
                id: 'grocery' as TabType,
                label: 'Lista de la Compra',
                icon: ShoppingCart,
                count: pendingGroceryCount,
              },
              { id: 'batchcooking' as TabType, label: 'Batch Cooking (Domingo)', icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#E76F51] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive ? 'bg-white text-[#E76F51]' : 'bg-[#E76F51] text-white'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#E76F51] hover:text-[#D65F41] bg-white hover:bg-rose-50/50 px-3.5 py-2 rounded-2xl border border-rose-200 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Nuevas Ideas de Menú</span>
          </button>
        </div>

        {/* Tab 1: Dashboard (Plan Semanal) */}
        {currentTab === 'dashboard' && (
          <div className="space-y-4 pb-20 sm:pb-8 animate-in fade-in duration-200">
            {/* Macro Summary Ring / Bar */}
            <MacroSummaryBar />

            {/* Day Selector */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Días de la semana
                </span>
                <span className="text-xs text-stone-400">Toca un día para ver sus platos</span>
              </div>
              <DaySelector selectedDay={activeDay} onSelectDay={setActiveDay} />
            </div>

            {/* Meals for selected day: Almuerzo & Cena */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {lunchRecipe && (
                <MealCard
                  day={activeDay}
                  mealType="almuerzo"
                  recipe={lunchRecipe}
                  onOpenSwap={handleOpenSwap}
                />
              )}

              {dinnerRecipe && (
                <MealCard
                  day={activeDay}
                  mealType="cena"
                  recipe={dinnerRecipe}
                  onOpenSwap={handleOpenSwap}
                />
              )}
            </div>

            {/* Batch Cooking notice shortcut for Sunday en tonos cálidos */}
            <div
              onClick={() => setCurrentTab('batchcooking')}
              className="mt-4 p-4 rounded-3xl bg-gradient-to-r from-[#fbf4eb] to-[#f7f0f8] border border-[#ebd8c7] flex items-center justify-between gap-3 cursor-pointer hover:border-amber-300 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#523d46] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    ¿Quieres adelantar trabajo el domingo para no cocinar entre semana?
                  </h4>
                  <p className="text-xs text-stone-600">
                    Guía de Batch Cooking: sofritos, caldos y legumbres listos en solo 80 minutos.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#c26546] hidden sm:inline">
                Ver pasos sencillos →
              </span>
            </div>

            {/* Quick Zero-Prep Snacks Section */}
            <div className="mt-5">
              <QuickSnacksSection />
            </div>
          </div>
        )}

        {/* Tab 2: Familia & Raciones */}
        {currentTab === 'members' && (
          <div className="pb-20 sm:pb-8 animate-in fade-in duration-200">
            <MemberList />
          </div>
        )}

        {/* Tab 3: Lista de la Compra */}
        {currentTab === 'grocery' && (
          <div className="animate-in fade-in duration-200">
            <GroceryListView />
          </div>
        )}

        {/* Tab 4: Batch Cooking Hub */}
        {currentTab === 'batchcooking' && (
          <div className="animate-in fade-in duration-200">
            <BatchCookingHub />
          </div>
        )}
      </main>

      {/* Mobile-First Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        groceryPendingCount={pendingGroceryCount}
      />

      {/* Hot-Swap Modal */}
      <SwapMealModal
        isOpen={swapState.isOpen}
        onClose={handleCloseSwap}
        day={swapState.day}
        mealType={swapState.mealType}
        currentRecipe={swapState.recipe}
      />

      {/* Menu Generator Modal */}
      <MenuGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <FamilyMenuProvider>
      <MainContent />
    </FamilyMenuProvider>
  );
}

export default App;
