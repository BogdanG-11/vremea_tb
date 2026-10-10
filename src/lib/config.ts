import { WeatherCategory, QuestCategory, Achievement } from './types';

export const GAME_CONFIG = {
  xpPerLevel: (level: number) => Math.floor(100 * level * 1.5),
  questCompletionRadius: 75, // meters
  maxQuestsPerAdventure: 5,
  minQuestsPerAdventure: 3,
  defaultSearchRadius: 5000, // meters for Overpass
  gpsTimeout: 15000,
  gpsMaxAge: 30000,
  weatherRefreshInterval: 300000, // 5 minutes
  demoLocation: { lat: 46.6667, lon: 23.1167, name: 'Mărișel' }
};

export const QUEST_TEMPLATES: Record<QuestCategory, { name: string; descriptionTemplate: string; xpBase: number; difficulty: 'easy' | 'medium' | 'hard' }> = {
  cozy_refuge: {
    name: 'Cozy Refuge',
    descriptionTemplate: 'Seek shelter and warmth at {place}. It looks like a great spot to wait out the weather.',
    xpBase: 50,
    difficulty: 'easy'
  },
  nature_spirit: {
    name: 'Nature Spirit',
    descriptionTemplate: 'The weather is perfect to visit {place}. Take a moment to enjoy the outdoors!',
    xpBase: 70,
    difficulty: 'easy'
  },
  lost_relic: {
    name: 'Lost Relic',
    descriptionTemplate: 'Legends speak of {place}. Venture there to uncover its secrets.',
    xpBase: 120,
    difficulty: 'hard'
  },
  rain_walker: {
    name: 'Rain Walker',
    descriptionTemplate: 'Embrace the rain! Navigate the puddles to reach {place}.',
    xpBase: 90,
    difficulty: 'medium'
  },
  city_explorer: {
    name: 'City Explorer',
    descriptionTemplate: 'The bustling area around {place} is waiting to be explored.',
    xpBase: 60,
    difficulty: 'easy'
  },
  fog_mystery: {
    name: 'Fog Mystery',
    descriptionTemplate: 'The mist obscures {place}. Find your way through the fog to reveal it.',
    xpBase: 100,
    difficulty: 'medium'
  },
  daily_explorer: {
    name: 'Daily Explorer',
    descriptionTemplate: 'Your daily journey takes you to {place}. What will you find?',
    xpBase: 40,
    difficulty: 'easy'
  }
};

export const ACHIEVEMENTS_CONFIG: Achievement[] = [
  { id: 'first_quest', name: 'First Steps', description: 'Complete your first quest', icon: '🌟', condition: 'quests_1' },
  { id: 'rain_lover', name: 'Pluviophile', description: 'Complete 3 quests in the rain', icon: '☔', condition: 'rain_quests_3' },
  { id: 'explorer_10', name: 'Apprentice Explorer', description: 'Discover 10 places', icon: '🗺️', condition: 'places_10' }
];

export const WEATHER_CODE_MAP: Record<number, WeatherCategory> = {
  0: 'sunny', // Clear sky
  1: 'sunny', // Mainly clear
  2: 'cloudy', // Partly cloudy
  3: 'cloudy', // Overcast
  45: 'foggy', // Fog
  48: 'foggy', // Depositing rime fog
  51: 'rainy', // Drizzle: Light
  53: 'rainy', // Drizzle: Moderate
  55: 'rainy', // Drizzle: Dense
  56: 'rainy', // Freezing Drizzle: Light
  57: 'rainy', // Freezing Drizzle: Dense
  61: 'rainy', // Rain: Slight
  63: 'rainy', // Rain: Moderate
  65: 'rainy', // Rain: Heavy
  66: 'rainy', // Freezing Rain: Light
  67: 'rainy', // Freezing Rain: Heavy
  71: 'snowy', // Snow fall: Slight
  73: 'snowy', // Snow fall: Moderate
  75: 'snowy', // Snow fall: Heavy
  77: 'snowy', // Snow grains
  80: 'rainy', // Rain showers: Slight
  81: 'rainy', // Rain showers: Moderate
  82: 'stormy', // Rain showers: Violent
  85: 'snowy', // Snow showers slight
  86: 'snowy', // Snow showers heavy
  95: 'stormy', // Thunderstorm: Slight or moderate
  96: 'stormy', // Thunderstorm with slight hail
  99: 'stormy', // Thunderstorm with heavy hail
};
