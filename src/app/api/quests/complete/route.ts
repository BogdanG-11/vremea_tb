import { NextRequest, NextResponse } from 'next/server';
import { haversineDistance } from '@/lib/distance';
import { GAME_CONFIG } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questId, playerLat, playerLon, questTargetLat, questTargetLon, xpReward, manual } = body;

    if (!questId) {
      return NextResponse.json(
        { success: false, error: 'Missing questId' },
        { status: 400 }
      );
    }

    if (
      typeof playerLat !== 'number' ||
      typeof playerLon !== 'number' ||
      typeof questTargetLat !== 'number' ||
      typeof questTargetLon !== 'number' ||
      typeof xpReward !== 'number'
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates or xpReward' },
        { status: 400 }
      );
    }

    const distance = haversineDistance(playerLat, playerLon, questTargetLat, questTargetLon);
    
    // Check if within radius, fallback to manual completion
    const radius = GAME_CONFIG.questCompletionRadius || 75;
    const isWithinRadius = distance <= radius;

    if (isWithinRadius || manual) {
      // Cap XP at 500
      const cappedXp = Math.min(xpReward, 500);
      
      return NextResponse.json(
        { 
          success: true, 
          data: { 
            completed: true, 
            xpAwarded: cappedXp, 
            distance 
          } 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too far from quest location', 
          data: { distance } 
        },
        { status: 400 } // Or 403 Forbidden
      );
    }

  } catch (error) {
    console.error('Quest Completion API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process quest completion' },
      { status: 500 }
    );
  }
}
