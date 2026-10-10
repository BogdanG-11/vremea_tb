import { NextRequest, NextResponse } from 'next/server';
import { generateQuests } from '@/lib/quest-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { places, weather, completedQuestIds } = body;

    if (!Array.isArray(places)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing places array' },
        { status: 400 }
      );
    }

    if (!weather || typeof weather.temperature !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing weather data' },
        { status: 400 }
      );
    }

    const completedSet = new Set<string>(completedQuestIds || []);
    
    // Filter places to those that haven't been completed yet (optional, depending on quest generation logic)
    // Here we pass the data to generateQuests
    const quests = generateQuests(places, weather, completedQuestIds || []);

    return NextResponse.json(
      { success: true, data: { quests } },
      { status: 200 }
    );

  } catch (error) {
    console.error('Quests Generate API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate quests' },
      { status: 500 }
    );
  }
}
