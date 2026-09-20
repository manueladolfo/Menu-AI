import React, { useState } from 'react';
import type { DayOfWeek } from '../../types';
import type { DayMenuProposal } from '../../services/geminiService';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import {
  X,
  Sparkles,
  RefreshCw,
  Check,
  Bookmark,
  Calendar,
  Clock,
  Flame,
  ChefHat,
  Salad,
  Apple,
  Utensils,
  Refrigerator,
  Info,
} from 'lucide-react';

const DAYS_LIST: { id: DayOfWeek; label: string }[] = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
];

interface DayMenuProposalFloatingCardProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: DayMenuProposal;
  isGeneratingAlternative: boolean;
  onGenerateAlternative: (customFeedback?: string) => Promise<void>;
  photosCount?: number;
}

export const DayMenuProposalFloatingCard: React.FC<DayMenuProposalFloatingCardProps> = ({
  isOpen,
  onClose,
  proposal,
  isGeneratingAlternative,
  onGenerateAlternative,
  photosCount = 0,
}) => {
  const {
    activeDay,
    swapMeal,
    swapSalad,
    swapSnack,
    addRecipeToCatalog,
    addSaladToCatalog,
    addSnackToCatalog,
    applyFullDayMenu,
  } = useFamilyMenu();

  const [targetDay, setTargetDay] = useState<DayOfWeek>(activeDay || 'lunes');
  const [alternativePrompt, setAlternativePrompt] = useState('');
  const [showAlternativeInput, setShowAlternativeInput] = useState(false);

  // Estados de confirmación/feedback por tarjeta
  const [savedStatus, setSavedStatus] = useState<{
    lunchApplied?: boolean;
    lunchSaved?: boolean;
    lunchSaladApplied?: boolean;
    lunchSaladSaved?: boolean;
    dinnerApplied?: boolean;
    dinnerSaved?: boolean;
    dinnerSaladApplied?: boolean;
    dinnerSaladSaved?: boolean;
    snackApplied?: boolean;
    snackSaved?: boolean;
    allDayApplied?: boolean;
    allSavedToCatalog?: boolean;
  }>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Asignar Almuerzo
  const handleApplyLunch = () => {
    swapMeal(targetDay, 'almuerzo', proposal.lunch);
    setSavedStatus((prev) => ({ ...prev, lunchApplied: true }));
    showToast(`🍽️ Almuerzo asignado al ${targetDay.toUpperCase()}`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, lunchApplied: false })), 2000);
  };

  const handleSaveLunch = () => {
    addRecipeToCatalog(proposal.lunch);
    setSavedStatus((prev) => ({ ...prev, lunchSaved: true }));
    showToast(`📖 "${proposal.lunch.title}" guardada en el recetario`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, lunchSaved: false })), 2000);
  };

  // Asignar Ensalada Almuerzo
  const handleApplyLunchSalad = () => {
    swapSalad(targetDay, 'almuerzo', proposal.lunchSalad);
    setSavedStatus((prev) => ({ ...prev, lunchSaladApplied: true }));
    showToast(`🥗 Ensalada asignada al almuerzo del ${targetDay.toUpperCase()}`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, lunchSaladApplied: false })), 2000);
  };

  const handleSaveLunchSalad = () => {
    addSaladToCatalog(proposal.lunchSalad);
    setSavedStatus((prev) => ({ ...prev, lunchSaladSaved: true }));
    showToast(`🥗 Ensalada guardada en el catálogo`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, lunchSaladSaved: false })), 2000);
  };

  // Asignar Cena
  const handleApplyDinner = () => {
    swapMeal(targetDay, 'cena', proposal.dinner);
    setSavedStatus((prev) => ({ ...prev, dinnerApplied: true }));
    showToast(`🌙 Cena asignada al ${targetDay.toUpperCase()}`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, dinnerApplied: false })), 2000);
  };

  const handleSaveDinner = () => {
    addRecipeToCatalog(proposal.dinner);
    setSavedStatus((prev) => ({ ...prev, dinnerSaved: true }));
    showToast(`📖 "${proposal.dinner.title}" guardada en el recetario`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, dinnerSaved: false })), 2000);
  };


  // Asignar Snack
  const handleApplySnack = () => {
    swapSnack(targetDay, proposal.snack);
    setSavedStatus((prev) => ({ ...prev, snackApplied: true }));
    showToast(`🥜 Snack asignado al ${targetDay.toUpperCase()}`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, snackApplied: false })), 2000);
  };

  const handleSaveSnack = () => {
    addSnackToCatalog(proposal.snack);
    setSavedStatus((prev) => ({ ...prev, snackSaved: true }));
    showToast(`🥜 Snack guardado en el catálogo`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, snackSaved: false })), 2000);
  };

  // Aplicar Todo el Día al día seleccionado
  const handleApplyAllDay = () => {
    applyFullDayMenu(targetDay, proposal);
    setSavedStatus((prev) => ({ ...prev, allDayApplied: true }));
    showToast(`✨ ¡Día completo (${targetDay.toUpperCase()}) actualizado con almuerzo, cena, ensaladas y snack!`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, allDayApplied: false })), 2500);
  };

  // Guardar Todo al Recetario
  const handleSaveAllToCatalog = () => {
    addRecipeToCatalog(proposal.lunch);
    addRecipeToCatalog(proposal.dinner);
    addSaladToCatalog(proposal.lunchSalad);
    addSaladToCatalog(proposal.dinnerSalad);
    addSnackToCatalog(proposal.snack);
    setSavedStatus((prev) => ({ ...prev, allSavedToCatalog: true }));
    showToast(`📚 ¡Todas las recetas, ensaladas y snack guardados en tus recetarios!`);
    setTimeout(() => setSavedStatus((prev) => ({ ...prev, allSavedToCatalog: false })), 2500);
  };

  const handleTriggerAlternative = async () => {
    await onGenerateAlternative(alternativePrompt.trim() || undefined);
    setAlternativePrompt('');
    setShowAlternativeInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/60 backdrop-blur-md animate-in fade-in">
      {/* Tarjeta Flotante Principal */}
      <div className="bg-[#faf7f2] rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-amber-950/15 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Toast Notifier */}
        {toastMessage && (
          <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-150">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Cabecera Flotante */}
        <div className="p-4 sm:p-5 bg-white/90 border-b border-amber-950/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-sm">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                  Propuesta de Menú del Día
                </h2>
                {photosCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    📸 {photosCount} {photosCount === 1 ? 'Foto' : 'Fotos'}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Almuerzo, cena, ensaladas y snack diseñados con lo que hay en casa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors"
            title="Cerrar tarjeta flotante"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Día Objetivo y Resumen */}
        <div className="bg-[#fbf4eb] px-4 py-3 border-b border-amber-950/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-bold text-stone-800">Día a planificar:</span>
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value as DayOfWeek)}
              className="font-bold text-amber-900 bg-white border border-amber-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs"
            >
              {DAYS_LIST.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyAllDay}
              className="px-3 py-1.5 rounded-xl bg-[#382d27] hover:bg-[#28201c] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-transform active:scale-98"
            >
              {savedStatus.allDayApplied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>¡Aplicado al {targetDay}!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Aplicar Todo al {targetDay.charAt(0).toUpperCase() + targetDay.slice(1)}</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveAllToCatalog}
              title="Guardar todas las recetas en el recetario"
              className="p-1.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-stone-700 font-semibold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Guardar Todo</span>
            </button>
          </div>
        </div>

        {/* Ingredientes aprovechados / pendientes badge */}
        {(proposal.detectedIngredients && proposal.detectedIngredients.length > 0) && (
          <div className="px-4 py-2 bg-white/70 border-b border-amber-950/5 text-[11px] text-stone-600 flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-orange-800 flex items-center gap-1">
              <Refrigerator className="w-3.5 h-3.5 text-orange-600" />
              Aprovechados:
            </span>
            {proposal.detectedIngredients.slice(0, 5).map((ing, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-orange-950 font-medium text-[10px]"
              >
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Contenedor desplazable con las 4 tarjetas de resultados */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Almuerzo */}
          <div className="bg-white rounded-2xl border border-amber-950/10 p-4 shadow-2xs hover:border-amber-300 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl p-2 rounded-xl bg-amber-50 border border-amber-100">
                  {proposal.lunch.emoji || '🍲'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Almuerzo Principal
                    </span>
                    <span className="text-[11px] text-stone-400 capitalize">
                      {proposal.lunch.type}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                    {proposal.lunch.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                    {proposal.lunch.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Macros y tiempo */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-stone-400" />
                {proposal.lunch.prep_time} min
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Flame className="w-3 h-3 text-amber-500" />
                {proposal.lunch.macros.calories} kcal
              </span>
              <span className="text-stone-300">•</span>
              <span>Proteína: <b>{proposal.lunch.macros.protein}g</b></span>
              <span className="text-stone-300">•</span>
              <span>Carbos: <b>{proposal.lunch.macros.carbs}g</b></span>
              {proposal.lunch.diet_adaptation && (
                <span className="w-full text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                  🥗 Dieta: {proposal.lunch.diet_adaptation}
                </span>
              )}
            </div>

            {/* Acciones para Almuerzo */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleSaveLunch}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Guardar en el recetario para usar en cualquier momento"
              >
                {savedStatus.lunchSaved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span>{savedStatus.lunchSaved ? 'Guardada' : 'Al Recetario'}</span>
              </button>

              <button
                onClick={handleApplyLunch}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-98"
              >
                {savedStatus.lunchApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Asignado</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Asignar a Almuerzo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Ensalada de Almuerzo */}
          <div className="bg-[#f7faf7] rounded-2xl border border-emerald-200/80 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-xl p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  {proposal.lunchSalad.emoji || '🥗'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full bg-emerald-200/70 text-emerald-900">
                      Acompañamiento Fresco
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Listo en 3 min</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                    {proposal.lunchSalad.name}
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    {proposal.lunchSalad.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-emerald-100">
              <button
                onClick={handleSaveLunchSalad}
                className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-1"
              >
                <Bookmark className="w-3 h-3 text-emerald-600" />
                <span>{savedStatus.lunchSaladSaved ? 'Guardada' : 'Al Catálogo'}</span>
              </button>
              <button
                onClick={handleApplyLunchSalad}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-98"
              >
                <Salad className="w-3 h-3" />
                <span>{savedStatus.lunchSaladApplied ? 'Asignada' : 'Asignar a Almuerzo'}</span>
              </button>
            </div>
          </div>

          {/* 3. Cena */}
          <div className="bg-white rounded-2xl border border-amber-950/10 p-4 shadow-2xs hover:border-indigo-300 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                  {proposal.dinner.emoji || '🐟'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                      Cena Ligera
                    </span>
                    <span className="text-[11px] text-stone-400 capitalize">
                      {proposal.dinner.type}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                    {proposal.dinner.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                    {proposal.dinner.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Macros cena */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-stone-400" />
                {proposal.dinner.prep_time} min
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Flame className="w-3 h-3 text-amber-500" />
                {proposal.dinner.macros.calories} kcal
              </span>
              <span className="text-stone-300">•</span>
              <span>Proteína: <b>{proposal.dinner.macros.protein}g</b></span>
              <span className="text-stone-300">•</span>
              <span>Carbos: <b>{proposal.dinner.macros.carbs}g</b></span>
              {proposal.dinner.diet_adaptation && (
                <span className="w-full text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                  🥗 Dieta: {proposal.dinner.diet_adaptation}
                </span>
              )}
            </div>

            {/* Acciones Cena */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleSaveDinner}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {savedStatus.dinnerSaved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span>{savedStatus.dinnerSaved ? 'Guardada' : 'Al Recetario'}</span>
              </button>

              <button
                onClick={handleApplyDinner}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-98"
              >
                {savedStatus.dinnerApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Asignado</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Asignar a Cena</span>
                  </>
                )}
              </button>
            </div>
          </div>


          {/* 5. Snack Saciante */}
          <div className="bg-white rounded-2xl border border-amber-950/10 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-xl p-1.5 rounded-xl bg-orange-100 text-orange-900">
                  {proposal.snack.emoji || '🥜'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                      Snack Saciante 0-2 Minutos
                    </span>
                    <span className="text-[11px] text-stone-500 font-semibold">
                      {proposal.snack.calories} kcal
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                    {proposal.snack.name}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {proposal.snack.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
              <button
                onClick={handleSaveSnack}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                <span>{savedStatus.snackSaved ? 'Guardado' : 'Al Catálogo'}</span>
              </button>

              <button
                onClick={handleApplySnack}
                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-98"
              >
                <Apple className="w-3.5 h-3.5" />
                <span>{savedStatus.snackApplied ? 'Asignado' : 'Asignar a Snack'}</span>
              </button>
            </div>
          </div>

          {/* Nota de ingredientes restantes en la nevera */}
          {proposal.remainingIngredientsNote && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Más existencias en la nevera o despensa:</span>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  {proposal.remainingIngredientsNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con Botón de Menú Alternativo y Cierre */}
        <div className="p-4 bg-white/90 border-t border-amber-950/10 space-y-2.5 shrink-0">
          {showAlternativeInput && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <input
                type="text"
                value={alternativePrompt}
                onChange={(e) => setAlternativePrompt(e.target.value)}
                placeholder="Ej: Quiero algo sin pasta, o usar más calabacines..."
                className="flex-1 p-2 text-xs rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffdfa]"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerAlternative}
                disabled={isGeneratingAlternative}
                className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center gap-2 active:scale-98 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingAlternative ? 'animate-spin' : ''}`} />
                <span>
                  {isGeneratingAlternative
                    ? 'Buscando alternativa con ingredientes restantes...'
                    : '🔄 Generar otro menú alternativo con lo que hay'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowAlternativeInput(!showAlternativeInput)}
                className="text-stone-500 hover:text-stone-800 text-[11px] font-semibold underline px-1"
              >
                {showAlternativeInput ? 'Ocultar nota' : '+ Añadir detalle'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Listo / Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
