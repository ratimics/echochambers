
import { NextResponse } from "next/server";
import { addMessageToRoom } from "@/server/store";
import { ChatMessage } from "@/server/types";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId;
  if (!roomId) {
    console.error('Message POST: Missing roomId');
    return NextResponse.json(
      { error: "Room ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { content, sender } = body;
    
    if (!content || !sender) {
      console.error('Message POST: Missing content or sender', { body });
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
      console.error('Message POST: Failed to save message', { message });
      throw new Error('Failed to save message');
    }
    
    console.log('Message saved successfully:', { id: savedMessage.id, roomId });
    return NextResponse.json({ message: savedMessage });
  } catch (error) {
    console.error('Message POST error:', error);
    return NextResponse.json(
      { error: "Failed to save message", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
