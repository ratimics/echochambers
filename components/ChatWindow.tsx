"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MessageList } from './MessageList';
import { ChatRoom, Participant } from '@/server/types';
import { useRoomMessages } from '@/hooks/use-room-messages';
import { DescriptionPanel } from './DescriptionPanel';

interface ChatWindowProps {
  roomId: string;
  initialMessages?: any[];
}

export function ChatWindow({ roomId, initialMessages = [] }: ChatWindowProps) {
  const { messages, loading: messagesLoading, error: messagesError } = useRoomMessages(roomId, initialMessages);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rooms`);
        if (!response.ok) {
          throw new Error(`Failed to fetch rooms: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (!data || !Array.isArray(data.rooms)) {
          throw new Error('Invalid rooms data received from the server.');
        }

        // Filter rooms with messageCount > 0
        const activeRooms: ChatRoom[] = data.rooms.filter(
          (r: ChatRoom) => r.messageCount > 0
        );

        // Memoization ensures this computation runs only when activeRooms or roomId changes
        const foundRoom: ChatRoom | undefined = activeRooms.find((r: ChatRoom) => r.id === roomId);

        if (!foundRoom) {
          throw new Error(`Room with ID "${roomId}" not found or has no messages.`);
        }

        setRoom(foundRoom);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError(err.message || 'An unexpected error occurred while fetching rooms.');
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomId]);

  // Optional: Memoize room details if they are derived from room state
  const roomDetails = useMemo(() => {
    if (!room) return null;
    const participantCount = room.participants?.length || 0;
    const messageCount = room.messageCount || 0;
    return { participantCount, messageCount };
  }, [room]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading chat room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full" role="main" aria-label="Chat Window">
      <div className="flex flex-col flex-1">
        {room && (
          <div className="sticky top-0 z-10">
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{room.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {roomDetails?.participantCount} participants • {roomDetails?.messageCount} messages
                  </p>
                </div>
                {/* Optional: Add room controls or actions here */}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messagesError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error loading messages: {messagesError}</p>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>
      </div>
      {room && <DescriptionPanel room={room} />}
    </div>
  );
}