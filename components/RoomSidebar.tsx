
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface RoomSidebarProps {
  activeRooms?: any[];
  currentRoomId?: string;
}

export function RoomSidebar({ activeRooms = [], currentRoomId = '' }: RoomSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState(activeRooms);

  useEffect(() => {
    if (JSON.stringify(rooms) !== JSON.stringify(activeRooms)) {
      setRooms(activeRooms);
    }
  }, [activeRooms]);

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
            <div className="w-8 h-8 rounded-full bg-[#36393f]" />
            <div>
              <p className="text-white font-medium">{r.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {r.messages && r.messages[0]?.content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
