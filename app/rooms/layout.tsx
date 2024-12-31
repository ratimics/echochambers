
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { RoomSidebar } from "@/components/RoomSidebar";
import { use } from "react";
import { getRooms } from "../actions";

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  const rooms = use(getRooms());

  return (
    <div className="flex h-screen">
      <RoomSidebar activeRooms={rooms} />
      <main className="flex-1 bg-[#313338]">
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
