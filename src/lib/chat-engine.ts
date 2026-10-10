import { ChatMessage, WeatherData, Place, Quest } from './types';

export interface ChatContext {
  weather?: WeatherData;
  place?: Place;
  quest?: Quest;
  playerLevel: number;
  playerName: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function generateGreeting(context: ChatContext): ChatMessage {
  let content = `Welcome back, ${context.playerName}! `;
  
  if (context.weather) {
    if (['rainy', 'stormy'].includes(context.weather.gameCategory)) {
      content += `It's quite wet out there. Make sure to stay warm!`;
    } else if (context.weather.gameCategory === 'sunny') {
      content += `The weather is brilliant for an adventure today.`;
    } else {
      content += `It's a good day to explore.`;
    }
  }

  return {
    id: generateId(),
    role: 'guide',
    content,
    timestamp: Date.now(),
    quickReplies: ["I'm ready!", "What's the weather like?", "Show me quests"]
  };
}

export function generateLocationDiscovery(context: ChatContext): ChatMessage {
  const placeName = context.place?.name || 'this interesting spot';
  return {
    id: generateId(),
    role: 'guide',
    content: `You've arrived at ${placeName}! I've only heard rumors about this place. Tell me, what does it look like? Are there any interesting details?`,
    timestamp: Date.now(),
    quickReplies: ["It's very crowded", "It's peaceful and quiet", "It looks ancient"]
  };
}

export function generateQuestComplete(context: ChatContext, xpAwarded: number): ChatMessage {
  const questName = context.quest?.name || 'a quest';
  return {
    id: generateId(),
    role: 'guide',
    content: `Fantastic work completing ${questName}! You earned ${xpAwarded} XP. Your skills are really growing!`,
    timestamp: Date.now(),
    quickReplies: ["Thanks!", "What's next?"]
  };
}

export function generateWeatherComment(context: ChatContext): ChatMessage {
  const condition = context.weather?.description || 'the weather';
  return {
    id: generateId(),
    role: 'guide',
    content: `Take note of ${condition}. The elements always affect a true adventurer's journey. How is it treating you?`,
    timestamp: Date.now(),
    quickReplies: ["I love it", "It's making things difficult"]
  };
}

export function processPlayerReply(reply: string, context: ChatContext): ChatMessage {
  const lowerReply = reply.toLowerCase();
  let content = '';
  
  if (lowerReply.includes('weather') || lowerReply.includes('vreme')) {
    content = context.weather ? `Right now it's ${context.weather.description}. Prepare accordingly.` : 'The weather is mysterious right now, but I hope it is nice!';
  } else if (lowerReply.includes('quest') || lowerReply.includes('misiun')) {
    content = `Check your quest log to see what adventures await near you. I'm sure you'll find something exciting!`;
  } else if (lowerReply.includes('quiet') || lowerReply.includes('crowded') || lowerReply.includes('ancient') || lowerReply.includes('frumos')) {
    content = `Fascinating! I'll add that detail to our shared map. Those are the kinds of observations that make you a great explorer.`;
  } else if (lowerReply.includes('hello') || lowerReply.includes('hi') || lowerReply.includes('salut') || lowerReply.includes('buna')) {
    content = `Greetings, ${context.playerName}! Ready for another adventure today?`;
  } else if (lowerReply.includes('help') || lowerReply.includes('ajutor')) {
    content = `I'm your guide! I can tell you about the weather, give you hints about your quests, or just chat about the places you discover.`;
  } else {
    // Randomized fallback responses for variety
    const fallbacks = [
      `I see. Let's keep moving forward!`,
      `Interesting! Tell me more when you have a moment.`,
      `The journey is long, but every step counts.`,
      `Good to know. Keep your eyes open for hidden spots!`,
      `Got it. I'll be here if you need any guidance.`
    ];
    content = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  return {
    id: generateId(),
    role: 'guide',
    content,
    timestamp: Date.now()
  };
}
