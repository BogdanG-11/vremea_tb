import { useState, useCallback, useEffect } from 'react';
import { Place, Quest, WeatherData } from '@/lib/types';
import { GAME_CONFIG } from '@/lib/config';
import { haversineDistance } from '@/lib/distance';
import { useGeolocation, GeoPosition } from './useGeolocation';

export function useAdventure() {
  const { position, error: geoError, getCurrentPosition, startWatching, stopWatching } = useGeolocation();
  
  const [adventureActive, setAdventureActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [proximityAlert, setProximityAlert] = useState<Quest | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      setWeather(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Weather error');
      throw err;
    }
  };

  const fetchPlaces = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/places?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Failed to fetch places');
      const data = await res.json();
      setPlaces(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Places error');
      throw err;
    }
  };

  const generateQuests = async (lat: number, lon: number, weatherData: WeatherData, placesData: Place[]) => {
    try {
      const res = await fetch('/api/quests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, weather: weatherData, places: placesData }),
      });
      if (!res.ok) throw new Error('Failed to generate quests');
      const data = await res.json();
      setQuests(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quests error');
      throw err;
    }
  };

  const startAdventure = async (useDemo = false) => {
    setLoading(true);
    setError(null);
    setDemoMode(useDemo);
    
    try {
      let currentPos = position;
      
      if (useDemo) {
        currentPos = GAME_CONFIG?.demoLocation || { lat: 44.4268, lon: 26.1025 };
      } else if (!currentPos) {
        currentPos = await getCurrentPosition();
      }

      if (!currentPos) throw new Error('Could not determine location');

      const weatherData = await fetchWeather(currentPos.lat, currentPos.lon);
      const placesData = await fetchPlaces(currentPos.lat, currentPos.lon);
      await generateQuests(currentPos.lat, currentPos.lon, weatherData, placesData);

      if (!useDemo) {
        startWatching();
      }

      setAdventureActive(true);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const stopAdventure = useCallback(() => {
    stopWatching();
    setAdventureActive(false);
    setWeather(null);
    setPlaces([]);
    setQuests([]);
    setSelectedQuest(null);
    setProximityAlert(null);
  }, [stopWatching]);

  const completeQuest = async (quest: Quest) => {
    try {
      const res = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId: quest.id }),
      });
      if (!res.ok) throw new Error('Failed to complete quest');
      
      setQuests((prev) => prev.filter((q) => q.id !== quest.id));
      if (selectedQuest?.id === quest.id) setSelectedQuest(null);
      if (proximityAlert?.id === quest.id) setProximityAlert(null);
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const refreshWeather = async () => {
    if (position) await fetchWeather(position.lat, position.lon);
  };

  const refreshPlaces = async () => {
    if (position) await fetchPlaces(position.lat, position.lon);
  };

  // Proximity detection
  useEffect(() => {
    if (position && adventureActive) {
      for (const quest of quests) {
        const dist = haversineDistance(position.lat, position.lon, quest.targetLat, quest.targetLon);
        if (dist <= (GAME_CONFIG?.questCompletionRadius || 50)) {
          if (proximityAlert?.id !== quest.id) {
            setProximityAlert(quest);
          }
          return;
        }
      }
      setProximityAlert(null);
    }
  }, [position, quests, adventureActive, proximityAlert]);

  return {
    adventureActive,
    loading,
    error: error || geoError,
    weather,
    places,
    quests,
    selectedQuest,
    setSelectedQuest,
    demoMode,
    proximityAlert,
    startAdventure,
    stopAdventure,
    completeQuest,
    refreshWeather,
    refreshPlaces,
  };
}
