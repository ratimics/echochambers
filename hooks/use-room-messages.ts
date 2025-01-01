import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/server/types';

const POLL_INTERVAL = 2000;
const MAX_RETRIES = 3;

export function useRoomMessages(roomId: string, initialMessages?: ChatMessage[]) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
    const [loading, setLoading] = useState(!initialMessages);
    const [error, setError] = useState<Error | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchMessages = useCallback(async () => {
        if (!roomId) return;
        
        try {
            const response = await fetch(`/api/rooms/${roomId}/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.messages) {
                setMessages(data.messages);
                setRetryCount(0);
                setError(null);
            }
        } catch (err: any) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'Failed to fetch messages. Please try again.');
            setMessages([]); // Reset messages on error
            setRetryCount(prev => prev + 1);
            if (retryCount >= MAX_RETRIES) {
                setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
            }
        } finally {
            setLoading(false);
        }
    }, [roomId, retryCount]);

    useEffect(() => {
        let mounted = true;
        let intervalId: NodeJS.Timeout;

        const initFetch = async () => {
            if (mounted) {
                setLoading(true);
                await fetchMessages();
            }
        };

        initFetch();

        if (mounted && !error) {
            intervalId = setInterval(fetchMessages, POLL_INTERVAL);
        }

        return () => {
            mounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [fetchMessages, error]);

    return { messages, loading, error };
}