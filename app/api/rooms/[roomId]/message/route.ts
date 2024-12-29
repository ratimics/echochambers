
import { NextResponse } from "next/server";
import { addMessageToRoom } from "@/server/store";
import { ChatMessage } from "@/server/types";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId;
  if (!roomId) {
    return NextResponse.json(
      { error: "Room ID is required" },
      { status: 400 }
    );
  }

  try {
    const { content, sender } = await request.json();
    
    if (!content || !sender) {
      return NextResponse.json(
        { error: "Content and sender are required" },
        { status: 400 }
      );
    }

    const message: Omit<ChatMessage, 'id'> = {
      content,
      sender,
      timestamp: new Date().toISOString(),
      roomId
    };

    const savedMessage = await addMessageToRoom(roomId, message);
    if (!savedMessage) {
      throw new Error('Failed to save message');
    }
    
    return NextResponse.json({ message: savedMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: "Failed to save message", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
