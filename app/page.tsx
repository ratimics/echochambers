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

// Placeholder component for WalletConnect (replace with actual implementation)
const WalletConnect = () => {
  const [connected, setConnected] = React.useState(false);
  const connectWallet = async () => {
    try {
      // Your Phantom wallet connection logic here.  This is a placeholder.
      console.log('Connecting to Phantom...');
      // Replace with actual Phantom wallet connection code.
      const connection = await window.solana.connect();
      setConnected(true);
      console.log('Connected:', connection);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div>
      {connected ? (
        <p>Wallet Connected!</p>
      ) : (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      )}
    </div>
  );
};