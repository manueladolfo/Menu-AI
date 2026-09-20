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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#10B981] to-[#0D9488] flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block leading-tight">
                Menu-AI
              </span>
              <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                Plan Familiar
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Planificación equilibrada para toda la familia
            </p>
          </div>
        </div>

        {/* Action Controls: adaptados para móvil sin agolpar y completos en escritorio */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cloud Sync Status: visible en móvil de forma compacta y completo en escritorio */}
          {syncStatus === 'synced' && (
            <span
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-800 bg-emerald-50 px-2 sm:px-2.5 py-1 rounded-full border border-emerald-200/80 font-bold shadow-2xs shrink-0"
              title="Sincronizado en la nube (Supabase)"
            >
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span>Nube</span>
            </span>
          )}
          {syncStatus === 'syncing' && (
            <span
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-800 bg-amber-50 px-2 sm:px-2.5 py-1 rounded-full border border-amber-200/80 font-bold shrink-0"
              title="Guardando cambios en Supabase..."
            >
              <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
              <span className="hidden xs:inline">Guardando...</span>
            </span>
          )}
          {syncStatus === 'offline' && (
            <span
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-stone-500 bg-stone-100 px-2 sm:px-2.5 py-1 rounded-full border border-stone-200 font-semibold shrink-0"
              title="Sin conexión a la nube - guardado local"
            >
              <Cloud className="w-3 h-3 text-stone-400" />
              <span>Local</span>
            </span>
          )}

          {/* Active Family Counter pill (Compacto en móvil, completo en escritorio) */}
          <div
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50/80 rounded-full text-xs font-semibold text-stone-700 border border-amber-200/60 shrink-0"
            title={`${activeMembersCount} de ${totalMembers} personas en casa`}
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px] sm:text-xs">
              <strong className="text-amber-900">{activeMembersCount}</strong>
              <span className="hidden sm:inline"> de {totalMembers} en casa</span>
            </span>
          </div>

          {/* Quick AI Generate button */}
          <button
            onClick={onOpenGenerator}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#E76F51] hover:bg-[#D65F41] text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-xs shrink-0"
            title="Generar menú semanal con IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">Ideas de Menú</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Configuración Supabase / IA"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSupabaseConfigured && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
