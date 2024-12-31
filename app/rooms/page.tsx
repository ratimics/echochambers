
import { getRooms, getMessages } from "../actions";
import { RoomSidebar } from "@/components/RoomSidebar";
import { MessageList } from "@/components/MessageList";
import { use } from "react";

export default function RoomsPage() {
  const rooms = use(getRooms());
  const roomsWithMessages = rooms.map(async room => ({
    ...room,
    messages: await getMessages(room.id)
  }));

  const activeRooms = use(Promise.all(roomsWithMessages));

  return (
    <div className="flex h-screen">
      <RoomSidebar activeRooms={activeRooms} />
      <main className="flex-1 bg-[#313338] p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4">
            {activeRooms[0] && <MessageList messages={activeRooms[0].messages} />}
          </div>
        </div>
      </main>
    </div>
  );
}
