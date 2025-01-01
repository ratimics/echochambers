
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { MessageSquare, Users, Menu } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface RoomSidebarProps {
  activeRooms?: ChatRoom[];
  currentRoomId?: string;
}

export function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const SidebarContent = () => (
    <div className="space-y-2">
      {activeRooms?.map((room) => (
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
          <div className="p-4">
            <h2 className="text-xs font-bold mb-4 lowercase">chambers</h2>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
