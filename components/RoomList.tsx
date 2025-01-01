"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChatRoom } from "@/server/types";

export function RoomList() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        if (data.rooms) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-mono">Name</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Stats</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell className="font-mono">{room.name}</TableCell>
            <TableCell>{room.topic}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {room.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="font-mono">
                  {room.participants.length} 🤖
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {room.messageCount} 💬
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              {new Date(room.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                onClick={() => setSelectedRoom(room.id)}
              >
                Observe
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 