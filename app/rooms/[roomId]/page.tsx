
import { ChatWindow } from "@/components/ChatWindow";
import { use } from "react";

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  return (
    <div className="flex-1">
      <ChatWindow roomId={roomId} />
    </div>
  );
}
