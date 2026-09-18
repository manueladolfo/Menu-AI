import React, { useState, useRef } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { generateDayMenuWithGemini } from '../../services/geminiService';
import type { DayMenuProposal } from '../../services/geminiService';
import { DayMenuProposalFloatingCard } from './DayMenuProposalFloatingCard';
import {
  Sparkles,
  RefreshCw,
  X,
  Refrigerator,
  CheckCircle,
  AlertCircle,
  Wand2,
  Camera,
  Image as ImageIcon,
  Trash2,
  Soup,
  Coffee,
} from 'lucide-react';

interface MenuGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedPhoto {
  id: string;
  base64: string;
  mimeType: string;
  name: string;
}

export const MenuGeneratorModal: React.FC<MenuGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { generateWeek, activeMembersCount, members } = useFamilyMenu();
  const [fridgeInventory, setFridgeInventory] = useState(
    'Pechugas de pollo, calabacines, garbanzos cocidos, caldo de pollo, fideos, salmón'
  );
  const [extraNotes, setExtraNotes] = useState('');
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // Estados para la Tarjeta Flotante de Propuesta de Menú del Día
  const [dayProposal, setDayProposal] = useState<DayMenuProposal | null>(null);
  const [isFloatingCardOpen, setIsFloatingCardOpen] = useState(false);
  const [isGeneratingAlternative, setIsGeneratingAlternative] = useState(false);
  const [seenRecipeTitles, setSeenRecipeTitles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelected = (file: File) => {
    if (photos.length >= 3) {
      setFeedbackMessage({
        text: 'Ya has añadido el máximo de 3 fotos permitidas.',
        isError: true,
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedbackMessage({
        text: 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).',
        isError: true,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedbackMessage({
        text: 'La imagen es demasiado pesada (máx. 10MB). Por favor elige una foto más ligera.',
        isError: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const newPhoto: UploadedPhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        base64,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
      };

      setPhotos((prev) => [...prev, newPhoto]);
      setFeedbackMessage({
        text: `📸 Foto ${photos.length + 1} añadida (${photos.length + 1}/3). Puedes añadir hasta 3 para mayor detalle.`,
        isError: false,
      });
      setTimeout(() => setFeedbackMessage(null), 3000);
    };
    reader.readAsDataURL(file);

    // Limpiar inputs para permitir re-selección
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAlgorithmicGenerate = () => {
    generateWeek();
    setFeedbackMessage({
      text: '¡Menú semanal regenerado con éxito! Recetas sencillas, sopas y comidas de fin de semana listas.',
      isError: false,
    });
    setTimeout(() => {
      onClose();
      setFeedbackMessage(null);
    }, 1200);
  };

  const handleAIDayGenerate = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      const res = await generateDayMenuWithGemini({
        fridgeInventory,
        images: photos,
        preferencesNote: extraNotes,
        familyMembers: members,
      });

      if (res.success && res.proposal) {
        setDayProposal(res.proposal);
        setSeenRecipeTitles([res.proposal.lunch.title, res.proposal.dinner.title]);
        setIsFloatingCardOpen(true);
      } else {
        setFeedbackMessage({
          text: res.message || 'No se pudo generar la propuesta diaria.',
          isError: true,
        });
      }
    } catch (e: any) {
      setFeedbackMessage({
        text: e.message || 'Error durante la generación de menú con IA',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAlternative = async (customFeedback?: string) => {
    setIsGeneratingAlternative(true);
    try {
      const combinedNotes = [extraNotes, customFeedback].filter(Boolean).join('. ');
      const res = await generateDayMenuWithGemini({
        fridgeInventory,
        images: photos,
        preferencesNote: combinedNotes,
        familyMembers: members,
        excludeTitles: seenRecipeTitles,
        isAlternative: true,
      });

      if (res.success && res.proposal) {
        setDayProposal(res.proposal);
        setSeenRecipeTitles((prev) => [
          ...prev,
          res.proposal.lunch.title,
          res.proposal.dinner.title,
        ]);
      }
    } catch (e: any) {
      console.error('Error generando menú alternativo:', e);
    } finally {
      setIsGeneratingAlternative(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#faf7f2] rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden border border-amber-950/10">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-xs">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Inspiración & Generador de Menú
                </h2>
                <p className="text-xs text-stone-500">
                  Ajustado para {activeMembersCount} personas • Con sopas, ensaladas y snacks
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Feedback banner */}
            {feedbackMessage && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  feedbackMessage.isError
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-[#edf6ed] text-[#2c532f] border border-[#cfe2cf]'
                }`}
              >
                {feedbackMessage.isError ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            {/* Option 1: Instant balanced generator */}
            <div className="p-4 rounded-3xl border border-amber-950/10 bg-white/95 hover:border-amber-300 transition-colors shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-stone-900 font-bold text-sm">
                  <Soup className="w-4 h-4 text-amber-600" />
                  <span>1. Menú Equilibrado Automático (Semana Completa)</span>
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Cruza platos fáciles para los 7 días garantizando legumbres, pescado, ensaladas frescas y caprichos de fin de semana.
                </p>
              </div>
              <button
                onClick={handleAlgorithmicGenerate}
                disabled={isLoading}
                className="mt-3 w-full py-2.5 px-4 rounded-2xl bg-[#382d27] hover:bg-[#2b221d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generar Menú Semanal Automático</span>
              </button>
            </div>

            {/* Option 2: AI Logic with Up to 3 Photos & Inventory */}
            <div className="p-4 rounded-3xl border border-orange-300/70 bg-[#fffdfa] space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-stone-900 text-sm">
                    2. Sugerencias con lo que Hay en Casa (IA Vision)
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                  {photos.length}/3 fotos
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Añade hasta <b>3 fotos</b> (nevera, cajón de verduras o despensa/congelador). La IA te propondrá un <b>menú de un día completo</b> (almuerzo, cena, ensaladas y snacks) en una tarjeta flotante para asignarlo a tus días o guardarlo en el recetario.
              </p>

              {/* Photo Capture / Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    📸 Fotos de la nevera o despensa ({photos.length}/3)
                  </label>
                  {photos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPhotos([])}
                      className="text-[10px] text-rose-600 hover:underline font-semibold"
                    >
                      Borrar todas
                    </button>
                  )}
                </div>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelected(file);
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelected(file);
                  }}
                />

                {/* Previsualización de las fotos añadidas */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative rounded-2xl border-2 border-orange-300 overflow-hidden bg-stone-900 aspect-square group shadow-xs"
                      >
                        <img
                          src={photo.base64}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Foto {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition-colors shadow-sm"
                          title="Eliminar esta foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botones para añadir foto (si hay menos de 3) */}
                {photos.length < 3 ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/50 text-amber-950 transition-all active:scale-98 text-xs font-bold"
                    >
                      <Camera className="w-5 h-5 text-orange-600" />
                      <span>Hacer Foto ({photos.length + 1}/3)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-dashed border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-all active:scale-98 text-xs font-semibold"
                    >
                      <ImageIcon className="w-5 h-5 text-stone-500" />
                      <span>Subir de Galería</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-orange-100/70 border border-orange-200 text-center text-xs font-bold text-orange-950 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span>Límite de 3 fotos alcanzado (visión completa lista)</span>
                  </div>
                )}
              </div>

              {/* Optional text notes */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                  <Refrigerator className="w-3.5 h-3.5 text-orange-500" />
                  Ingredientes adicionales o detalles en texto
                </label>
                <textarea
                  rows={2}
                  value={fridgeInventory}
                  onChange={(e) => setFridgeInventory(e.target.value)}
                  placeholder="Ej: Lentejas, merluza congelada, 2 calabacines, huevos..."
                  className="w-full p-2.5 text-xs rounded-2xl border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Peticiones especiales (opcional)
                </label>
                <input
                  type="text"
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="Ej: Plato reconfortante, rápido de preparar, sin picante..."
                  className="w-full p-2 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                onClick={handleAIDayGenerate}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-400 via-amber-500 to-rose-400 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      {photos.length > 0
                        ? `Analizando ${photos.length} foto(s) y diseñando propuesta...`
                        : 'Diseñando menú con lo que hay en casa...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-amber-100" />
                    <span>
                      {photos.length > 0
                        ? `Crear Menú del Día con las ${photos.length} Fotos`
                        : 'Crear Menú del Día con lo que Hay'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white/60 border-t border-amber-950/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Tarjeta Flotante de Resultados del Día */}
      {dayProposal && (
        <DayMenuProposalFloatingCard
          isOpen={isFloatingCardOpen}
          onClose={() => setIsFloatingCardOpen(false)}
          proposal={dayProposal}
          isGeneratingAlternative={isGeneratingAlternative}
          onGenerateAlternative={handleGenerateAlternative}
          photosCount={photos.length}
        />
      )}
    </>
  );
};
