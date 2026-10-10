import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '@/lib/config';

export interface GeoPosition {
  lat: number;
  lon: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('Location permission denied. Please enable location services.');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Location information is unavailable. Try again or use demo mode.');
        break;
      case error.TIMEOUT:
        setError('Location request timed out. Please check your GPS settings.');
        break;
      default:
        setError('An unknown error occurred while getting location.');
        break;
    }
    setLoading(false);
  };

  const getCurrentPosition = useCallback((): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        const err = 'Geolocation is not supported by your browser';
        setError(err);
        reject(new Error(err));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setPosition(newPos);
          setLoading(false);
          resolve(newPos);
        },
        (err) => {
          handleError(err);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: GAME_CONFIG?.gpsTimeout || 10000,
          maximumAge: GAME_CONFIG?.gpsMaxAge || 0,
        }
      );
    });
  }, [isSupported]);

  const startWatching = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (watchId !== null) return;

    setError(null);
    setWatching(true);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        handleError(err);
      },
      {
        enableHighAccuracy: true,
        timeout: GAME_CONFIG?.gpsTimeout || 10000,
        maximumAge: GAME_CONFIG?.gpsMaxAge || 0,
      }
    );

    setWatchId(id);
  }, [isSupported, watchId]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    loading,
    watching,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isSupported,
  };
}
