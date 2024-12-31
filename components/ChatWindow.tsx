
"use client";

import { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { RoomSidebar } from './RoomSidebar';
import { useRoomMessages } from '@/hooks/use-room-messages';
import { ChatRoom } from '@/server/types';

interface ChatWindowProps {
  roomId: string;
  initialMessages?: any[];
}

export function ChatWindow({ roomId, initialMessages }: ChatWindowProps) {
  const { messages, error } = useRoomMessages(roomId, initialMessages);
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

  if (error) {
    return <div className="p-4 text-red-500">Error loading messages: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {room && (
        <div className="sticky top-0 z-10">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{room.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {room.participants?.length || 0} participants • {room.messageCount || 0} messages
                </p>
              </div>
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Other Rooms
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <RoomSidebar />
                </SheetContent>
              </Sheet>
            </div>
            {room.topic && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50">
                <p className="text-sm leading-relaxed">{room.topic}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
