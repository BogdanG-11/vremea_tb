"use client";

import { useState, useEffect } from 'react';
import { useAdventure } from '@/hooks/useAdventure';
import { usePlayer } from '@/hooks/usePlayer';
import { useChat } from '@/hooks/useChat';
import { Quest } from '@/lib/types';

import TopBar from '@/components/game/TopBar';
import MapWrapper from '@/components/game/MapWrapper';
import QuestCard from '@/components/game/QuestCard';
import PlaceCard from '@/components/game/PlaceCard';
import WeatherDisplay from '@/components/game/WeatherDisplay';
import ChatPanel from '@/components/game/ChatPanel';
import BottomNav from '@/components/game/BottomNav';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import QuestCompleteModal from '@/components/game/QuestCompleteModal';
import AchievementBadge from '@/components/game/AchievementBadge';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'quests' | 'chat'>('dashboard');

  const {
    adventureActive,
    loading: adventureLoading,
    error,
    weather,
    places,
    quests,
    selectedQuest,
    setSelectedQuest,
    proximityAlert,
    startAdventure,
    stopAdventure,
    completeQuest: completeAdventureQuest,
  } = useAdventure();

  const { player, addXp, xpProgress, newAchievements } = usePlayer();

  const {
    messages,
    loading: chatLoading,
    sendMessage,
    addSystemMessage,
  } = useChat();

  const [questToComplete, setQuestToComplete] = useState<Quest | null>(null);

  useEffect(() => {
    if (proximityAlert && !questToComplete) {
      setQuestToComplete(proximityAlert);
    }
  }, [proximityAlert, questToComplete]);

  const handleQuestCompletion = async () => {
    if (!questToComplete) return;

    const success = await completeAdventureQuest(questToComplete);
    if (success) {
      const xpReward = questToComplete.xpReward || 500;
      addXp(xpReward);
      addSystemMessage(`You have completed the quest "${questToComplete.name}" and earned ${xpReward} XP!`);
      setQuestToComplete(null);
    }
  };

  const handleStartAdventure = async () => {
    const started = await startAdventure(false); // Can change to true for demo
    if (started) {
      addSystemMessage('Welcome to your new adventure! I will be your guide. Check the map and your active quests to get started.');
    }
  };

  const handleStopAdventure = () => {
    stopAdventure();
    addSystemMessage('Adventure stopped. Rest well, hero.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopBar 
        level={player?.level || 1}
        xp={player?.xp || 0}
        xpToNext={player?.xpToNextLevel || 100}
        weatherIcon={weather?.icon || '🌤️'}
        temperature={weather?.temperature || 0}
        weatherCategory={weather?.gameCategory || 'Loading...'}
      />

      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        {error && (
          <div className="p-4 m-4 bg-red-100 text-red-700 rounded-lg shadow-sm border border-red-200">
            Error: {error}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-6">
            <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {adventureActive ? 'Adventure in Progress' : 'Ready for an Adventure?'}
              </h2>
              
              {adventureLoading ? (
                <LoadingSpinner />
              ) : (
                <Button 
                  onClick={adventureActive ? handleStopAdventure : handleStartAdventure}
                  variant={adventureActive ? 'danger' : 'primary'}
                  className="w-full max-w-xs py-3 text-lg"
                >
                  {adventureActive ? 'End Adventure' : 'Start Adventure'}
                </Button>
              )}
            </section>

            {adventureActive && weather && (
              <section>
                <h3 className="text-lg font-bold mb-3 px-1 text-gray-800">Current Conditions</h3>
                <WeatherDisplay weather={weather} />
              </section>
            )}

            {adventureActive && places.length > 0 && (
              <section>
                <h3 className="text-lg font-bold mb-3 px-1 text-gray-800">Nearby Discoveries</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
                  {places.map(place => (
                    <div key={place.id} className="min-w-[280px] snap-center">
                      <PlaceCard place={place} onSelect={() => {}} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="h-full w-full relative bg-gray-200">
            <MapWrapper 
              playerPosition={null}
              places={places} 
              quests={quests}
              selectedQuest={selectedQuest}
              onPlaceSelect={(place) => console.log('Selected place', place)}
              onQuestSelect={(quest) => setSelectedQuest(quest)}
            />
          </div>
        )}

        {/* QUESTS TAB */}
        {activeTab === 'quests' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Quests</h2>
            {quests.length === 0 ? (
              <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                {adventureActive 
                  ? "You have completed all active quests! Keep exploring."
                  : "No active quests. Start an adventure to discover some!"}
              </div>
            ) : (
              quests.map(quest => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onSelect={(q) => setSelectedQuest(q)}
                  onComplete={() => setQuestToComplete(quest)}
                />
              ))
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <ChatPanel 
              messages={messages} 
              onSendMessage={sendMessage} 
              onQuickReply={sendMessage}
              context={{ playerLevel: player?.level || 1, playerName: player?.name || 'Adventurer' }}
            />
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={(tab: any) => setActiveTab(tab)} />

      {/* MODALS */}
      {questToComplete && (
        <QuestCompleteModal
          isOpen={!!questToComplete}
          onClose={() => {
            handleQuestCompletion();
            setQuestToComplete(null);
          }}
          questName={questToComplete.name}
          xpAwarded={questToComplete.xpReward || 0}
        />
      )}

      {/* NEW ACHIEVEMENTS TOASTS */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-50 pointer-events-none">
        {newAchievements.map(ach => (
          <AchievementBadge 
            key={ach.id} 
            icon={ach.icon}
            name={ach.name}
            description={ach.description}
            unlockedAt={ach.unlockedAt ? new Date(ach.unlockedAt) : new Date()}
            isNew={true}
          />
        ))}
      </div>
    </div>
  );
}
