"use client";

import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface QuestCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  questName: string;
  xpAwarded: number;
  leveledUp?: boolean;
  newLevel?: number;
  achievementUnlocked?: string;
}

/**
 * Celebration modal for completing a quest.
 */
export default function QuestCompleteModal({
  isOpen,
  onClose,
  questName,
  xpAwarded,
  leveledUp,
  newLevel,
  achievementUnlocked,
}: QuestCompleteModalProps) {
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setDisplayXp(0);
      const interval = setInterval(() => {
        setDisplayXp((prev) => {
          if (prev >= xpAwarded) {
            clearInterval(interval);
            return xpAwarded;
          }
          return prev + Math.ceil(xpAwarded / 20);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, xpAwarded]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-6 flex flex-col items-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
          Quest Complete!
        </h2>
        <p className="text-lg text-slate-300 font-medium mb-6">
          {questName}
        </p>

        <div className="bg-slate-800/80 rounded-2xl p-6 w-full border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.2)] mb-8 relative overflow-hidden">
          {/* Subtle star decorations */}
          <div className="absolute top-2 left-4 text-amber-500/40 text-sm animate-pulse">✦</div>
          <div className="absolute bottom-4 right-6 text-amber-500/40 text-lg animate-pulse delay-150">✦</div>
          
          <div className="text-sm text-amber-500 font-bold mb-1 uppercase tracking-widest">Rewards</div>
          <div className="text-5xl font-black text-white flex items-center justify-center gap-2">
            <span className="text-amber-400">+</span>{displayXp} <span className="text-2xl text-amber-500 mt-2">XP</span>
          </div>
        </div>

        {leveledUp && (
          <div className="mb-6 animate-slide-up text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30 w-full font-bold">
            🌟 Level Up! You reached Level {newLevel}!
          </div>
        )}

        {achievementUnlocked && (
          <div className="mb-6 animate-slide-up delay-100 flex items-center gap-3 bg-purple-500/10 px-4 py-3 rounded-lg border border-purple-500/30 w-full text-left">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">Achievement Unlocked</div>
              <div className="text-white font-medium">{achievementUnlocked}</div>
            </div>
          </div>
        )}

        <Button size="lg" fullWidth variant="primary" onClick={onClose}>
          Continue Adventure
        </Button>
      </div>
    </Modal>
  );
}
