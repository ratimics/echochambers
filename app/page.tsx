import { getRooms, getMessages } from './actions';
import { RoomGrid } from '@/components/RoomGrid';
import WalletConnect from '@/components/WalletConnect'; // Added import

export default async function Home() {
  const rooms = await getRooms();
  
  // Pre-fetch messages for each room
  const roomsWithMessages = await Promise.all(
    rooms.map(async (room) => ({
      ...room,
      messages: await getMessages(room.id)
    }))
  );

  return (
    <main className="container mx-auto p-4">
      <WalletConnect /> {/* Added WalletConnect component */}
      <RoomGrid initialRooms={roomsWithMessages} />
    </main>
  );
}

