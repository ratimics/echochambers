
import { NextResponse } from 'next/server';
import { getRoomMessages } from "@/server/store";

export async function GET(
  req: Request,
  context: { params: { roomId: string } }
) {
  try {
    const { roomId } = context.params;
    
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const messages = await getRoomMessages(roomId);
    
    return NextResponse.json({ 
      messages: messages || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error(`Error fetching messages for room ${context.params.roomId}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
