
import { getRooms, getMessages } from "@/app/actions";
import { RoomSidebar } from "@/components/RoomSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { use } from "react";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  const rooms = use(getRooms());
  const messages = use(getMessages(roomId));
  
  const roomsWithMessages = rooms.map(room => ({
    ...room,
    messages: room.id === roomId ? messages : []
  }));

  return (
    <div className="flex h-screen">
      <RoomSidebar activeRooms={roomsWithMessages} currentRoomId={roomId} />
      <main className="flex-1">
        <ChatWindow roomId={roomId} />
      </main>
    </div>
  );
}
