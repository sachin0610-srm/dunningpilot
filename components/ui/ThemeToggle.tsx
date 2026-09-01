'use client';

import React from 'react';
import { useTheme } from '@/lib/theme/context';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
        isDark
          ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800'
          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 border border-zinc-300'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
}
