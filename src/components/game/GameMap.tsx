'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Quest } from '@/lib/types';

// Fix default marker icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const playerIcon = createCustomIcon('#3b82f6'); // blue
const questIcon = createCustomIcon('#eab308'); // gold
const defaultPlaceIcon = createCustomIcon('#ef4444'); // red

interface GameMapProps {
  playerPosition: { lat: number; lon: number } | null;
  places: Place[];
  quests: Quest[];
  selectedQuest: Quest | null;
  onPlaceSelect: (place: Place) => void;
  onQuestSelect: (quest: Quest) => void;
}

// Helper component to recenter map when player position changes
function MapRecenter({ position }: { position: { lat: number; lon: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lon], map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);
  return null;
}

export default function GameMap({
  playerPosition,
  places,
  quests,
  selectedQuest,
  onPlaceSelect,
  onQuestSelect,
}: GameMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-slate-800 rounded-xl flex items-center justify-center">Loading map...</div>;

  const defaultCenter: [number, number] = playerPosition 
    ? [playerPosition.lat, playerPosition.lon] 
    : [46.6667, 23.1167]; // Default to Mărișel

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {playerPosition && (
          <Marker position={[playerPosition.lat, playerPosition.lon]} icon={playerIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lon]} 
            icon={defaultPlaceIcon}
            eventHandlers={{ click: () => onPlaceSelect(place) }}
          >
            <Popup>
              <div className="font-bold">{place.name}</div>
              <div className="text-sm">{place.category}</div>
            </Popup>
          </Marker>
        ))}

        {quests.map((quest) => (
          <React.Fragment key={quest.id}>
            <Marker 
              position={[quest.targetLat, quest.targetLon]} 
              icon={questIcon}
              eventHandlers={{ click: () => onQuestSelect(quest) }}
            >
              <Popup>
                <div className="font-bold">{quest.name}</div>
                <div className="text-sm">{quest.description}</div>
              </Popup>
            </Marker>
            
            <Circle 
              center={[quest.targetLat, quest.targetLon]}
              radius={50}
              pathOptions={{ 
                color: selectedQuest?.id === quest.id ? '#eab308' : '#3b82f6',
                fillColor: selectedQuest?.id === quest.id ? '#eab308' : '#3b82f6',
                fillOpacity: 0.2
              }}
            />
          </React.Fragment>
        ))}
        
        <MapRecenter position={playerPosition} />
      </MapContainer>
    </div>
  );
}
