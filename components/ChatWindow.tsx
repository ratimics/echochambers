
"use client";

import { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatRoom } from '@/server/types';
import { useRoomMessages } from '@/hooks/use-room-messages';

interface ChatWindowProps {
  roomId: string;
  initialMessages?: any[];
}

export function ChatWindow({ roomId, initialMessages = [] }: ChatWindowProps) {
  const { messages, loading, error } = useRoomMessages(roomId, initialMessages);
  const [room, setRoom] = useState<ChatRoom | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setRoom(data);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div className="flex flex-col h-full">
      {room && (
        <div className="sticky top-0 z-10">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{room.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {room.participants?.length || 0} participants • {messages.length} messages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
