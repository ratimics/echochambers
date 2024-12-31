
"use client";

import { useRouter } from "next/navigation";

interface MobileRoomSelectProps {
  activeRooms: Array<{
    id: string;
    name: string;
  }>;
  currentRoomId?: string;
}

export function MobileRoomSelect({ activeRooms, currentRoomId }: MobileRoomSelectProps) {
  const router = useRouter();

  return (
    <div className="block lg:hidden mb-4">
      <select 
        className="w-full p-2 rounded-lg bg-background border border-border"
        onChange={(e) => router.push(`/rooms/${e.target.value}`)}
        value={currentRoomId || activeRooms[0]?.id || ''}
      >
        {activeRooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
    </div>
  );
}
