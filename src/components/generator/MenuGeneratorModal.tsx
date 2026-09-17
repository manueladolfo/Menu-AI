import React, { useState, useRef } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
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

export const MenuGeneratorModal: React.FC<MenuGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { generateWeek, generateWeekWithAI, activeMembersCount, members } = useFamilyMenu();
  const [fridgeInventory, setFridgeInventory] = useState(
    'Pechugas de pollo, calabacines, garbanzos cocidos, caldo de pollo, fideos, salmón'
  );
  const [extraNotes, setExtraNotes] = useState('');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageMimeType, setSelectedImageMimeType] = useState<string>('image/jpeg');
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelected = (file: File) => {
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

    setSelectedImageName(file.name);
    setSelectedImageMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImageBase64(e.target?.result as string);
      setFeedbackMessage({
        text: '📸 Foto cargada con éxito. La IA identificará los ingredientes sin que tengas que escribirlos.',
        isError: false,
      });
      setTimeout(() => setFeedbackMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImageBase64(null);
    setSelectedImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
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

  const handleAIGenerate = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      const res = await generateWeekWithAI({
        fridgeInventory,
        fridgeImageBase64: selectedImageBase64 || undefined,
        fridgeImageMimeType: selectedImageMimeType,
        preferencesNote: extraNotes,
        familyMembers: members,
      });

      setFeedbackMessage({
        text: res.message,
        isError: !res.success,
      });

      if (res.success) {
        setTimeout(() => {
          onClose();
          setFeedbackMessage(null);
        }, 1800);
      }
    } catch (e: any) {
      setFeedbackMessage({
        text: e.message || 'Error durante la generación con IA',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
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
                Ajustado para {activeMembersCount} personas • Con sopas, ensaladas y comidas ricas
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
                <span>1. Menú Equilibrado Automático (Sin Pensar)</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Cruza platos fáciles garantizando: máximo 2 días pasta, 2 legumbres, ensalada fresca en cada comida, sopas reconfortantes y caprichos el fin de semana.
              </p>
            </div>
            <button
              onClick={handleAlgorithmicGenerate}
              disabled={isLoading}
              className="mt-3 w-full py-2.5 px-4 rounded-2xl bg-[#382d27] hover:bg-[#2b221d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generar Menú Automático</span>
            </button>
          </div>

          {/* Option 2: AI Logic with Photo & Inventory */}
          <div className="p-4 rounded-3xl border border-orange-300/70 bg-[#fffdfa] space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-stone-900 text-sm">
                2. Sugerencias con lo que Hay en Casa (IA Vision)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Haz una foto a la nevera o estanterías de la despensa. La IA detectará tus existencias y te dirá qué cocinar para no tirar comida ni romperte la cabeza:
            </p>

            {/* Photo Capture / Upload Section */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-700 uppercase">
                📸 Foto de la nevera o despensa
              </label>

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

              {/* Photo Preview if selected */}
              {selectedImageBase64 ? (
                <div className="relative rounded-2xl border-2 border-orange-300 overflow-hidden bg-stone-900 shadow-sm">
                  <img
                    src={selectedImageBase64}
                    alt="Nevera / Despensa seleccionada"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-xl bg-stone-900/80 text-white hover:bg-rose-600 transition-colors shadow-sm"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs flex items-center justify-between">
                    <span className="truncate text-[11px]">
                      {selectedImageName || 'Foto lista para analizar'}
                    </span>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-stone-950">
                      Foto Lista
                    </span>
                  </div>
                </div>
              ) : (
                /* Camera / Gallery Upload Buttons */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/50 text-amber-950 transition-all active:scale-98 text-xs font-bold"
                  >
                    <Camera className="w-5 h-5 text-orange-600" />
                    <span>Hacer Foto (Cámara)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-dashed border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-all active:scale-98 text-xs font-semibold"
                  >
                    <ImageIcon className="w-5 h-5 text-stone-500" />
                    <span>Subir de Galería</span>
                  </button>
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
                placeholder="Ej: Pizza el sábado, sopa reconfortante el miércoles..."
                className="w-full p-2 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              onClick={handleAIGenerate}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-400 via-amber-500 to-rose-400 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {selectedImageBase64
                      ? 'Analizando foto con IA y creando menú tranquilo...'
                      : 'Diseñando menú sin agobios...'}
                  </span>
                </>
              ) : (
                <>
                  <Coffee className="w-3.5 h-3.5 text-amber-100" />
                  <span>
                    {selectedImageBase64
                      ? 'Crear Menú a partir de la Foto'
                      : 'Crear Menú con lo que Hay'}
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
  );
};
