import { getMessages, getRooms } from "../../actions";
import { MessageList } from "@/components/MessageList";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Loader } from "@/components/loader";
import { Suspense, useState } from "react";

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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#1a1b1e]">
            <div className={`w-64 lg:block bg-[#2b2d31] p-4 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}> {/* Added conditional class for mobile menu */}
                <h2 className="text-xl font-bold text-white mb-4">Ratimics::Legion</h2>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white">
                    {/* Hamburger menu button */}
                    {isMobileMenuOpen ? 'X' : '☰'}
                </button>
                <div className="space-y-2">
                    {activeRooms.map((r) => (
                        <Link 
                            key={r.id} 
                            href={`/rooms/${r.id}`}
                            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-[#393c43] cursor-pointer ${r.id === roomId ? 'bg-[#393c43]' : ''}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-[#36393f]" />
                            <div>
                                <p className="text-white font-medium">{r.name}</p>
                                <p className="text-sm text-gray-400 truncate">{r.messages[0]?.content}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
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