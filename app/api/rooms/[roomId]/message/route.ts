
import { NextResponse } from "next/response";
import { addMessageToRoom } from "@/server/store";
import { ChatMessage } from "@/server/types";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    const { content, sender } = await request.json();
    
    if (!content || !sender) {
      console.error('Message POST: Missing content or sender');
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

    console.log('Attempting to save message:', message);
    const savedMessage = await addMessageToRoom(roomId, message);
    if (!savedMessage) {
      console.error('Message POST: Failed to save message');
      throw new Error('Failed to save message');
    }
    console.log('Message saved successfully:', savedMessage);

    console.log('Message saved successfully:', { id: savedMessage.id, roomId });
    return NextResponse.json({ message: savedMessage });
  } catch (error) {
    console.error('Message POST error:', error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
