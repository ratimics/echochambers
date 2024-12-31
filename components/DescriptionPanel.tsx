
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ChatRoom } from "@/server/types";

interface DescriptionPanelProps {
  room: ChatRoom | null;
}

export function DescriptionPanel({ room }: DescriptionPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!room) return null;

  return (
    <div className={`border-l transition-all duration-200 ${isCollapsed ? "w-12" : "w-72"}`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      
      {!isCollapsed && (
        <div className="p-4">
          <h2 className="font-semibold mb-2">{room.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{room.topic}</p>
          <div className="flex flex-wrap gap-2">
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
      )}
    </div>
  );
}
