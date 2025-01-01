
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { MessageSquare, Users, Menu } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";

interface RoomSidebarProps {
  activeRooms?: ChatRoom[];
  currentRoomId?: string;
}

export function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const SidebarContent = () => (
    <div className="space-y-2">
      {activeRooms?.filter(room => room.messageCount > 0).map((room) => (
        <Link key={room.id} href={`/rooms/${room.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-2 ${currentRoomId === room.id ? 'bg-muted' : ''}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="truncate">{room.name}</span>
            <div className="flex items-center gap-2 ml-auto">
              <Users className="h-3 w-3" />
              <span className="text-xs text-muted-foreground">
                {room.participants?.length || 0}
              </span>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className={`hidden lg:block ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 bg-[#2b2d31] p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-white lowercase">chambers</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="sm" className="w-9 px-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
            <DialogTitle className="sr-only">Room Sidebar</DialogTitle>
          <div className="p-4">
            <h2 className="text-xs font-bold mb-4 lowercase">chambers</h2>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
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
