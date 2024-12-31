
'use client';

import { use, useEffect } from 'react';
import { RoomSidebar } from '@/components/RoomSidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { getMessages } from '@/app/actions';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = use(Promise.resolve(params.roomId));

  useEffect(() => {
    const loadMessages = async () => {
      try {
        await getMessages(roomId);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    loadMessages();
  }, [roomId]);

  return (
    <div className="flex h-screen">
      <RoomSidebar />
      <main className="flex-1">
        <ChatWindow roomId={roomId} />
      </main>
    </div>
  );
}
