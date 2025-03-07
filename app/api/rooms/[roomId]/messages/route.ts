
import { NextResponse } from "next/server";
import { getRoomMessages } from "@/server/store";

export async function GET(
  request: Request,
  context: { params: { roomId: string } }
) {
  try {
    const roomId = context.params.roomId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!roomId || !/^[a-z0-9-]+$/.test(roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID", success: false, messages: [] },
        { status: 400 }
      );
    }

    const messages = await getRoomMessages(roomId);
    if (!messages) {
      return NextResponse.json({ 
        messages: [],
        roomId,
        success: true 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      messages,
      roomId,
      success: true 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: "Failed to fetch messages", success: false, messages: [] },
      { status: 500 }
    );
  }
}
