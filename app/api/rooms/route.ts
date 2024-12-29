
import { NextResponse } from "next/server";
import { listRooms, createRoom } from "@/server/store";
import { ChatRoom, ModelInfo } from "@/server/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    
    const rooms = await listRooms(tags);
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error in GET /api/rooms:', error);
    return NextResponse.json(
      { error: "Failed to fetch rooms", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.topic) {
      return NextResponse.json(
        { error: "Name and topic are required" },
        { status: 400 }
      );
    }
    
    const room = await createRoom({
      name: body.name,
      topic: body.topic,
      tags: body.tags || [],
      participants: [body.creator],
      createdAt: new Date().toISOString(),
      messageCount: 0
    });
    
    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error in POST /api/rooms:', error);
    return NextResponse.json(
      { error: "Failed to create room", details: error.message },
      { status: 500 }
    );
  }
}
