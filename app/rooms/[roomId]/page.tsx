
"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/app/actions";
import { MessageList } from "@/components/MessageList";

export default function RoomPage({ params }: { params: { roomId: string } }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function loadMessages() {
            const roomMessages = await getMessages(params.roomId);
            setMessages(roomMessages);
        }

        loadMessages();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [params.roomId]);

    return (
        <div className="flex-1 bg-background p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4">
                <MessageList messages={messages} />
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Invoke a message..."
                    className="w-full p-4 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    );
}
