
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatRoom } from '@/server/types';

interface RoomSidebarProps {
  activeRooms?: ChatRoom[];
  currentRoomId?: string;
}

export function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const filteredRooms = activeRooms
      .filter(room => room.messageCount > 0)
      .sort((a, b) => b.messageCount - a.messageCount);
    setRooms(filteredRooms);
  }, [JSON.stringify(activeRooms)]);

  return (
    <div className={`w-64 lg:block bg-[#2b2d31] p-4 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
      <h2 className="text-xl font-bold text-white mb-4 lowercase">ratimics::legion</h2>
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        className="lg:hidden text-white"
      >
        {isMobileMenuOpen ? 'X' : '☰'}
      </button>
      <div className="space-y-2">
        {rooms.map((r) => (
          <Link 
            key={r.id} 
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
                <span className="text-xs text-gray-400">{r.messageCount}</span>
              </div>
              <p className="text-sm text-gray-400 truncate">
                {r.topic}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
