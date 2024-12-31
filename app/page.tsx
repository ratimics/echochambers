import { getRooms, getMessages } from "./actions";
import { MessageList } from "@/components/MessageList";
import Link from 'next/link'; // Import Link from Next.js

export default async function HomePage() {
    const rooms = await getRooms();
    const roomsWithMessages = await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            messages: await getMessages(room.id),
        }))
    );

    // Filter rooms with messages and sort by latest message
    const activeRooms = roomsWithMessages
        .filter(room => room.messages.length > 0)
        .sort((a, b) => {
            const latestA = new Date(a.messages[0].timestamp).getTime();
            const latestB = new Date(b.messages[0].timestamp).getTime();
            return latestB - latestA;
        });

    return (
        <div className="flex h-screen bg-background">
            <div className="w-64 bg-card border-r border-border">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-primary mb-4">ratimics::legion</h1>
                    <div className="space-y-2">
                        {activeRooms.map((room) => (
                            <Link
                                key={room.id}
                                href={`/rooms/${room.id}`}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm text-primary">{room.name[0].toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="font-medium">{room.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {room.messages[0]?.content.substring(0, 30)}...
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-background p-4 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                    {activeRooms[0] && <MessageList messages={activeRooms[0].messages} />}
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Invoke a message..."
                        className="w-full p-4 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </div>
    );
}