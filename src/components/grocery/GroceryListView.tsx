import React, { useState } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import type { SupermarketAisle } from '../../types';
import { ShoppingCart, Check, RotateCcw, Share2, CheckCircle2 } from 'lucide-react';

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

export const GroceryListView: React.FC = () => {
  const { groceryItems, toggleGroceryItem, resetGroceryChecks, activeMembersCount } = useFamilyMenu();
  const [copiedNotification, setCopiedNotification] = useState(false);

  const totalCount = groceryItems.length;
  const checkedCount = groceryItems.filter((i) => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Agrupar items por pasillo de supermercado
  const groupedByAisle = groceryItems.reduce<Record<SupermarketAisle, typeof groceryItems>>(
    (acc, item) => {
      const aisle = item.category || 'despensa_legumbres';
      if (!acc[aisle]) acc[aisle] = [];
      acc[aisle].push(item);
      return acc;
    },
    {} as Record<SupermarketAisle, typeof groceryItems>
  );

  const handleShareWhatsApp = () => {
    let text = `🛒 *LISTA DE LA COMPRA - FAMILYMENU*\n`;
    text += `👥 Para ${activeMembersCount} personas (Mercadona / Aldi)\n\n`;

    Object.entries(groupedByAisle).forEach(([aisleKey, items]) => {
      const aisle = AISLE_CONFIG[aisleKey as SupermarketAisle];
      if (items.length === 0) return;
      text += `*${aisle.emoji} ${aisle.title}*\n`;
      items.forEach((it) => {
        const mark = it.checked ? '✅' : '▫️';
        text += `${mark} ${it.name}: ${it.totalQuantity} ${it.unit} ${it.supermarketRef ? `(${it.supermarketRef})` : ''}\n`;
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
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Lista de la Compra Fácil
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#edf6ed] text-[#2c532f] font-bold border border-[#cfe2cf]">
                  x{activeMembersCount} comensales
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Organizada por los pasillos de Mercadona y Aldi con ensaladas y snacks incluidos
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
                      className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors hover:bg-amber-50/40 ${
                        item.checked ? 'bg-[#faf7f2]/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Custom Checkbox en tono verde salvia */}
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            item.checked
                              ? 'bg-[#3b6e3f] border-[#3b6e3f] text-white'
                              : 'border-stone-300 bg-white hover:border-[#3b6e3f]'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Name & Recipe usage */}
                        <div className="min-w-0">
                          <span
                            className={`text-sm font-medium transition-all ${
                              item.checked ? 'line-through text-stone-400' : 'text-stone-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.supermarketRef && (
                            <span className="block text-[11px] text-stone-400 truncate">
                              Ref: {item.supermarketRef}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Units */}
                      <div className="text-right shrink-0">
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
