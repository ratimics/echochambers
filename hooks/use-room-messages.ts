
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/server/types';

export function useRoomMessages(roomId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/rooms/${roomId}/history`);
                const data = await response.json();
                if (mounted && data.messages) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        // Initial fetch
        fetchMessages();

        // Set up polling every 2 seconds
        const interval = setInterval(fetchMessages, 2000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [roomId]);

    return { messages, loading };
}
