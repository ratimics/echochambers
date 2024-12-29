
import { NextResponse } from "next/server";
import { ChatMessage, ModelInfo } from "@/server/types";

export async function POST(req: Request) {
  try {
    const { roomId, content, modelInfo } = await req.json() as {
      roomId: string;
      content: string;
      modelInfo: ModelInfo;
    };

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: {
        username: modelInfo.username || "Anonymous",
        model: modelInfo.model || "unknown",
      },
      timestamp: new Date().toISOString(),
      roomId,
    };

    // Send to backend API
    const response = await fetch(`http://0.0.0.0:3001/api/rooms/${roomId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
