
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ChatWindowProps {
  roomId: string;
}

export function ChatWindow({ roomId }: ChatWindowProps) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch room: ${response.status} ${response.statusText}`);
        }
        const room = await response.json();
        
        if (!room) {
          throw new Error(`Room with ID "${roomId}" not found.`);
        }

        setRoom(room);
      } catch (err: any) {
        console.error('Error fetching room:', err);
        toast({
          title: "Error",
          description: err.message || 'Failed to load room',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {room ? (
          <div>Room: {room.name}</div>
        ) : (
          <div className="text-center text-muted-foreground">Room not found</div>
        )}
      </div>
    </div>
  );
}
