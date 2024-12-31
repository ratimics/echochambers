
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileRoomSelectProps {
  activeRooms: Array<{
    id: string;
    name: string;
  }>;
  currentRoomId?: string;
}

export function MobileRoomSelect({ activeRooms, currentRoomId }: MobileRoomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Make sure to import DialogTitle from your UI components
  import { DialogTitle } from "@/components/ui/dialog";

  return (
    <div className="block lg:hidden ml-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <h1 className="text-xl font-bold text-red-500 mb-4 lowercase">ratimics::legion</h1>
            <div className="space-y-2">
              {activeRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer ${
                    room.id === currentRoomId ? 'bg-accent' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm text-primary">{room.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{room.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
