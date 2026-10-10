"use client";

import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showValues?: boolean;
  color?: 'amber' | 'purple' | 'emerald' | 'blue';
}

/**
 * Animated progress bar for XP and other stats.
 */
export default function ProgressBar({
  current,
  max,
  label,
  showValues = false,
  color = 'amber',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  const colors = {
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-500',
    emerald: 'bg-gradient-to-r from-emerald-600 to-green-400',
    blue: 'bg-gradient-to-r from-blue-600 to-cyan-400',
  };

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex justify-between items-end mb-1.5 text-xs font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {showValues && <span className="text-slate-400">{current} / {max}</span>}
        </div>
      )}
      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
