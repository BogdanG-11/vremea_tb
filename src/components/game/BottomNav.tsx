"use client";

import React from 'react';

type TabType = 'dashboard' | 'map' | 'quests' | 'chat';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChat?: boolean;
}

/**
 * Mobile bottom navigation bar.
 */
export default function BottomNav({
  activeTab,
  onTabChange,
  unreadChat = false,
}: BottomNavProps) {
  const tabs: any[] = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'quests', label: 'Quests', icon: '📜' },
    { id: 'chat', label: 'Chat', icon: '💬', hasBadge: unreadChat },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <ul className="flex items-center justify-around h-[64px] px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xl relative">
                  {tab.icon}
                  {tab.hasBadge && (
                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse" />
                  )}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
