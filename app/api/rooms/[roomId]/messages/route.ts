
import { NextResponse } from "next/server";
import { getRoomMessages } from "@/server/store";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!roomId || !/^[a-z0-9-]+$/.test(roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID" },
        { status: 400 }
      );
    }

    try {
      const messages = await getRoomMessages(roomId);
      return NextResponse.json({ 
        messages: messages || [],
        roomId,
        success: true 
      });
    } catch (error) {
      console.error('Error fetching room messages:', error);
      return NextResponse.json({ 
        messages: [],
        roomId,
        success: false,
        error: "No messages found"
      });
    }
    return NextResponse.json({ 
      messages: messages || [],
      roomId,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching room messages:', error);
    return NextResponse.json(
      { error: "Failed to fetch room messages" },
      { status: 500 }
    );
  }
}
