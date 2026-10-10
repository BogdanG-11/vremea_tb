import { NextRequest, NextResponse } from 'next/server';
import { processPlayerReply, ChatContext } from '@/lib/chat-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { message, context, messages } = body;

    if (!message && messages && messages.length > 0) {
      message = messages[messages.length - 1].content;
    }

    if (typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing message' },
        { status: 400 }
      );
    }

    if (!context) {
      context = { playerLevel: 1, playerName: 'Explorer' };
    }

    // This is using the rule-based chat engine for now.
    // TODO: To replace with a real AI API (e.g., OpenAI, Anthropic), you would:
    // 1. Initialize your AI client here
    // 2. Format the message and context into an LLM prompt
    // 3. Make the API call to the LLM
    // 4. Parse the LLM response into the expected format
    
    const reply = processPlayerReply(message, context as ChatContext);

    return NextResponse.json(
      { success: true, data: { reply } },
      { status: 200 }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
