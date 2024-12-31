
import { getMessages, getRooms } from "../../actions";
import { MessageList } from "@/components/MessageList";
import { notFound } from "next/navigation";
import { Loader } from "@/components/loader";
import { Suspense } from "react";
import { RoomSidebar } from "@/components/RoomSidebar";

export default async function RoomPage({ params }: { params: { roomId: string } }) {
    const roomId = params.roomId;
    
    return (
        <Suspense fallback={<Loader />}>
            <RoomContent roomId={roomId} />
        </Suspense>
    );
}

async function RoomContent({ roomId }: { roomId: string }) {
    const messages = await getMessages(roomId);
    const rooms = await getRooms();
    const room = rooms.find(r => r.id === roomId);
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

    if (!room) {
        return notFound();
    }

    return (
        <div className="flex h-screen bg-[#1a1b1e]">
            <RoomSidebar activeRooms={activeRooms} currentRoomId={roomId} />
            <div className="flex-1 bg-[#313338] p-4">
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        <MessageList messages={messages} />
                    </div>
                </div>
            </div>
        </div>
    );
}
