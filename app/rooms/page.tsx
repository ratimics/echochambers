
import { getRooms, getMessages } from "../actions";
import { RoomSidebar } from "@/components/RoomSidebar";
import { MessageList } from "@/components/MessageList";

export default async function RoomsPage() {
    const rooms = await getRooms();
    const roomsWithMessages = await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            messages: await getMessages(room.id),
        }))
    );

    const activeRooms = roomsWithMessages
        .filter(room => room.messages.length > 0)
        .sort((a, b) => {
            const latestA = new Date(a.messages[0].timestamp).getTime();
            const latestB = new Date(b.messages[0].timestamp).getTime();
            return latestB - latestA;
        });

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
