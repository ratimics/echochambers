
"use client";

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DialogTitle } from "@/components/ui/dialog";

interface RoomSidebarProps {
  activeRooms?: ChatRoom[];
  currentRoomId?: string;
}

export function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    if (currentRoomId) {
      expanded.add(currentRoomId);
    }
    return expanded;
  });

  const toggleRoom = useCallback((roomId: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  }, []);

  const SidebarContent = () => (
    <div className="space-y-2">
      {activeRooms?.map((room) => (
        <Collapsible
          key={room.id}
          open={expandedRooms.has(room.id)}
          onOpenChange={() => toggleRoom(room.id)}
        >
          <Link href={`/rooms/${room.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
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
        </Collapsible>
      ))}
    </div>
  );

  return (
    <>
      <div className={`hidden lg:block ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 bg-[#2b2d31] p-4`}>
        <h2 className="text-xs font-bold text-white mb-4 lowercase pl-8">powered by gnon::chambers</h2>
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold">Rooms</DialogTitle>
          </div>
          <div className="p-4">
            <h1 className="text-xl font-bold text-red-500 mb-4 lowercase">ratimics::legion</h1>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
