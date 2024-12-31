
"use client";

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Users } from 'lucide-react';
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
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

  const filteredRooms = useCallback(() => {
    return activeRooms
      .filter(room => room.messageCount > 0)
      .sort((a, b) => b.messageCount - a.messageCount);
  }, [activeRooms]);

  const toggleRoomExpansion = (roomId: string) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    setExpandedRooms(newExpanded);
  };

  const SidebarContent = () => (
    <div className="space-y-2">
      {filteredRooms().map((r) => (
        <Collapsible key={r.id}>
          <Link 
            href={`/rooms/${r.id}`}
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-[#393c43] cursor-pointer ${
              r.id === currentRoomId ? 'bg-[#393c43]' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">{r.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {r.participants?.length || 0}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {r.messageCount}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <CollapsibleTrigger 
            onClick={() => toggleRoomExpansion(r.id)}
            className="w-full text-xs text-gray-400 hover:text-gray-300 p-1 flex items-center justify-center"
          >
            {expandedRooms.has(r.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-2 text-sm text-gray-400">
              {r.topic}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-[#2b2d31] p-4">
        <h2 className="text-xl font-bold text-white mb-4 lowercase">ratimics::legion</h2>
        <SidebarContent />
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-[#2b2d31] border-r-0">
            <h2 className="text-xl font-bold text-white mb-4 lowercase">ratimics::legion</h2>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
