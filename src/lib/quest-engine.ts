import { Place, WeatherData, Quest, QuestCategory } from './types';
import { GAME_CONFIG, QUEST_TEMPLATES } from './config';
import { haversineDistance, isWithinRadius } from './distance';

export function generateQuests(places: Place[], weather: WeatherData, completedQuestIds: string[]): Quest[] {
  const availablePlaces = places.filter(p => !completedQuestIds.includes(`quest_${p.id}`));
  
  // Sort by distance if available, otherwise just use as is (assuming they have distance set from player)
  availablePlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const quests: Quest[] = [];
  const targetCount = Math.min(
    Math.max(GAME_CONFIG.minQuestsPerAdventure, availablePlaces.length),
    GAME_CONFIG.maxQuestsPerAdventure
  );

  const isBadWeather = ['rainy', 'stormy', 'snowy', 'foggy'].includes(weather.gameCategory);

  for (let i = 0; i < targetCount && i < availablePlaces.length; i++) {
    const place = availablePlaces[i];
    let category: QuestCategory = 'daily_explorer';

    if (isBadWeather && ['cafe', 'restaurant', 'museum'].includes(place.category)) {
      category = 'cozy_refuge';
    } else if (!isBadWeather && ['park', 'monument'].includes(place.category)) {
      category = 'nature_spirit';
    } else if (['monument', 'museum', 'landmark'].includes(place.category)) {
      category = 'lost_relic';
    } else {
      category = 'city_explorer';
    }

    if (weather.gameCategory === 'rainy' && Math.random() > 0.7) category = 'rain_walker';
    if (weather.gameCategory === 'foggy' && Math.random() > 0.7) category = 'fog_mystery';

    const template = QUEST_TEMPLATES[category];
    const distance = place.distance || 0;

    const quest: Quest = {
      id: `quest_${place.id}_${category}`,
      name: template.name,
      description: template.descriptionTemplate.replace('{place}', place.name),
      category,
      targetPlace: place.name,
      targetLat: place.lat,
      targetLon: place.lon,
      distance,
      xpReward: Math.floor(template.xpBase + (distance / 100)),
      difficulty: template.difficulty,
      completed: false
    };

    quests.push(quest);
  }

  return quests;
}

export function validateQuestCompletion(quest: Quest, playerLat: number, playerLon: number): { valid: boolean; distance: number } {
  const dist = haversineDistance(playerLat, playerLon, quest.targetLat, quest.targetLon);
  return {
    valid: dist <= GAME_CONFIG.questCompletionRadius,
    distance: dist
  };
}

export function calculateXpReward(quest: Quest): number {
  return quest.xpReward + (quest.bonusReward ? parseInt(quest.bonusReward) || 0 : 0);
}
