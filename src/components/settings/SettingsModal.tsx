import React, { useState, useEffect } from 'react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  resetSupabaseClient,
} from '../../services/supabaseClient';
import {
  hasStoredAdminPin,
  verifyAdminPin,
  saveStoredAdminPin,
} from '../../services/adminAuth';
import { useFamilyMenu } from '../../context/FamilyMenuContext';
import {
  Settings,
  Database,
  Key,
  CheckCircle,
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Delete,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { members, updateMember } = useFamilyMenu();

  // Estados de configuración de servicios
  const currentConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key);
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Visibilidad de credenciales (puntitos ocultos por defecto)
  const [showSupabaseUrl, setShowSupabaseUrl] = useState(false);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Estados de seguridad y autenticación por PIN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Estados para configurar nuevo PIN si el administrador fue eliminado o no existe
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [setupError, setSetupError] = useState<string | null>(null);

  // Verificar si hay algún administrador activo con PIN registrado
  const adminMembers = members.filter((m) => m.isAdmin);
  const hasPinConfigured = hasStoredAdminPin();
  const hasActiveAdminWithPin = adminMembers.length > 0 && hasPinConfigured;

  // Resetear estados al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setPinInput('');
      setPinError(null);
      setNewPin('');
      setConfirmPin('');
      setSetupError(null);

      // Si no hay admin, preseleccionar el primer miembro disponible
      if (members.length > 0) {
        const firstAdmin = members.find((m) => m.isAdmin);
        setSelectedAdminId(firstAdmin ? firstAdmin.id : members[0].id);
      }
      // Actualizar valores actuales del storage
      const freshConfig = getStoredSupabaseConfig();
      setSupabaseUrl(freshConfig.url);
      setSupabaseKey(freshConfig.key);
      setGeminiKey(getStoredGeminiKey());
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  // Manejo de pulsación en teclado numérico para PIN
  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError(null);

      if (nextPin.length === 4) {
        if (verifyAdminPin(nextPin)) {
          setIsAuthenticated(true);
          setPinError(null);
        } else {
          setPinError('PIN incorrecto. Inténtalo de nuevo.');
          setTimeout(() => {
            setPinInput('');
          }, 600);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  // Guardar nueva clave de 4 cifras (en caso de que se haya borrado el admin o no haya PIN)
  const handleSetupNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setSetupError('El PIN debe tener exactamente 4 números.');
      return;
    }

    if (newPin !== confirmPin) {
      setSetupError('Los dos PIN introducidos no coinciden.');
      return;
    }

    // Si el miembro seleccionado no era admin, promoverlo a admin
    const targetMember = members.find((m) => m.id === selectedAdminId);
    if (targetMember) {
      updateMember({ ...targetMember, isAdmin: true });
    }

    saveStoredAdminPin(newPin);
    setIsAuthenticated(true);
  };

  // Guardar configuración de Supabase y Gemini
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
        <div className="p-4 sm:p-5 border-b border-amber-950/5 flex items-center justify-between bg-white/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              {isAuthenticated ? <Settings className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Conexión & Servicios Externos
              </h2>
              <p className="text-xs text-stone-500">
                {isAuthenticated
                  ? 'Configuración protegida de Supabase y Google Gemini'
                  : 'Se requiere autorización de usuario administrador'}
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

        {/* PANTALLA 1: Desbloqueo mediante PIN si hay administrador activo */}
        {!isAuthenticated && hasActiveAdminWithPin && (
          <div className="p-5 sm:p-7 flex flex-col items-center justify-center text-center overflow-y-auto space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Acceso Exclusivo de Administrador
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Introduce el PIN de 4 cifras para gestionar las conexiones externas y claves de la app.
              </p>
            </div>

            {/* Administradores autorizados */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200 text-[11px] font-semibold text-stone-600 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>
                Administrador: <strong>{adminMembers.map((m) => m.name).join(', ')}</strong>
              </span>
            </div>

            {/* Visual PIN Dots */}
            <div className="flex items-center justify-center gap-3 my-2">
              {[0, 1, 2, 3].map((i) => {
                const filled = pinInput.length > i;
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-indigo-600 scale-110 shadow-xs'
                        : 'bg-stone-200 border border-stone-300'
                    }`}
                  />
                );
              })}
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600 animate-bounce">{pinError}</p>
            )}

            {/* Teclado numérico táctil */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] w-full pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="h-12 rounded-2xl bg-white border border-stone-200 text-stone-800 text-lg font-bold hover:bg-stone-100 active:scale-95 transition-all shadow-2xs"
                >
                  {digit}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-12 rounded-2xl bg-white border border-stone-200 text-stone-800 text-lg font-bold hover:bg-stone-100 active:scale-95 transition-all shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                className="h-12 rounded-2xl bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-200 active:scale-95 transition-all shadow-2xs"
                title="Borrar último dígito"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA 2: Configurar nueva clave si el administrador fue borrado o no hay PIN */}
        {!isAuthenticated && !hasActiveAdminWithPin && (
          <form onSubmit={handleSetupNewPin} className="p-5 sm:p-6 overflow-y-auto space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 flex items-start gap-3 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900">
                  Configuración de Nueva Clave de Administrador
                </span>
                <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                  El usuario administrador anterior fue eliminado o aún no se ha establecido un PIN.
                  Selecciona a qué familiar asignar como Administrador y define una nueva clave de 4 cifras para entrar.
                </p>
              </div>
            </div>

            {setupError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {setupError}
              </div>
            )}

            {/* Selección de familiar que actuará como Administrador */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Familiar Administrador
              </label>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.isAdmin ? '(Actual Administrador)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Nuevo PIN de 4 cifras */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Nueva clave de 4 cifras (PIN)
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="4 números (ej: 1234)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-center font-mono tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            {/* Confirmar PIN */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Repetir nueva clave de 4 cifras
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="Repite los 4 números"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-center font-mono tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

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
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all active:scale-95"
              >
                Guardar Clave y Entrar
              </button>
            </div>
          </form>
        )}

        {/* PANTALLA 3: Formulario de Configuración una vez AUTENTICADO */}
        {isAuthenticated && (
          <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {saveSuccess && (
              <div className="p-3 rounded-2xl bg-[#edf6ed] text-[#2c532f] border border-[#cfe2cf] text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Configuración guardada correctamente.</span>
              </div>
            )}

            {/* Badge de sesión de administrador */}
            <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 text-xs flex items-center justify-between text-indigo-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span className="font-bold">
                  Sesión autorizada como Administrador ({adminMembers.map((m) => m.name).join(', ')})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="text-[11px] font-semibold text-indigo-700 hover:underline"
              >
                Bloquear
              </button>
            </div>

            {/* Status info */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950">
              <span className="font-bold block text-amber-900 mb-0.5">
                💡 Sincronización en la nube opcional
              </span>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                FamilyMenu funciona de forma inmediata en tu navegador. Si quieres sincronizar los menús entre varios móviles de la familia, introduce tu URL y claves de Supabase.
              </p>
            </div>

            {/* Supabase Project URL (Oculto con puntitos por defecto + botón de ojo) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>Supabase Project URL</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Protegido</span>
              </label>
              <div className="relative">
                <input
                  type={showSupabaseUrl ? 'text' : 'password'}
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSupabaseUrl(!showSupabaseUrl)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  title={showSupabaseUrl ? 'Ocultar URL' : 'Mostrar URL'}
                >
                  {showSupabaseUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Supabase Anon Key (Oculto con puntitos por defecto + botón de ojo) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Supabase Anon Public Key</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Protegido</span>
              </label>
              <div className="relative">
                <input
                  type={showSupabaseKey ? 'text' : 'password'}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  title={showSupabaseKey ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showSupabaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Ejecuta el script <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">supabase/schema.sql</code> en el SQL Editor de tu proyecto Supabase.
              </p>
            </div>

            {/* Google Gemini API Key (Oculto con puntitos por defecto + botón de ojo) */}
            <div className="pt-2 border-t border-amber-950/5">
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-orange-500" />
                  <span>Google Gemini API Key (Opcional para IA Vision)</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Protegido</span>
              </label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  title={showGeminiKey ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Si no la introduces, la aplicación usa el generador inteligente local.
              </p>
            </div>

            {/* Submit buttons */}
            <div className="pt-3 border-t border-amber-950/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#d97757] hover:bg-[#c66a4c] shadow-xs transition-all active:scale-95"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
