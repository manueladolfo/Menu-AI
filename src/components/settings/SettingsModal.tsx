import React, { useState } from 'react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  resetSupabaseClient,
} from '../../services/supabaseClient';
import { Settings, Database, Key, CheckCircle, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key);
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(supabaseUrl, supabaseKey);
    saveStoredGeminiKey(geminiKey);
    resetSupabaseClient();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#faf7f2] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-amber-950/10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-stone-700" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Conexión & Servicios Externos
              </h2>
              <p className="text-xs text-stone-500">
                Configura Supabase y Google Gemini (opcional)
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {saveSuccess && (
            <div className="p-3 rounded-2xl bg-[#edf6ed] text-[#2c532f] border border-[#cfe2cf] text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Configuración guardada correctamente.</span>
            </div>
          )}

          {/* Status info */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950">
            <span className="font-bold block text-amber-900 mb-0.5">
              💡 Modo local / sin necesidad de configurar nada
            </span>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              FamilyMenu funciona de forma inmediata en tu navegador. Si en el futuro quieres sincronizar los menús entre varios móviles de la familia, puedes vincular tu base de datos Supabase.
            </p>
          </div>

          {/* Supabase URL */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Supabase Anon Public Key</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Ejecuta el script <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">supabase/schema.sql</code> en el SQL Editor de tu proyecto Supabase.
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="pt-2 border-t border-amber-950/5">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-orange-500" />
              <span>Google Gemini API Key (Opcional para IA Vision)</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Si no la introduces, la aplicación usa el generador inteligente local y simula el reconocimiento de foto.
            </p>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-amber-950/5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#d97757] hover:bg-[#c66a4c] shadow-xs transition-all active:scale-95"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
