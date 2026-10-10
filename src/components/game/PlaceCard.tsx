"use client";

import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Place, Quest } from '@/lib/types';

interface PlaceCardProps {
  place: Place;
  quest?: Quest;
  onSelect: (place: Place) => void;
}

/**
 * Compact card showing a place of interest on the map or dashboard.
 */
export default function PlaceCard({ place, quest, onSelect }: PlaceCardProps) {
  return (
    <div onClick={() => onSelect(place)} className="cursor-pointer block">
      <Card padding="sm" className="hover:border-slate-500 transition-colors active:bg-slate-700" glow={!!quest ? 'blue' : null}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-2xl border border-slate-700">
              {place.category === 'park' ? '🌳' : place.category === 'cafe' ? '☕' : '🏢'}
            </div>
            <div>
              <h4 className="font-bold text-white">{place.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">📍 {place.distance}m</span>
                {!!quest && (
                  <Badge variant="amber" size="sm">Quest Available</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-slate-500 pr-2">
            ❯
          </div>
        </div>
      </Card>
    </div>
  );
}
