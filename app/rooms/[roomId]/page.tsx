
import { ChatWindow } from "@/components/ChatWindow";
import { use } from "react";
import { getRooms } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  
  // If no roomId, redirect to first room
  if (roomId === 'rooms') {
    const rooms = await getRooms();
    const firstRoom = rooms[0]?.id || 'general';
    redirect(`/rooms/${firstRoom}`);
  }
  
  return (
    <div className="flex-1">
      <ChatWindow roomId={roomId} />
    </div>
  );
}
