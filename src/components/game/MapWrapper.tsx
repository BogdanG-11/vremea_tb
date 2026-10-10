'use client';

import dynamic from 'next/dynamic';
import { Place, Quest } from '@/lib/types';

const GameMap = dynamic(() => import('./GameMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-slate-800 rounded-xl">
      <span className="text-white">Loading map...</span>
    </div>
  )
});

interface MapWrapperProps {
  playerPosition: { lat: number; lon: number } | null;
  places: Place[];
  quests: Quest[];
  selectedQuest: Quest | null;
  onPlaceSelect: (place: Place) => void;
  onQuestSelect: (quest: Quest) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <GameMap {...props} />;
}
