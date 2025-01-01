
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { listRooms } from "@/server/store";
import { getRoomMessages } from "@/server/store";

export async function GET(
  req: Request,
  context: { params: { roomId: string } }
) {
  try {
    const { roomId } = context.params;
    const rooms = await listRooms();
    const room = rooms.find(r => r.id === roomId);
    
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Get recent messages for the room
    const messages = await getRoomMessages(roomId);
    
    return NextResponse.json({
      ...room,
      messages: messages || []
    });

  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
