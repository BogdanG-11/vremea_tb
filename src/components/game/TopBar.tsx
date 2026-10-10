"use client";

import React from 'react';
import ProgressBar from '../ui/ProgressBar';

interface TopBarProps {
  level: number;
  xp: number;
  xpToNext: number;
  weatherIcon: string;
  temperature: number;
  weatherCategory: string;
}

/**
 * Top navigation and status bar for mobile RPG view.
 */
export default function TopBar({
  level,
  xp,
  xpToNext,
  weatherIcon,
  temperature,
  weatherCategory,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 pt-safe w-full">
      <div className="px-4 py-3 min-h-[64px] flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🌤️</span>
            <h1 className="font-bold text-lg text-white tracking-tight">Weather RPG</h1>
          </div>

          {/* Weather Status */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200">{temperature}°</p>
              <p className="text-xs text-slate-400">{weatherCategory}</p>
            </div>
            <div className="text-2xl" title={weatherCategory}>{weatherIcon}</div>
            
            {/* Level Badge */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <span className="text-sm font-bold text-white">{level}</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-900 px-1 rounded text-purple-400">LVL</span>
            </div>
          </div>
        </div>
        
        {/* Minimal XP Bar */}
        <div className="mt-1">
          <ProgressBar current={xp} max={xpToNext} color="amber" />
        </div>
      </div>
    </header>
  );
}
