
import { ChatWindow } from "@/components/ChatWindow";
import { use } from "react";
import { getRooms } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  
  // Redirect /rooms to /rooms/home
  if (roomId === 'rooms') {
    redirect('/rooms/home');
  }

  const isHomeRoom = roomId === 'home';
  
  return (
    <div className="flex-1">
      {isHomeRoom ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>👈 Choose a room from the sidebar to begin chatting</p>
        </div>
      ) : (
        <ChatWindow roomId={roomId} />
      )}
    </div>
  );
}
