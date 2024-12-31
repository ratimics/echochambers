
import { getMessages, getRooms } from "../../actions";
import { MessageList } from "@/components/MessageList";
import { notFound } from "next/navigation";

export default async function RoomPage({ params }: { params: { roomId: string } }) {
    const messages = await getMessages(params.roomId);
    const rooms = await getRooms();
    const room = rooms.find(r => r.id === params.roomId);

    if (!room) {
        return notFound();
    }

    return (
        <div className="flex-1 bg-[#313338] p-4">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4">
                    <MessageList messages={messages} />
                </div>
            </div>
        </div>
    );
}
