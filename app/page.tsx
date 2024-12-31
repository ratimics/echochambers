
"use client";

import { getRooms, getMessages } from "./actions";
import { MessageList } from "@/components/MessageList";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const [activeRooms, setActiveRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function loadRooms() {
            const rooms = await getRooms();
            const roomsWithMessages = await Promise.all(
                rooms.map(async (room) => ({
                    ...room,
                    messages: await getMessages(room.id),
                }))
            );

            const active = roomsWithMessages
                .filter(room => room.messages.length > 0)
                .sort((a, b) => {
                    const latestA = new Date(a.messages[0].timestamp).getTime();
                    const latestB = new Date(b.messages[0].timestamp).getTime();
                    return latestB - latestA;
                });

            setActiveRooms(active);
            if (active.length > 0 && !selectedRoom) {
                setSelectedRoom(active[0]);
            }
        }

        loadRooms();
        const interval = setInterval(loadRooms, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="lg:w-64 w-full bg-card border-r border-border">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-red-500 mb-4 lowercase">ratimics::legion</h1>
                    <nav className="space-y-2">
                        {activeRooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => {
                                    setSelectedRoom(room);
                                    router.push(`/rooms/${room.id}`, { scroll: false });
                                }}
                                className="flex items-center w-full space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm text-primary">{room.name[0].toUpperCase()}</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">{room.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {room.messages[0]?.content.substring(0, 30)}...
                                    </p>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="flex-1 bg-background p-4 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                    {selectedRoom && <MessageList messages={selectedRoom.messages} />}
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Invoke a message..."
                        className="w-full p-4 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </>
    );
}
