import { WeatherCategory } from './types';
import { WEATHER_CODE_MAP } from './config';

export function mapWeatherCode(code: number): WeatherCategory {
  return WEATHER_CODE_MAP[code] || 'sunny';
}

export function getWeatherDescription(category: WeatherCategory): string {
  switch (category) {
    case 'sunny': return 'The sky is clear and bright.';
    case 'cloudy': return 'Clouds blanket the sky.';
    case 'rainy': return 'It is raining.';
    case 'stormy': return 'A fierce storm is raging.';
    case 'foggy': return 'A thick fog obscures everything.';
    case 'snowy': return 'Snow is falling softly.';
    default: return 'The weather is unpredictable.';
  }
}

export function getWeatherIcon(category: WeatherCategory): string {
  switch (category) {
    case 'sunny': return '☀️';
    case 'cloudy': return '☁️';
    case 'rainy': return '🌧️';
    case 'stormy': return '⛈️';
    case 'foggy': return '🌫️';
    case 'snowy': return '❄️';
    default: return '🌤️';
  }
}

export function getWeatherColor(category: WeatherCategory): string {
  switch (category) {
    case 'sunny': return 'bg-yellow-400 text-yellow-900';
    case 'cloudy': return 'bg-gray-400 text-gray-900';
    case 'rainy': return 'bg-blue-500 text-blue-50';
    case 'stormy': return 'bg-indigo-700 text-indigo-50';
    case 'foggy': return 'bg-slate-300 text-slate-800';
    case 'snowy': return 'bg-blue-100 text-blue-900';
    default: return 'bg-gray-200 text-gray-800';
  }
}

export function isOutdoorFriendly(category: WeatherCategory): boolean {
  return category === 'sunny' || category === 'cloudy';
}
