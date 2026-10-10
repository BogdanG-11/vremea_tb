"use client";

import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Quest } from '@/lib/types';

interface QuestCardProps {
  quest: Quest;
  onSelect?: (quest: Quest) => void;
  onComplete?: (quest: Quest) => void;
}

/**
 * Card displaying quest details and progress.
 */
export default function QuestCard({ quest, onSelect, onComplete }: QuestCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyColor = (diff: Quest['difficulty']) => {
    switch (diff) {
      case 'easy': return 'emerald';
      case 'medium': return 'amber';
      case 'hard': return 'red';
      default: return 'slate';
    }
  };

  const isCompleted = quest.completed;
  const isActive = !quest.completed;

  return (
    <Card 
      glow={isCompleted ? 'emerald' : isActive ? 'purple' : null} 
      className="cursor-pointer transition-transform active:scale-[0.98]"
    >
      <div onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {isCompleted ? '✅' : '🎯'} {quest.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
              {quest.description}
            </p>
          </div>
          <Badge variant="amber" size="md">+{quest.xpReward} XP</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Badge variant={getDifficultyColor(quest.difficulty)}>{quest.difficulty}</Badge>
          <Badge variant="slate">{quest.category}</Badge>
          {quest.distance !== undefined && (
            <Badge variant="blue">📍 {quest.distance}m</Badge>
          )}
          {quest.weatherRequirement && (
            <Badge variant="purple">☁️ {quest.weatherRequirement}</Badge>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-5 pt-4 border-t border-slate-700/50 animate-fade-in motion-reduce:animate-none space-y-3">
          <Button 
            fullWidth 
            variant={isCompleted ? 'success' : 'primary'}
            disabled={isCompleted}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive && onComplete) onComplete(quest);
              else if (!isActive && onSelect) onSelect(quest);
            }}
          >
            {isCompleted ? 'Completed' : isActive ? 'Complete Quest' : 'Start Quest'}
          </Button>
        </div>
      )}
    </Card>
  );
}
