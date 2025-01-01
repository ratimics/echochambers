
"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex h-full items-center justify-center text-destructive">
      <p>Error: {error.message}</p>
    </div>
  );
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const isHomeRoom = roomId === 'home';
  
  return (
    <div className="flex-1 flex flex-col">
      {isHomeRoom ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>👈 Choose a room from the sidebar to explore the chambers</p>
        </div>
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div>Loading...</div>}>
            <ChatWindow roomId={roomId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
