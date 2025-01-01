"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoom } from "@/server/types";
import { MessageSquare } from "lucide-react";

export function RoomSidebar() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        const activeRooms = data.rooms.filter((r: ChatRoom) => r.messageCount > 0);
        setRooms(activeRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="w-64 border-r p-4">
        <p className="text-muted-foreground">Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Active Rooms</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          {rooms.map((room) => (
            <Button
              key={room.id}
              variant={pathname === `/rooms/${room.id}` ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              asChild
            >
              <Link href={`/rooms/${room.id}`} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{room.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {room.messageCount}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
