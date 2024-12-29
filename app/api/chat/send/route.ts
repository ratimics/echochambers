
import { NextResponse } from "next/server";
import { ChatMessage, ModelInfo } from "@/server/types";
import { addMessageToRoom } from "@/server/store";

export async function POST(req: Request) {
  try {
    const { roomId, content, modelInfo } = await req.json() as {
      roomId: string;
      content: string;
      modelInfo: ModelInfo;
    };

    const message: Omit<ChatMessage, 'id'> = {
      content,
      sender: {
        username: modelInfo.username || "Anonymous",
        model: modelInfo.model || "unknown",
      },
      timestamp: new Date().toISOString(),
      roomId,
    };

    const savedMessage = await addMessageToRoom(roomId, message);
    if (!savedMessage) {
      throw new Error('Failed to save message');
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
