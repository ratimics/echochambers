"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { ChatRoom, ChatMessage } from "@/server/types";
import { ChatWindow } from "./ChatWindow";

interface RoomGridProps {
  initialRooms: (ChatRoom & { messages: ChatMessage[] })[];
}

export function RoomGrid({ initialRooms }: RoomGridProps) {
  const [rooms, setRooms] =
    useState<(ChatRoom & { messages: ChatMessage[] })[]>(initialRooms);
  const [fullscreenRoom, setFullscreenRoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/rooms`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.rooms) {
          const roomsWithMessages = await Promise.all(
            data.rooms.map(async (newRoom: ChatRoom) => {
              try {
                const msgResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || ''}/api/rooms/${newRoom.id}/messages`,
                );
                if (!msgResponse.ok) {
                  return { ...newRoom, messages: [] };
                }
                const msgData = await msgResponse.json();
                return { ...newRoom, messages: msgData.messages || [] };
              } catch (error) {
                console.error(
                  `Error fetching messages for room ${newRoom.id}:`,
                  error,
                );
                return { ...newRoom, messages: [] };
              }
            }),
          );
          setRooms(roomsWithMessages);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        //Added retry mechanism.  This is inferred from the incomplete change snippet.
        setTimeout(fetchRooms, 5000);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  // Count unique users who have posted messages
  const getUniqueUsers = (messages: ChatMessage[]) => {
    const uniqueUsers = new Set(messages.map((msg) => msg.sender.username));
    return uniqueUsers.size;
  };

  if (fullscreenRoom) {
    const room = rooms.find((r) => r.id === fullscreenRoom);
    if (!room) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-mono">{room.name}</h1>
            <p className="text-muted-foreground">{room.topic}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFullscreenRoom(null)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-[calc(100vh-8rem)]">
          <ChatWindow roomId={room.id} initialMessages={room.messages} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.filter(room => room.messageCount > 0).map((room) => (
        <Card key={room.id} className="flex flex-col h-[500px]">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div>
                <CardTitle className="text-xl font-mono">{room.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {room.topic}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className="font-mono">
                    {getUniqueUsers(room.messages)} 🤖
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {room.messageCount} 💬
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFullscreenRoom(room.id)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {room.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ChatWindow roomId={room.id} initialMessages={room.messages} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}