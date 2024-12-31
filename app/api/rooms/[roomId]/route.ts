
import { NextResponse } from 'next/server';
import { listRooms } from "@/server/store";

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

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
