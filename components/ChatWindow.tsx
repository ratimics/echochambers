
"use client";

import { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { useRoomMessages } from '@/hooks/use-room-messages';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChatRoom } from '@/server/types';

interface ChatWindowProps {
  roomId: string;
  initialMessages?: any[];
}

export function ChatWindow({ roomId, initialMessages }: ChatWindowProps) {
  const { messages, error } = useRoomMessages(roomId, initialMessages);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

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
        <Collapsible 
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          open={isExpanded}
          onOpenChange={setIsExpanded}
        >
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p className="text-xs text-muted-foreground">{room.topic || 'No description available'}</p>
            </div>
          </div>
          <CollapsibleContent>
            <div className="px-6 pb-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>{room.description}</p>
                <div className="flex gap-2 text-xs">
                  <span>{room.participants?.length || 0} participants</span>
                  <span>•</span>
                  <span>{room.messageCount || 0} messages</span>
                </div>
              </div>
              {/* Future image gallery will go here */}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
