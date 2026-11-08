'use client';

import { useState, useEffect } from 'react';
import { userThemes } from '@/data/themes';

type Theme = typeof userThemes[number];

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(userThemes[0]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', selectedTheme.primary);
    root.style.setProperty('--accent-background', selectedTheme.background);
    root.style.setProperty('--accent-text-1', selectedTheme.text[0]);
    root.style.setProperty('--accent-text-2', selectedTheme.text[1]);
  }, [selectedTheme]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-2xl shadow-xl flex flex-col gap-2 max-h-72 overflow-y-auto">
          {userThemes.map((theme) => {
            const isSelected = selectedTheme.name === theme.name;
            return (
              <button
                key={theme.name}
                onClick={() => {
                  setSelectedTheme(theme);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="capitalize whitespace-nowrap">
                  {theme.name.replace('-', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select Color Theme"
        className="w-12 h-12 rounded-full shadow-lg border-2 border-white dark:border-neutral-800 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer"
        style={{ backgroundColor: selectedTheme.primary }}
      >
        <span className="w-3 h-3 rounded-full bg-white/40 animate-pulse" />
      </button>
    </div>
  );
}