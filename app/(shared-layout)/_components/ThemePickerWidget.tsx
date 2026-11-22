'use client';

import React, { useEffect, useState } from 'react';
import { ThemeColorPicker, ThemeName } from '@/components/web/ThemeColourPicker';
import { getInitialTheme, setTheme, subscribeToTheme } from '@/lib/theme';

export function ThemePickerWidget() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('electric-blue');

  useEffect(() => {
    setCurrentTheme(getInitialTheme().name);

    return subscribeToTheme((theme) => {
      setCurrentTheme(theme.name);
    });
  }, []);

  const handleSelectTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    setTheme(themeName);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ThemeColorPicker
        selectedTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        size={22}
      />
    </div>
  );
}