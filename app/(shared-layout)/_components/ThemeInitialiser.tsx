'use client';

import { useEffect } from 'react';
import {
  getInitialTheme,
  persistTheme,
  applyThemeVariables,
  subscribeToTheme,
} from '@/lib/theme';

export default function ThemeInitializer() {
  useEffect(() => {
    const initialTheme = getInitialTheme();
    persistTheme(initialTheme);
    applyThemeVariables(initialTheme);

    const unsubscribe = subscribeToTheme((updatedTheme) => {
      applyThemeVariables(updatedTheme);
    });

    return unsubscribe;
  }, []);

  return null;
}