import React, { useState } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { Flame, Clock, Snowflake, CheckCircle2 } from 'lucide-react';

export const BatchCookingHub: React.FC = () => {
  const { weeklyMeals, activeMembersCount } = useFamilyMenu();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Filtrar recetas únicas del menú semanal que admitan batch cooking
  const batchRecipes = Object.values(weeklyMeals).filter(
    (recipe, index, self) => recipe.batch_cooking && self.findIndex((r) => r.id === recipe.id) === index
  );

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header Banner en tonos ciruela tostado y ámbar cálido */}
      <div className="bg-gradient-to-r from-[#44333d] via-[#4d3b46] to-[#3a2c35] text-[#fbf8f5] rounded-3xl p-5 sm:p-6 shadow-md border border-amber-900/20">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Rutina Tranquila del Domingo • 80 Minutos</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Batch Cooking para Vivir sin Prisas
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl leading-relaxed">
          Si no te gusta cocinar entre semana o te faltan ideas a última hora, dedica poco más de una hora
          el domingo. Deja listas las bases (sofritos, legumbres, arroz) y entre semana la comida estará lista en 10 minutos.
        </p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-amber-200/90">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-300" /> ~80 min de preparación
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Snowflake className="w-3.5 h-3.5 text-cyan-200" /> Táper hermético en nevera/congelador
          </span>
          <span className="font-bold text-amber-300">
            x{activeMembersCount} raciones
          </span>
        </div>
      </div>

      {/* Recetas que se benefician de Batch Cooking esta semana */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm">
        <h3 className="font-bold text-stone-900 text-base mb-3 flex items-center gap-2">
          <span>Platos que puedes adelantar el domingo</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fbf4eb] text-[#8a4b27] font-bold border border-[#ecd8c7]">
            {batchRecipes.length} recetas
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {batchRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-3.5 rounded-2xl bg-[#faf7f2] border border-amber-950/5 flex items-start gap-3"
            >
              <span className="text-3xl select-none filter drop-shadow-xs">{recipe.emoji || '🍲'}</span>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-900 text-sm">{recipe.title}</h4>
                <p className="text-xs text-[#5e3863] bg-[#f7f2f8] p-2 rounded-xl border border-[#ecddec] mt-1.5 leading-relaxed">
                  <strong>Paso Domingo:</strong> {recipe.batch_notes || 'Preparar sofrito o cocción previa y refrigerar.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Preparación Dominical en 4 Bloques */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-950/10 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-base">
          Paso a Paso Tranquilo para el Domingo:
        </h3>

        <div className="space-y-3">
          {[
            {
              id: 'step-1',
              title: '1. Olla Rápida / Guisos (0 a 35 min)',
              desc: 'Pon las legumbres o sopas a cocer con las verduras troceadas. Se hacen solas mientras descansas o haces otras cosas.',
            },
            {
              id: 'step-2',
              title: '2. Granos y Huevos Cocidos (15 a 40 min)',
              desc: 'Cuece arroz integral o asa patatas. Hierve 6 huevos camperos durante 9 minutos para tener proteína lista en la nevera.',
            },
            {
              id: 'step-3',
              title: '3. Sofrito Base o Verduras Asadas (35 a 65 min)',
              desc: 'Pica cebolla, ajo y pimientos para un sofrito multiusos. Asa una bandeja de calabacín y berenjena en el horno.',
            },
            {
              id: 'step-4',
              title: '4. Guardar en Tápers (65 a 80 min)',
              desc: 'Guarda en tápers de cristal. Lo de lunes/martes/miércoles a la nevera, y el resto al congelador. ¡Semana resuelta!',
            },
          ].map((task) => {
            const isDone = !!completedSteps[task.id];
            return (
              <div
                key={task.id}
                onClick={() => toggleStep(task.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isDone
                    ? 'bg-[#edf6ed] border-[#93c793]'
                    : 'bg-[#faf7f2]/80 border-amber-950/5 hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isDone
                      ? 'bg-[#3b6e3f] border-[#3b6e3f] text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                </div>

                <div>
                  <h4
                    className={`text-sm font-bold transition-all ${
                      isDone ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isDone ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {task.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
