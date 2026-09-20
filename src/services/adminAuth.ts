// Servicio de autenticación y gestión del PIN de 4 dígitos para usuarios administradores
const STORAGE_ADMIN_PIN = 'familymenu_admin_pin';

export function getStoredAdminPin(): string | null {
  return localStorage.getItem(STORAGE_ADMIN_PIN);
}

export function saveStoredAdminPin(pin: string): void {
  const cleanPin = pin.trim();
  if (cleanPin.length === 4) {
    localStorage.setItem(STORAGE_ADMIN_PIN, cleanPin);
  }
}

export function clearStoredAdminPin(): void {
  localStorage.removeItem(STORAGE_ADMIN_PIN);
}

export function hasStoredAdminPin(): boolean {
  const pin = getStoredAdminPin();
  return !!pin && pin.length === 4;
}

export function verifyAdminPin(inputPin: string): boolean {
  const stored = getStoredAdminPin();
  if (!stored) return false;
  return stored === inputPin.trim();
}
