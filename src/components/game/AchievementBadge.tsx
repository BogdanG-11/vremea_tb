"use client";

import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  unlockedAt?: Date;
  isNew?: boolean;
}

/**
 * Display an achievement that is locked or unlocked.
 */
export default function AchievementBadge({
  icon,
  name,
  description,
  unlockedAt,
  isNew = false,
}: AchievementBadgeProps) {
  const [celebrate, setCelebrate] = useState(isNew);
  const isUnlocked = !!unlockedAt;

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setCelebrate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  return (
    <Card 
      padding="sm"
      className={`transition-all duration-500 ${!isUnlocked ? 'opacity-60 grayscale' : ''} ${celebrate ? 'scale-105 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-600 shadow-inner' : 'bg-slate-700'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-300'}`}>
            {name}
          </h4>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
          {isUnlocked && unlockedAt && (
            <p className="text-[10px] text-slate-500 mt-2">
              Unlocked: {unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
