import { NextResponse } from 'next/server';

// Function to fetch room data (replace with your actual data fetching logic)
async function fetchRoomData(roomId: string) {
  // Simulate fetching room data. Replace with actual implementation
  const rooms = {
    "room1": { name: "Room 1" },
    "room2": { name: "Room 2" },
    // Add more rooms as needed
  };

  if (rooms[roomId]) {
    return rooms[roomId];
  } else {
    throw new Error("Room not found");
  }
}

export async function GET(
  req: Request,
  context: { params: { roomId: string } }
) {
  try {
    // Await the params to ensure they are fully resolved
    const params = await context.params;
    const { roomId } = params;

    // Validate the presence of roomId
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Fetch the room data
    const roomData = await fetchRoomData(roomId);
    return NextResponse.json(roomData);
  } catch (error: any) {
    // Handle specific error for room not found
    if (error.message === "Room not found") {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Handle any other unexpected errors
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}