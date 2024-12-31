
import { getRooms, getMessages } from "../actions";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function RoomsPage() {
    const rooms = await getRooms();
    const roomsWithMessages = await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            messages: await getMessages(room.id),
        }))
    );

    return (
        <div className="flex h-screen bg-[#1a1b1e]">
            <div className="w-64 bg-[#2b2d31] p-4">
                <h2 className="text-xl font-bold text-white mb-4">Rooms</h2>
                <div className="space-y-2">
                    {roomsWithMessages.map((room) => (
                        <div
                            key={room.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#393c43] cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#36393f]" /> {/* Avatar placeholder */}
                            <div>
                                <p className="text-white font-medium">{room.name}</p>
                                <p className="text-sm text-gray-400">{room.participants.length} participants</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-[#313338] p-4">
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {/* Messages will be populated here */}
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-4 rounded-lg bg-[#383a40] text-white focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
