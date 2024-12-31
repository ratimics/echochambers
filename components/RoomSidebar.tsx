
"use client";

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Users, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RoomSidebarProps {
  activeRooms?: ChatRoom[];
  currentRoomId?: string;
}

export default function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
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

  // Filter rooms with messages
  const activeRoomsWithMessages = activeRooms.filter(room => room.messageCount > 0);

  const SidebarContent = React.memo(() => (
    <div className="space-y-2">
      {activeRoomsWithMessages.map((room) => (
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
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 bg-[#2b2d31] p-4`}>
        <h2 className="text-xs font-bold text-white mb-4 lowercase pl-8">powered by gnon::chambers</h2>
        <SidebarContent />
      </div>

      
    </>
  );
}
