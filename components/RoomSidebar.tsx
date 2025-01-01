
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { MessageSquare, Users, Menu } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
        <Link key={room.id} href={`/rooms/${room.id}`} className="w-full">
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
          <h2 className={`text-xs font-bold text-white lowercase ${isSidebarCollapsed ? 'hidden' : 'block'}`}>chambers</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={isSidebarCollapsed ? 'w-full p-2' : ''}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <div className={`${isSidebarCollapsed ? 'w-full space-y-2' : ''}`}>
          {activeRooms?.filter(room => room.messageCount > 0).map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`} className="w-full block">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${currentRoomId === room.id ? 'bg-muted' : ''} ${isSidebarCollapsed ? 'p-2' : ''}`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className={`truncate ${isSidebarCollapsed ? 'hidden' : 'block'}`}>{room.name}</span>
                <div className={`flex items-center gap-2 ml-auto ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
                  <Users className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {room.participants?.length || 0}
                  </span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="sm" className="w-9 px-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <DialogTitle className="sr-only">Room List</DialogTitle>
          <div className="p-4">
            <h2 className="text-xs font-bold mb-4 lowercase">chambers</h2>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
