
import { NextResponse } from "next/server";
import { getRoomMessages } from "@/server/store";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId.toLowerCase().replace("#", "");
    if (!roomId) {
      return NextResponse.json(
        { error: "Invalid room ID" },
        { status: 400 }
      );
    }

    const messages = await getRoomMessages(roomId);
    
    return NextResponse.json({ 
      messages: messages || [],
      roomId,
      success: true
    });
  } catch (error) {
    console.error('Error fetching room history:', error);
    return NextResponse.json(
      { error: "Failed to fetch room history", success: false },
      { status: 500 }
    );
  }
}
