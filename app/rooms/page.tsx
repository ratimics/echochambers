
import { MessageList } from "@/components/MessageList";
import { use } from "react";
import { getMessages } from "../actions";

export default function RoomsPage() {
  const messages = use(getMessages('general')); // Default room

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
