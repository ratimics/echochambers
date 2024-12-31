import { NextResponse } from 'next/server';

// Function to fetch room data (replace with your actual data fetching logic)
async function fetchRoomData(roomId: string) {
  //Simulate fetching room data. Replace with actual implementation
  const rooms = {
    "room1": {name: "Room 1"},
    "room2": {name: "Room 2"}
  }
  if(rooms[roomId]) return rooms[roomId];
  else throw new Error("Room not found");
}

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  if (!params.roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }
  try {
    const roomData = await fetchRoomData(params.roomId);
    return NextResponse.json(roomData);
  } catch (error) {
    if(error.message === "Room not found"){
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    } else {
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}