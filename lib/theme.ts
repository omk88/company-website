'use client';

import { userThemes, THEME_MAP } from '@/data/themes';

export type ThemeName = (typeof userThemes)[number]['name'];
export type UserTheme = (typeof userThemes)[number];

export const THEME_STORAGE_KEY = 'taqtiq_user_theme';
export const THEME_COOKIE_NAME = 'taqtiq_theme_name';
export const THEME_CHANGE_EVENT = 'taqtiq:theme-change';

const FALLBACK_THEME: UserTheme =
  THEME_MAP['electric-blue'] ?? userThemes[0];

export function resolveTheme(themeName?: string | null): UserTheme | undefined {
  if (!themeName) return undefined;
  return THEME_MAP[themeName] ?? userThemes.find((t) => t.name === themeName);
}

export function applyThemeVariables(theme: UserTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--accent-primary', theme.primary);
  root.style.setProperty('--accent-grad-1', theme.gradient[0]);
  root.style.setProperty('--accent-grad-2', theme.gradient[1]);
  root.style.setProperty('--accent-background', theme.background);
  root.style.setProperty('--accent-dark-background', theme.darkBackground);
  root.style.setProperty('--accent-text-1', theme.text[0]);
  root.style.setProperty('--accent-text-2', theme.text[1]);
}

export function persistTheme(theme: UserTheme): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {
  }

  document.cookie = `${THEME_COOKIE_NAME}=${theme.name}; path=/; max-age=31536000; SameSite=Lax`;
}

export function getInitialTheme(): UserTheme {
  if (typeof window === 'undefined') return FALLBACK_THEME;

  try {
    const storedStr = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedStr) {
      const parsed = JSON.parse(storedStr) as { name?: string };
      const matchedFromStorage = resolveTheme(parsed?.name);
      if (matchedFromStorage) {
        return matchedFromStorage;
      }
    }
  } catch {
  }

  const cookies = document.cookie ? document.cookie.split(';') : [];
  const themeCookie = cookies.find((c) =>
    c.trim().startsWith(`${THEME_COOKIE_NAME}=`)
  );
  if (themeCookie) {
    const cookieValue = decodeURIComponent(themeCookie.split('=').slice(1).join('=').trim());
    const matchedFromCookie = resolveTheme(cookieValue);
    if (matchedFromCookie) {
      return matchedFromCookie;
    }
  }

  return userThemes[Math.floor(Math.random() * userThemes.length)] ?? FALLBACK_THEME;
}

export function setTheme(themeName: ThemeName): UserTheme {
  const theme = resolveTheme(themeName) ?? FALLBACK_THEME;
  persistTheme(theme);
  applyThemeVariables(theme);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<UserTheme>(THEME_CHANGE_EVENT, { detail: theme }));
  }

  return theme;
}

export function subscribeToTheme(listener: (theme: UserTheme) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomChange = (event: Event) => {
    const customEvent = event as CustomEvent<UserTheme>;
    if (customEvent.detail) {
      listener(customEvent.detail);
    }
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as { name?: string };
        const matched = resolveTheme(parsed?.name);
        if (matched) {
          applyThemeVariables(matched);
          listener(matched);
        }
      } catch {
      }
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleCustomChange);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleCustomChange);
    window.removeEventListener('storage', handleStorageChange);
  };
}