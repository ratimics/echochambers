
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { use } from "react";
import { getRooms } from "../actions";

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
