import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Claves de configuración en localStorage
const STORAGE_SUPABASE_URL = 'familymenu_supabase_url';
const STORAGE_SUPABASE_KEY = 'familymenu_supabase_key';
const STORAGE_GEMINI_KEY = 'familymenu_gemini_key';

export function getStoredSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_SUPABASE_URL) || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem(STORAGE_SUPABASE_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
}

export function saveStoredSupabaseConfig(url: string, key: string) {
  if (url) localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
  else localStorage.removeItem(STORAGE_SUPABASE_URL);

  if (key) localStorage.setItem(STORAGE_SUPABASE_KEY, key.trim());
  else localStorage.removeItem(STORAGE_SUPABASE_KEY);
}

export function getStoredGeminiKey(): string {
  return localStorage.getItem(STORAGE_GEMINI_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveStoredGeminiKey(key: string) {
  if (key) localStorage.setItem(STORAGE_GEMINI_KEY, key.trim());
  else localStorage.removeItem(STORAGE_GEMINI_KEY);
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getStoredSupabaseConfig();
  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.warn('Error inicializando cliente Supabase:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}
