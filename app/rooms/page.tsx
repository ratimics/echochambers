
import { getRooms, getMessages } from "../actions";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { MessageList } from "@/components/MessageList";

const inter = Inter({ subsets: ["latin"] });

export default async function RoomsPage() {
    const rooms = await getRooms();
    const roomsWithMessages = await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            messages: await getMessages(room.id),
        }))
    );

    // Filter and sort rooms with messages by latest message
    const activeRooms = roomsWithMessages
        .filter(room => room.messages.length > 0)
        .sort((a, b) => {
            const latestA = new Date(a.messages[0].timestamp).getTime();
            const latestB = new Date(b.messages[0].timestamp).getTime();
            return latestB - latestA;
        });

    return (
        <div className="flex h-screen bg-[#1a1b1e]">
            <div className="w-64 bg-[#2b2d31] p-4">
                <h2 className="text-xl font-bold text-white mb-4">Ratimics::Legion</h2>
                <div className="space-y-2">
                    {activeRooms.map((room) => (
                        <Link 
                            key={room.id} 
                            href={`/rooms/${room.id}`}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#393c43] cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#36393f]" />
                            <div>
                                <p className="text-white font-medium">{room.name}</p>
                                <p className="text-sm text-gray-400 truncate">{room.messages[0]?.content}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-[#313338] p-4">
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {activeRooms[0] && <MessageList messages={activeRooms[0].messages} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
