import React, { useState, useRef } from 'react';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import { generateDayMenuWithGemini, generateRecipeFromMedia } from '../../services/geminiService';
import type { DayMenuProposal } from '../../services/geminiService';
import type { WeeklyMenuPreset, WeeklyMenuCriteria } from '../../services/menuAlgorithm';
import { extractVideoFrames, readFileAsBase64 } from '../../utils/mediaUtils';
import type { Recipe } from '../../types';
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
  Film,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Clock,
  Check,
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

const PRESETS: Array<{
  id: WeeklyMenuPreset;
  label: string;
  emoji: string;
  description: string;
}> = [
  {
    id: 'balanced',
    label: 'Equilibrado',
    emoji: '🥗',
    description: 'Mediterráneo completo: legumbres 2 días, pescados 2-3 días, guisos y sopas.',
  },
  {
    id: 'express',
    label: 'Exprés (<25 min)',
    emoji: '⚡',
    description: 'Recetas rápidas y ágiles para semanas ajetreadas con poco tiempo.',
  },
  {
    id: 'batch_cooking',
    label: 'Batch Cooking',
    emoji: '🍱',
    description: 'Platos ideales para cocinar el domingo y refrigerar/congelar con calidad.',
  },
  {
    id: 'light',
    label: 'Ligero & Clean',
    emoji: '🌿',
    description: 'Cenas muy digestivas (cremas, ensaladas, pescado blanco) y déficit calórico.',
  },
  {
    id: 'family',
    label: 'Familiar & Niños',
    emoji: '👨‍👩‍👧',
    description: 'Máxima aceptación infantil: pastas caseras, empanadas, tortillas y hamburguesas.',
  },
];

