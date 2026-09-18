import React, { useState, useMemo } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import type { SupermarketAisle, DayOfWeek } from '../../types';
import {
  ShoppingCart,
  Check,
  RotateCcw,
  Share2,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

const AISLE_CONFIG: Record<SupermarketAisle, { title: string; emoji: string; color: string }> = {
  frescos_verdura: {
    title: 'Frutas, Verduras y Frescos',
    emoji: '🥬',
    color: 'border-[#cfe2cf] bg-[#edf6ed]/70 text-[#2c532f]',
  },
  carniceria_pescaderia: {
    title: 'Carnicería y Pescadería',
    emoji: '🥩',
    color: 'border-[#ecd3d1] bg-[#fbf1f0]/70 text-[#7d3b37]',
  },
  lacteos_huevos: {
    title: 'Lácteos, Quesos y Huevos',
    emoji: '🧀',
    color: 'border-[#f4e8c6] bg-[#fef9eb]/70 text-[#755919]',
  },
  despensa_legumbres: {
    title: 'Despensa, Legumbres y Pastas',
    emoji: '🥫',
    color: 'border-[#ebd7be] bg-[#fdf5eb]/70 text-[#80501d]',
  },
  congelados: {
    title: 'Congelados',
    emoji: '❄️',
    color: 'border-[#cbe3e8] bg-[#eef6f8]/70 text-[#2b5d6b]',
  },
  especias_aceites: {
    title: 'Aceites, Especias y Condimentos',
    emoji: '🧂',
    color: 'border-[#e2dcce] bg-[#f8f5f1]/70 text-[#5c544c]',
  },
};

const DAYS_ORDER: { id: DayOfWeek; short: string; full: string }[] = [
  { id: 'lunes', short: 'Lun', full: 'Lunes' },
  { id: 'martes', short: 'Mar', full: 'Martes' },
  { id: 'miercoles', short: 'Mié', full: 'Miércoles' },
  { id: 'jueves', short: 'Jue', full: 'Jueves' },
  { id: 'viernes', short: 'Vie', full: 'Viernes' },
  { id: 'sabado', short: 'Sáb', full: 'Sábado' },
  { id: 'domingo', short: 'Dom', full: 'Domingo' },
];

export const GroceryListView: React.FC = () => {
  const { groceryItems, toggleGroceryItem, resetGroceryChecks, activeMembersCount } = useFamilyMenu();
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  // Alternar selección de un día individual
  const handleToggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) => {
      if (prev.length === 0) {
        return [day];
      }
      if (prev.includes(day)) {
        const next = prev.filter((d) => d !== day);
        return next;
      }
      return [...prev, day];
    });
  };

  // Filtrado de ingredientes por los días seleccionados
  const displayedItems = useMemo(() => {
    if (selectedDays.length === 0) return groceryItems;
    return groceryItems.filter((item) =>
      item.days && item.days.some((d) => selectedDays.includes(d))
    );
  }, [groceryItems, selectedDays]);

  const totalCount = displayedItems.length;
  const checkedCount = displayedItems.filter((i) => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Agrupar items filtrados por pasillo de supermercado
  const groupedByAisle = useMemo(() => {
    return displayedItems.reduce<Record<SupermarketAisle, typeof displayedItems>>(
      (acc, item) => {
        const aisle = item.category || 'despensa_legumbres';
        if (!acc[aisle]) acc[aisle] = [];
        acc[aisle].push(item);
        return acc;
      },
      {} as Record<SupermarketAisle, typeof displayedItems>
    );
  }, [displayedItems]);

  const handleShareWhatsApp = () => {
    const daysLabel =
      selectedDays.length === 0
        ? 'Semana Completa'
        : selectedDays
            .map((d) => DAYS_ORDER.find((item) => item.id === d)?.full || d)
            .join(' y ');

    let text = `🛒 *LISTA DE LA COMPRA (${daysLabel.toUpperCase()}) - FAMILYMENU*\n`;
    text += `👥 Para ${activeMembersCount} personas (Mercadona / Aldi)\n\n`;

    Object.entries(groupedByAisle).forEach(([aisleKey, items]) => {
      const aisle = AISLE_CONFIG[aisleKey as SupermarketAisle];
      if (items.length === 0) return;
      text += `*${aisle.emoji} ${aisle.title}*\n`;
      items.forEach((it) => {
        const mark = it.checked ? '✅' : '▫️';
        text += `${mark} ${it.name}: ${it.totalQuantity} ${it.unit} ${it.supermarketRef ? `(${it.supermarketRef})` : ''}\n`;
        // Desglose de recetas y días
        if (it.usages && it.usages.length > 0) {
          const relevantUsages = it.usages.filter(
            (u) => selectedDays.length === 0 || selectedDays.includes(u.day)
          );
          if (relevantUsages.length > 0) {
            text += `   ↳ ${relevantUsages.map((u) => u.label).join(' • ')}\n`;
          }
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header card with progress bar */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Lista de la Compra
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#edf6ed] text-[#2c532f] font-bold border border-[#cfe2cf]">
                  x{activeMembersCount} comensales
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Organizada por pasillos con etiquetas de recetas y filtro por días
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#d97757] hover:bg-[#c66a4c] text-white shadow-xs transition-all active:scale-95"
              title="Copiar lista formateada para WhatsApp"
            >
              {copiedNotification ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-100" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copiar / WhatsApp</span>
                </>
              )}
            </button>

            <button
              onClick={resetGroceryChecks}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
              title="Desmarcar todos los productos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar en tonos cálidos */}
        <div>
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span>Progreso de compra en el súper</span>
            <span className="font-bold text-stone-900">
              {checkedCount} de {totalCount} productos ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#f2ede4] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#3b6e3f] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Barra de Filtro Interactivo por Días (Idea 1) */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Filtrar por días para comprar:</span>
            </div>
            {selectedDays.length > 0 && (
              <button
                onClick={() => setSelectedDays([])}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                <span>Ver toda la semana</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Botón Toda la semana */}
            <button
              onClick={() => setSelectedDays([])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDays.length === 0
                  ? 'bg-[#382d27] text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200/60'
              }`}
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Toda la semana</span>
              </span>
            </button>

            {/* Atajo: Lunes a Miércoles */}
            <button
              onClick={() => setSelectedDays(['lunes', 'martes', 'miercoles'])}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDays.length === 3 &&
                ['lunes', 'martes', 'miercoles'].every((d) => selectedDays.includes(d as DayOfWeek))
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200/60'
              }`}
            >
              Lun a Mié
            </button>

            {/* Atajo: Jueves a Domingo */}
            <button
              onClick={() => setSelectedDays(['jueves', 'viernes', 'sabado', 'domingo'])}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDays.length === 4 &&
                ['jueves', 'viernes', 'sabado', 'domingo'].every((d) => selectedDays.includes(d as DayOfWeek))
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200/60'
              }`}
            >
              Jue a Dom
            </button>

            {/* Separador sutil */}
            <div className="w-px h-5 bg-stone-200 mx-1 hidden sm:block" />

            {/* Chips de días individuales */}
            {DAYS_ORDER.map((d) => {
              const isSelected = selectedDays.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => handleToggleDay(d.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#d97757] text-white shadow-2xs ring-1 ring-[#c26546]'
                      : selectedDays.length === 0
                      ? 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                      : 'bg-stone-100/70 hover:bg-stone-100 text-stone-400 border border-stone-200/40'
                  }`}
                  title={`Filtrar compra de ${d.full}`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>

          {/* Banner de filtro activo */}
          {selectedDays.length > 0 && (
            <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2 animate-in fade-in">
              <span className="leading-tight">
                🛒 Mostrando ingredientes para:{' '}
                <b>
                  {selectedDays
                    .map((d) => DAYS_ORDER.find((item) => item.id === d)?.full || d)
                    .join(', ')}
                </b>{' '}
                ({totalCount} productos necesarios).
              </span>
              <button
                onClick={() => setSelectedDays([])}
                className="text-[11px] font-bold text-amber-800 underline shrink-0 hover:text-amber-950"
              >
                Quitar filtro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Aisle by Aisle Sections con colores pasteles cálidos */}
      <div className="space-y-3.5">
        {(Object.keys(AISLE_CONFIG) as SupermarketAisle[]).map((aisleKey) => {
          const items = groupedByAisle[aisleKey] || [];
          if (items.length === 0) return null;
          const aisle = AISLE_CONFIG[aisleKey];
          const aisleChecked = items.filter((i) => i.checked).length;

          return (
            <div
              key={aisleKey}
              className="bg-white/95 rounded-3xl border border-amber-950/10 shadow-2xs overflow-hidden"
            >
              {/* Aisle Title */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${aisle.color}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">{aisle.emoji}</span>
                  <h3 className="font-bold text-sm sm:text-base">{aisle.title}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current/15">
                  {aisleChecked}/{items.length}
                </span>
              </div>

              {/* Items in this aisle */}
              <div className="divide-y divide-amber-950/5">
                {items.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleGroceryItem(item.id)}
                      className={`px-4 py-3 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors hover:bg-amber-50/40 ${
                        item.checked ? 'bg-[#faf7f2]/60' : ''
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        {/* Custom Checkbox en tono verde salvia */}
                        <div
                          className={`w-5 h-5 rounded-lg border shrink-0 mt-0.5 sm:mt-0 flex items-center justify-center transition-all ${
                            item.checked
                              ? 'bg-[#3b6e3f] border-[#3b6e3f] text-white'
                              : 'border-stone-300 bg-white hover:border-[#3b6e3f]'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Name & Recipe usage (Idea 2: Badges) */}
                        <div className="min-w-0">
                          <span
                            className={`text-sm font-medium transition-all ${
                              item.checked ? 'line-through text-stone-400' : 'text-stone-800'
                            }`}
                          >
                            {item.name}
                          </span>

                          {/* Badges de Recetas y Días (Idea 2) */}
                          {item.usages && item.usages.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {item.usages.map((u, idx) => {
                                const isDayActive =
                                  selectedDays.length === 0 || selectedDays.includes(u.day);

                                return (
                                  <span
                                    key={idx}
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-tight inline-flex items-center gap-1 ${
                                      u.mealType === 'almuerzo'
                                        ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                                        : u.mealType === 'cena'
                                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80'
                                        : u.mealType === 'snack'
                                        ? 'bg-orange-50 text-orange-900 border border-orange-200/80'
                                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80'
                                    } ${
                                      isDayActive ? 'opacity-100' : 'opacity-40 line-through'
                                    }`}
                                  >
                                    <span>{u.label}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {item.supermarketRef && (
                            <span className="block text-[11px] text-stone-400 truncate mt-0.5">
                              Ref: {item.supermarketRef}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Units */}
                      <div className="text-right shrink-0 mt-0.5 sm:mt-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                            item.checked
                              ? 'bg-stone-100 text-stone-400'
                              : 'bg-[#fbf4eb] text-[#8a4b27] border border-[#ecd8c7]'
                          }`}
                        >
                          {item.totalQuantity} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
