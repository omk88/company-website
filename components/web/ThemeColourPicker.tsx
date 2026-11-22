'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { userThemes, THEME_MAP } from '@/data/themes';

export type ThemeName = (typeof userThemes)[number]['name'];

interface ThemeColorPickerProps {
  selectedTheme?: ThemeName;
  defaultTheme?: ThemeName;
  onSelectTheme?: (themeName: ThemeName) => void;
  size?: number;
}

export function ThemeColorPicker({
  selectedTheme,
  defaultTheme = 'electric-blue',
  onSelectTheme,
  size = 40,
}: ThemeColorPickerProps) {
  const [internalSelected, setInternalSelected] = useState<ThemeName>(defaultTheme);
  const [open, setOpen] = useState(false);

  const activeSelection = selectedTheme ?? internalSelected;
  const activeTheme = THEME_MAP[activeSelection] ?? userThemes[0];

  const handleSelect = (themeName: ThemeName) => {
    if (selectedTheme === undefined) {
      setInternalSelected(themeName);
    }
    onSelectTheme?.(themeName);
    setOpen(false);
  };

  const smoothEase = [0.22, 1, 0.36, 1] as const;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label="Open theme color menu"
          aria-expanded={open}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.16, ease: smoothEase }}
          style={{
            width: size + 8,
            height: size + 8,
            backgroundColor: activeTheme.primary,
          }}
          className="rounded-full border border-border cursor-pointer focus:outline-none"
        />
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-auto p-2 rounded-2xl border border-border bg-background overflow-hidden"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="color-drawer-content"
              initial={{ y: 12, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: smoothEase }}
              className="flex flex-col-reverse items-center gap-2"
              role="radiogroup"
              aria-label="Theme color selector"
            >
              {userThemes.map((theme, idx) => {
                const isSelected = activeSelection === theme.name;

                return (
                  <motion.button
                    key={theme.name}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={theme.name.replace('-', ' ')}
                    onClick={() => handleSelect(theme.name)}
                    initial={{ y: 8, scale: 0.9 }}
                    animate={{ y: 0, scale: isSelected ? 1.06 : 1 }}
                    exit={{ y: 8, scale: 0.9 }}
                    transition={{
                      duration: 0.18,
                      delay: idx * 0.015,
                      ease: smoothEase,
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: theme.primary,
                    }}
                    className="rounded-full border border-border cursor-pointer focus:outline-none"
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}