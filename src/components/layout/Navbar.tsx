import React from 'react';
import { ChefHat, Settings, Users, Sparkles, Cloud, RefreshCw } from 'lucide-react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenGenerator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenGenerator }) => {
  const { activeMembersCount, members, isSupabaseConfigured, syncStatus } = useFamilyMenu();
  const totalMembers = members.length;

  return (
    <header className="sticky top-0 z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-amber-950/10 transition-all shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
            <ChefHat className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 tracking-tight text-lg">FamilyMenu</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100/80 text-amber-900">
                Cocina Fácil
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Ideas sencillas y tranquilas para toda la familia</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Indicator */}
          {syncStatus === 'synced' && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-bold"
              title="Conectado y sincronizado con Supabase en tiempo real"
            >
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span>Nube</span>
            </span>
          )}
          {syncStatus === 'syncing' && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 font-bold"
              title="Guardando cambios en Supabase..."
            >
              <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
              <span>Guardando...</span>
            </span>
          )}

          {/* Active Family Counter pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 rounded-full text-xs font-semibold text-stone-700 border border-amber-200/60">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>
              <strong className="text-amber-900">{activeMembersCount}</strong> de {totalMembers} en casa
            </span>
          </div>

          {/* Quick AI Generate button */}
          <button
            onClick={onOpenGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-rose-400 hover:opacity-95 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-xs"
            title="Generar menú semanal sin complicaciones"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-pulse" />
            <span className="hidden xs:inline">Ideas de Menú</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-xl transition-colors"
            title="Configuración Supabase / IA"
          >
            <Settings className="w-5 h-5" />
            {isSupabaseConfigured && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#faf7f2]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
