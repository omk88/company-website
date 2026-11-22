'use client';

import React, { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCurrentUser } from '@/app/ConvexClientProvider';
import { ThemeColorPicker, ThemeName } from '@/components/web/ThemeColourPicker';
import { getInitialTheme, setTheme, subscribeToTheme } from '@/lib/theme';

export function ThemePickerWidget() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('electric-blue');

  const currentUserData = useCurrentUser();
  const profileUserId = currentUserData?.profile?.userId;
  const updateProfileTheme = useMutation(api.profiles.updateProfileTheme);

  useEffect(() => {
    setCurrentTheme(getInitialTheme().name);

    return subscribeToTheme((theme) => {
      setCurrentTheme(theme.name);
    });
  }, []);

  const handleSelectTheme = async (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    setTheme(themeName);

    if (!profileUserId) return;

    try {
      await updateProfileTheme({ themeName });
    } catch (error) {
      console.error('Failed to persist profile theme:', error);
    }
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