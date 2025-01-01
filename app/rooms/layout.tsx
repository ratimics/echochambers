
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { RoomSidebar } from "@/components/RoomSidebar";

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<Loader />}>
        <RoomSidebar />
        <div className="flex-1">
          {children}
        </div>
      </Suspense>
    </div>
  );
}
