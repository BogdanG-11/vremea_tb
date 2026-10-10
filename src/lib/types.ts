export interface Coordinates {
  lat: number;
  lon: number;
}

export type WeatherCategory = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'snowy';

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  gameCategory: WeatherCategory;
  description: string;
  icon: string;
  lastUpdated: number;
}

export type PlaceCategory = 'cafe' | 'restaurant' | 'park' | 'museum' | 'monument' | 'landmark' | 'shop' | 'other';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  distance?: number;
  tags?: Record<string, string>;
}

export type QuestCategory = 'cozy_refuge' | 'nature_spirit' | 'lost_relic' | 'rain_walker' | 'city_explorer' | 'fog_mystery' | 'daily_explorer';

export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  targetPlace: string;
  targetLat: number;
  targetLon: number;
  distance: number;
  xpReward: number;
  difficulty: QuestDifficulty;
  weatherRequirement?: WeatherCategory;
  completed: boolean;
  completedAt?: number;
  bonusReward?: string;
  targetLocation?: { lat: number; lon: number }; // Added for GameMap compatibility
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  condition: string;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedQuests: string[];
  achievements: Achievement[];
  dailyQuestCount: number;
  lastPlayDate: number;
  totalDistance: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'guide' | 'player' | 'system';
  content: string;
  timestamp: number;
  quickReplies?: string[];
}

export interface AdventureState {
  active: boolean;
  quests: Quest[];
  places: Place[];
  weather: WeatherData | null;
  watchId?: number;
  lastGpsUpdate?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatContext {
  weather?: WeatherData;
  place?: Place;
  quest?: Quest;
  playerLevel: number;
  playerName: string;
}
