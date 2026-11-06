'use client';

import { useEffect } from 'react';
import { userThemes } from '@/data/themes';

export default function ThemeInitializer() {
  useEffect(() => {
    let theme = null;

    const storedThemeStr = localStorage.getItem('taqtiq_user_theme');
    if (storedThemeStr) {
      try {
        theme = JSON.parse(storedThemeStr);
      } catch (e) {
        theme = null;
      }
    }

    if (!theme) {
      const cookies = document.cookie.split(';');
      const themeCookie = cookies.find((c) => c.trim().startsWith('taqtiq_theme_name='));
      if (themeCookie) {
        const themeName = themeCookie.split('=')[1];
        theme = userThemes.find((t) => t.name === themeName);
      }
    }

    if (!theme) {
      theme = userThemes[Math.floor(Math.random() * userThemes.length)];
    }

    localStorage.setItem('taqtiq_user_theme', JSON.stringify(theme));
    document.cookie = `taqtiq_theme_name=${theme.name}; path=/; max-age=31536000; SameSite=Lax`;

    const root = document.documentElement;
    root.style.setProperty('--accent-primary', theme.primary);
    root.style.setProperty('--accent-grad-1', theme.gradient[0]);
    root.style.setProperty('--accent-grad-2', theme.gradient[1]);
    root.style.setProperty('--accent-background', theme.background);
    root.style.setProperty('--accent-text-1', theme.text[0]);
    root.style.setProperty('--accent-text-2', theme.text[1]);

    console.log("theme: ", theme);

  }, []);

  return null;
}