"use client";

import React from 'react';
import Card from '../ui/Card';
import { WeatherData } from '@/lib/types';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  compact?: boolean;
}

/**
 * Main widget displaying current weather in an RPG style.
 */
export default function WeatherDisplay({ weather, compact = false }: WeatherDisplayProps) {
  if (!weather) {
    return (
      <Card className="flex items-center justify-center p-8 animate-pulse">
        <span className="text-slate-500">Divining the skies...</span>
      </Card>
    );
  }

  const getIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain')) return '🌧️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('sun') || c.includes('clear')) return '☀️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('storm')) return '⛈️';
    return '⛅';
  };

  return (
    <Card glow="blue" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 text-9xl opacity-10 pointer-events-none blur-sm">
        {weather.icon || getIcon(weather.gameCategory)}
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {weather.temperature}°
            </h2>
            <p className="text-lg font-medium text-blue-300 capitalize mt-1">
              {weather.gameCategory}
            </p>
          </div>
          <div className="text-6xl drop-shadow-lg">
            {weather.icon || getIcon(weather.gameCategory)}
          </div>
        </div>

        {!compact && (
          <>
            <p className="text-sm italic text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              "{weather.description}"
            </p>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-700/50">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Feels Like</span>
                <span className="font-medium text-slate-200">{weather.apparentTemperature}°</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Wind</span>
                <span className="font-medium text-slate-200">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Precip</span>
                <span className="font-medium text-slate-200">{weather.precipitation} mm</span>
              </div>
            </div>
          </>
        )}
        
        <div className="text-[10px] text-slate-500 text-right mt-1">
          Last updated: {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </Card>
  );
}