export const MenuGeneratorModal: React.FC<MenuGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { generateWeek, activeMembersCount, members, addRecipeToCatalog } = useFamilyMenu();

  // Estados de Punto 1: Criterios para Menú Semanal Automático
  const [selectedPreset, setSelectedPreset] = useState<WeeklyMenuPreset>('balanced');
  const [showAdvancedCriteria, setShowAdvancedCriteria] = useState(false);
  const [criteriaLegumeDays, setCriteriaLegumeDays] = useState<number>(2);
  const [criteriaFishDays, setCriteriaFishDays] = useState<number>(2);
  const [allowCheatWeekend, setAllowCheatWeekend] = useState<boolean>(true);
  const [lightDinnersOnly, setLightDinnersOnly] = useState<boolean>(false);

  // Estados de Punto 2: Sugerencias por Fotos de Nevera/Despensa (IA)
  const [fridgeInventory, setFridgeInventory] = useState(
    'Pechugas de pollo, calabacines, garbanzos cocidos, caldo de pollo, fideos, salmón'
  );
  const [extraNotes, setExtraNotes] = useState('');
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Punto 3: Escanear Foto o Vídeo a Receta (Para el Recetario)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaBase64, setMediaBase64] = useState<string | null>(null);
  const [videoFrames, setVideoFrames] = useState<string[]>([]);
  const [isExtractingVideo, setIsExtractingVideo] = useState<boolean>(false);
  const [mediaNotes, setMediaNotes] = useState<string>('');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<boolean>(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [recipeSavedSuccess, setRecipeSavedSuccess] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Mensajes de Feedback Global
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // Estados para la Tarjeta Flotante de Propuesta de Menú del Día (Punto 2)
  const [dayProposal, setDayProposal] = useState<DayMenuProposal | null>(null);
  const [isFloatingCardOpen, setIsFloatingCardOpen] = useState(false);
  const [isGeneratingAlternative, setIsGeneratingAlternative] = useState(false);
  const [seenRecipeTitles, setSeenRecipeTitles] = useState<string[]>([]);

  // Refs de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const mediaCameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // =========================================================================
  // LOGICA PUNTO 1: Generador Semanal con Criterios
  // =========================================================================
  const handleAlgorithmicGenerate = () => {
    const criteria: WeeklyMenuCriteria = {
      preset: selectedPreset,
      legumeDays: criteriaLegumeDays,
      fishDays: criteriaFishDays,
      allowCheatMealWeekend: allowCheatWeekend,
      lightDinnersOnly: lightDinnersOnly,
    };

    generateWeek(criteria);
    const currentPreset = PRESETS.find((p) => p.id === selectedPreset)?.label || 'Equilibrado';
    setFeedbackMessage({
      text: `¡Menú semanal generado con éxito en estilo "${currentPreset}"!`,
      isError: false,
    });
    setTimeout(() => {
      onClose();
      setFeedbackMessage(null);
    }, 1300);
  };

  // =========================================================================
  // LOGICA PUNTO 2: Fotos de Nevera y Menú del Día
  // =========================================================================
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

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
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

  // =========================================================================
  // LOGICA PUNTO 3: Escanear Foto o Vídeo a Receta (Para el Recetario)
  // =========================================================================
  const handleMediaFileSelected = async (file: File) => {
    setRecipeSavedSuccess(false);
    setGeneratedRecipe(null);
    setMediaError(null);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setMediaError('Por favor selecciona una imagen (JPG, PNG) o un vídeo (MP4, WebM, MOV).');
      return;
    }

    if (isVideo && file.size > 80 * 1024 * 1024) {
      setMediaError('El vídeo supera el límite de 80MB. Selecciona un vídeo más corto o un clip.');
      return;
    }

    if (isImage && file.size > 15 * 1024 * 1024) {
      setMediaError('La imagen supera los 15MB. Elige una foto más ligera.');
      return;
    }

    setMediaFile(file);
    setMediaType(isVideo ? 'video' : 'image');

    if (isVideo) {
      setIsExtractingVideo(true);
      setVideoFrames([]);
      try {
        const frames = await extractVideoFrames(file, 4);
        setVideoFrames(frames);
      } catch (err: any) {
        console.error('Error extrayendo fotogramas:', err);
        setMediaError(err.message || 'No se pudieron extraer fotogramas del vídeo.');
      } finally {
        setIsExtractingVideo(false);
      }
    } else {
      try {
        const res = await readFileAsBase64(file);
        setMediaBase64(res.base64);
      } catch {
        setMediaError('Error al leer la imagen.');
      }
    }

    if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';
    if (mediaCameraInputRef.current) mediaCameraInputRef.current.value = '';
  };

  const handleClearMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    setMediaBase64(null);
    setVideoFrames([]);
    setGeneratedRecipe(null);
    setRecipeSavedSuccess(false);
    setMediaError(null);
  };

  const handleGenerateRecipeFromMedia = async () => {
    if (!mediaType || (!mediaBase64 && videoFrames.length === 0)) {
      setMediaError('Por favor añade una foto o vídeo primero.');
      return;
    }

    setIsGeneratingRecipe(true);
    setMediaError(null);
    try {
      const res = await generateRecipeFromMedia({
        mediaType,
        imageBase64: mediaBase64 || undefined,
        videoFrames: videoFrames.length > 0 ? videoFrames : undefined,
        mimeType: mediaFile?.type || 'image/jpeg',
        notes: mediaNotes,
        familyMembers: members,
      });

      if (res.success && res.recipe) {
        setGeneratedRecipe(res.recipe);
      } else {
        setMediaError(res.message || 'No se pudo generar la receta.');
      }
    } catch (e: any) {
      setMediaError(e.message || 'Error al procesar el archivo con IA.');
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const handleSaveRecipeToCatalog = () => {
    if (!generatedRecipe) return;
    addRecipeToCatalog(generatedRecipe);
    setRecipeSavedSuccess(true);
    setFeedbackMessage({
      text: `✨ ¡"${generatedRecipe.title}" guardada en el Recetario! Ya está disponible en tus platos familiares.`,
      isError: false,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#faf7f2] rounded-3xl max-w-xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-amber-950/10">
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
                  Ajustado para {activeMembersCount} personas • Generador semanal, visión IA y recetario
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
            {/* Feedback banner global */}
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

            {/* ========================================================================= */}
            {/* PUNTO 1: Menú Automático Semanal con Criterios y Pestañas */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-3xl border border-amber-950/10 bg-white/95 hover:border-amber-300 transition-colors shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-900 font-bold text-sm">
                  <Soup className="w-4 h-4 text-amber-600" />
                  <span>1. Menú Equilibrado Automático (Semana Completa)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Semana 7 días
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Selecciona el enfoque de tu semana o personaliza los criterios (legumbres, pescados, cenas ligeras).
              </p>

              {/* Pestañas de Estilo Semanal */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wide">
                  Elige el estilo semanal:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PRESETS.map((p) => {
                    const isSelected = selectedPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPreset(p.id)}
                        className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-2xs ring-1 ring-amber-400'
                            : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base">{p.emoji}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <span className="text-xs font-bold text-stone-900 mt-1">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-amber-900/80 bg-amber-50/60 p-2 rounded-xl border border-amber-200/50 leading-snug">
                  ℹ️ {PRESETS.find((p) => p.id === selectedPreset)?.description}
                </p>
              </div>

              {/* Acordeón de Criterios Avanzados */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedCriteria(!showAdvancedCriteria)}
                  className="text-xs font-bold text-amber-900/80 hover:text-amber-950 flex items-center gap-1.5 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Personalizar criterios nutricionales</span>
                  {showAdvancedCriteria ? (
                    <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </button>

                {showAdvancedCriteria && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs animate-in fade-in">
                    {/* Días de Legumbres */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-700 font-medium">Días de legumbre:</span>
                      <div className="flex gap-1">
                        {[1, 2].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCriteriaLegumeDays(num)}
                            className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                              criteriaLegumeDays === num
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-white border border-stone-200 text-stone-700'
                            }`}
                          >
                            {num} {num === 1 ? 'día' : 'días'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Días de Pescado */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-700 font-medium">Días de pescado:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCriteriaFishDays(num)}
                            className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                              criteriaFishDays === num
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-white border border-stone-200 text-stone-700'
                            }`}
                          >
                            {num} {num === 1 ? 'día' : 'días'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cenas ligeras */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-stone-700 font-medium">Cenas 100% ligeras (sopas, ensaladas, cremas):</span>
                      <input
                        type="checkbox"
                        checked={lightDinnersOnly}
                        onChange={(e) => setLightDinnersOnly(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400 accent-amber-600"
                      />
                    </label>

                    {/* Capricho de fin de semana */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-stone-700 font-medium">Capricho casero en fin de semana (burger / pizza):</span>
                      <input
                        type="checkbox"
                        checked={allowCheatWeekend}
                        onChange={(e) => setAllowCheatWeekend(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400 accent-amber-600"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Botón de Generar */}
              <button
                onClick={handleAlgorithmicGenerate}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#382d27] hover:bg-[#2b221d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  Generar Menú Semanal ({PRESETS.find((p) => p.id === selectedPreset)?.label})
                </span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* PUNTO 2: Sugerencias con lo que Hay en Casa (IA Vision Nevera/Despensa) */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-3xl border border-orange-300/70 bg-[#fffdfa] space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-stone-900 text-sm">
                    2. Sugerencias con lo que Hay en Casa (IA Nevera/Despensa)
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                  {photos.length}/3 fotos
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Añade hasta <b>3 fotos</b> de tu nevera o despensa. La IA te propondrá un <b>menú de un día completo</b> (almuerzo, cena, ensalada y snack) en tarjeta flotante para asignarlo a tus días.
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
                <label className="text-[11px] font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
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

            {/* ========================================================================= */}
            {/* PUNTO 3: Escanear Foto o Vídeo a Receta (Para el Recetario) */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-3xl border border-emerald-300/80 bg-[#f8faf8] space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-stone-900 text-sm">
                    3. Escanear Foto o Vídeo a Receta (Para el Recetario)
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Nuevo • Vision IA
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Sube una <b>foto de un plato elaborado</b> o un <b>vídeo de una receta</b> (Reel, TikTok o grabación). La IA identificará los ingredientes con cantidades, calculará macros y creará la ficha completa para incorporarla a tu recetario familiar.
              </p>

              {/* Mensaje de error multimedia si hubiera */}
              {mediaError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{mediaError}</span>
                </div>
              )}

              {/* Selectores ocultos de cámara y archivo */}
              <input
                ref={mediaCameraInputRef}
                type="file"
                accept="image/*,video/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMediaFileSelected(file);
                }}
              />
              <input
                ref={mediaFileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMediaFileSelected(file);
                }}
              />

              {/* Zona de subida o previsualización */}
              {!mediaFile ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => mediaCameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-950 transition-all active:scale-98 text-xs font-bold"
                  >
                    <Camera className="w-5 h-5 text-emerald-600" />
                    <span>Hacer Foto / Grabar Vídeo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-dashed border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-all active:scale-98 text-xs font-semibold"
                  >
                    <Film className="w-5 h-5 text-stone-500" />
                    <span>Subir de Galería / Archivo</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-white border border-emerald-200 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        {mediaType === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        {mediaType === 'video' ? 'Vídeo de Receta' : 'Foto de Plato'}
                      </span>
                      <span className="text-xs text-stone-500 truncate max-w-[180px]">
                        {mediaFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearMedia}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Quitar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Estado de extracción de vídeo */}
                  {isExtractingVideo && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Extrayendo fotogramas clave del vídeo en el navegador...</span>
                    </div>
                  )}

                  {/* Previsualización de imagen */}
                  {mediaType === 'image' && mediaBase64 && (
                    <div className="relative rounded-2xl overflow-hidden aspect-video max-h-44 bg-stone-900 border border-stone-200">
                      <img
                        src={mediaBase64}
                        alt="Previsualización de plato"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Previsualización de fotogramas de vídeo */}
                  {mediaType === 'video' && videoFrames.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                        <span>Fotogramas analizados ({videoFrames.length}):</span>
                        <span className="text-emerald-700 font-bold">Listos para IA</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {videoFrames.map((f, idx) => (
                          <div
                            key={idx}
                            className="aspect-video rounded-xl overflow-hidden bg-stone-900 border border-emerald-200"
                          >
                            <img src={f} alt={`Fotograma ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Campo de notas adicionales para la receta */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Pistas o detalles adicionales (opcional)
                </label>
                <input
                  type="text"
                  value={mediaNotes}
                  onChange={(e) => setMediaNotes(e.target.value)}
                  placeholder="Ej: Es un curry suave de garbanzos, ración familiar, poco picante..."
                  className="w-full p-2 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Botón de Generar Receta con Foto/Vídeo */}
              {!generatedRecipe && (
                <button
                  type="button"
                  onClick={handleGenerateRecipeFromMedia}
                  disabled={isGeneratingRecipe || isExtractingVideo || !mediaFile}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isGeneratingRecipe ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analizando {mediaType === 'video' ? 'vídeo' : 'foto'} y creando receta completa...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-emerald-100" />
                      <span>
                        {mediaType === 'video'
                          ? 'Analizar Vídeo y Crear Ficha de Receta'
                          : 'Analizar Plato y Crear Ficha de Receta'}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* TARJETA DE RESULTADO DE LA RECETA GENERADA */}
              {generatedRecipe && (
                <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 space-y-3 shadow-sm animate-in fade-in">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                        {generatedRecipe.emoji || '🍲'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 leading-tight">
                          {generatedRecipe.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {generatedRecipe.prep_time} min
                          </span>
                          <span>•</span>
                          <span className="capitalize font-semibold text-stone-700">
                            {generatedRecipe.difficulty}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold capitalize">
                            {generatedRecipe.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                    {generatedRecipe.description}
                  </p>

                  {/* Macros por ración */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                    <div>
                      <span className="block text-[10px] text-emerald-800 font-semibold">Calorías</span>
                      <span className="text-xs font-bold text-stone-900">{generatedRecipe.macros.calories} kcal</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-800 font-semibold">Proteína</span>
                      <span className="text-xs font-bold text-stone-900">{generatedRecipe.macros.protein}g</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-800 font-semibold">Hidratos</span>
                      <span className="text-xs font-bold text-stone-900">{generatedRecipe.macros.carbs}g</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-800 font-semibold">Grasa</span>
                      <span className="text-xs font-bold text-stone-900">{generatedRecipe.macros.fat}g</span>
                    </div>
                  </div>

                  {/* Ingredientes reconocidos */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 uppercase">
                      Ingredientes detectados ({generatedRecipe.ingredients.length}):
                    </span>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                      {generatedRecipe.ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-stone-50 border border-stone-150"
                        >
                          <span className="text-stone-800">{ing.name}</span>
                          <span className="font-bold text-emerald-800">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adaptación para dieta */}
                  {generatedRecipe.diet_adaptation && (
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900">
                      💡 <b>Para dietas:</b> {generatedRecipe.diet_adaptation}
                    </div>
                  )}

                  {/* Botones de Guardar en Recetario */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveRecipeToCatalog}
                      disabled={recipeSavedSuccess}
                      className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 shadow-xs ${
                        recipeSavedSuccess
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {recipeSavedSuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-700" />
                          <span>¡Guardada en el Recetario!</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4" />
                          <span>Guardar en el Recetario Familiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleClearMedia}
                      className="py-2.5 px-3 rounded-2xl border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 font-semibold"
                    >
                      Probar otro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white/70 border-t border-amber-950/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Tarjeta Flotante de Resultados del Día (Punto 2) */}
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
