
import { ChatWindow } from "@/components/ChatWindow";
import { redirect } from "next/navigation";
import { use } from "react";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = use(Promise.resolve(params.roomId));
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
