import { PlayerState, Achievement } from './types';
import { GAME_CONFIG, ACHIEVEMENTS_CONFIG } from './config';

const STORAGE_KEY = 'weather-rpg-player';

export function getDefaultPlayer(): PlayerState {
  return {
    name: 'Wanderer',
    level: 1,
    xp: 0,
    xpToNextLevel: GAME_CONFIG.xpPerLevel(1),
    completedQuests: [],
    achievements: [],
    dailyQuestCount: 0,
    lastPlayDate: Date.now(),
    totalDistance: 0,
    createdAt: Date.now()
  };
}

export function loadPlayer(): PlayerState {
  if (typeof window === 'undefined') return getDefaultPlayer();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as PlayerState;
    } catch (e) {
      console.error('Failed to parse player state', e);
    }
  }
  return getDefaultPlayer();
}

export function savePlayer(player: PlayerState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }
}

export function addXp(player: PlayerState, xp: number): PlayerState {
  const newState = { ...player, xp: player.xp + xp };
  
  while (newState.xp >= newState.xpToNextLevel) {
    newState.xp -= newState.xpToNextLevel;
    newState.level += 1;
    newState.xpToNextLevel = GAME_CONFIG.xpPerLevel(newState.level);
  }
  
  return newState;
}

export function completeQuest(player: PlayerState, questId: string, xp: number): PlayerState {
  const updated = addXp(player, xp);
  if (!updated.completedQuests.includes(questId)) {
    updated.completedQuests = [...updated.completedQuests, questId];
  }
  updated.dailyQuestCount += 1;
  return updated;
}

export function checkAchievements(player: PlayerState): Achievement[] {
  const newAchievements: Achievement[] = [];
  const currentIds = player.achievements.map(a => a.id);

  for (const ach of ACHIEVEMENTS_CONFIG) {
    if (currentIds.includes(ach.id)) continue;
    
    let unlocked = false;
    if (ach.condition === 'quests_1' && player.completedQuests.length >= 1) unlocked = true;
    // Add more complex condition checks here
    
    if (unlocked) {
      newAchievements.push({ ...ach, unlockedAt: Date.now() });
    }
  }

  if (newAchievements.length > 0) {
    player.achievements.push(...newAchievements);
  }

  return newAchievements;
}

export function getXpProgress(player: PlayerState): { current: number; required: number; percentage: number } {
  return {
    current: player.xp,
    required: player.xpToNextLevel,
    percentage: Math.min(100, Math.max(0, (player.xp / player.xpToNextLevel) * 100))
  };
}

export function resetPlayer(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
