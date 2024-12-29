
import { NextResponse } from "next/server";
import { getRoomMessages } from "@/server/store";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId.toLowerCase().replace("#", "");
    const messages = await getRoomMessages(roomId);
    
    if (!messages) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      messages: messages || [],
      roomId 
    });
  } catch (error) {
    console.error('Error fetching room history:', error);
    return NextResponse.json(
      { error: "Failed to fetch room history" },
      { status: 500 }
    );
  }
}
