
"use client";

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Users, Menu } from 'lucide-react';
import { ChatRoom } from '@/server/types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  // Filter rooms with messages
  const activeRoomsWithMessages = activeRooms.filter(room => room.messageCount > 0);

  const SidebarContent = () => (
    <div className="space-y-2">
      {activeRoomsWithMessages.map((room) => (
        <Collapsible
          key={room.id}
          open={expandedRooms.has(room.id)}
          onOpenChange={() => toggleRoom(room.id)}
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{room.name}</span>
                {expandedRooms.has(room.id) ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="pl-4 py-2">
              <p className="text-sm text-muted-foreground">{room.topic}</p>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {room.participants?.length || 0} participants
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {room.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CollapsibleContent>
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

      {/* Mobile Toggle Buttons */}
      <div className="fixed lg:hidden left-4 top-4 z-40 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-80 bg-[#2b2d31] border-r-0">
          <h2 className="text-xl font-bold text-white mb-4 lowercase pl-8">ratimics::legion</h2>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
