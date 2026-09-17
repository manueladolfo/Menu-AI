import React from 'react';
import { CalendarDays, Users, ShoppingCart, Flame } from 'lucide-react';

export type TabType = 'dashboard' | 'members' | 'grocery' | 'batchcooking';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  groceryPendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  groceryPendingCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Menú Semanal',
      icon: CalendarDays,
    },
    {
      id: 'members' as TabType,
      label: 'Familia',
      icon: Users,
    },
    {
      id: 'grocery' as TabType,
      label: 'Lista Compra',
      icon: ShoppingCart,
      badge: groceryPendingCount > 0 ? groceryPendingCount : null,
    },
    {
      id: 'batchcooking' as TabType,
      label: 'Batch Cooking',
      icon: Flame,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-t border-amber-950/10 sm:hidden">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-[#c26546] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 transition-transform' : ''}`} />
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-400 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#faf7f2]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-8 h-0.5 rounded-full bg-[#c26546]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
