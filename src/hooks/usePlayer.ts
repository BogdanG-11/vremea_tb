import { useState, useEffect, useCallback } from 'react';
import { PlayerState, Achievement } from '@/lib/types';
import { loadPlayer, savePlayer, addXp as addXpLib, completeQuest as completeQuestLib, checkAchievements as checkAchievementsLib, getXpProgress, resetPlayer as resetPlayerLib, getDefaultPlayer } from '@/lib/player';

export function usePlayer() {
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (player) savePlayer(player);
  }, [player]);

  const addXp = useCallback((amount: number) => {
    setPlayer((prev) => prev ? addXpLib(prev, amount) : prev);
  }, []);

  const completeQuest = useCallback((questId: string, xp: number) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const updated = completeQuestLib(prev, questId, xp);
      const newlyUnlocked = checkAchievementsLib(updated);
      if (newlyUnlocked.length > 0) {
        setNewAchievements((curr) => [...curr, ...newlyUnlocked]);
      }
      return updated;
    });
  }, []);

  const resetPlayer = useCallback(() => {
    resetPlayerLib();
    setPlayer(getDefaultPlayer());
  }, []);

  const progress = player ? getXpProgress(player) : { percentage: 0 };

  return {
    player,
    addXp,
    completeQuest,
    resetPlayer,
    xpProgress: progress.percentage,
    newAchievements,
  };
}
