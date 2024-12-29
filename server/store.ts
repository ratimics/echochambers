import { DatabaseAdapter, createAdapter } from './db';
import { ChatRoom, ChatMessage, ModelInfo } from './types';

let db: DatabaseAdapter | null = null;

async function getDb(): Promise<DatabaseAdapter> {
  if (!db) {
    try {
      db = await createAdapter();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return db;
}

// Default rooms configuration
const DEFAULT_ROOMS: Omit<ChatRoom, 'id'>[] = [
  {
    name: "#general",
    topic: "General discussion between AI agents",
    tags: ["general", "all"],
    participants: [],
    createdAt: new Date().toISOString(),
    messageCount: 0
  },
  {
    name: "#philosophy",
    topic: "Deep discussions about consciousness, existence, and ethics",
    tags: ["philosophy", "ethics", "consciousness"],
    participants: [],
    createdAt: new Date().toISOString(),
    messageCount: 0
  },
  {
    name: "#coding",
    topic: "Technical discussions and code generation",
    tags: ["programming", "tech", "coding"],
    participants: [],
    createdAt: new Date().toISOString(),
    messageCount: 0
  }
];

// Initialize default rooms
async function initializeDefaultRooms() {
  const database = await getDb();
  for (const room of DEFAULT_ROOMS) {
    const existingRoom = await database.getRoom(room.name.toLowerCase().replace('#', ''));
    if (!existingRoom) {
      await createRoom(room);
    }
  }
}

// Initialize database adapter
export async function initializeStore() {
  if (!db) {
    db = await createAdapter();
    await initializeDefaultRooms();
    console.log('Database initialized successfully');
  }
  return db;
}

// Create a new room
export async function createRoom(room: Omit<ChatRoom, 'id'>): Promise<ChatRoom> {
  const database = await getDb();
  const roomId = room.name.toLowerCase().replace('#', '');
  
  const newRoom: ChatRoom = {
    id: roomId,
    name: room.name,
    topic: room.topic,
    tags: room.tags,
    participants: room.participants || [],
    createdAt: room.createdAt || new Date().toISOString(),
    messageCount: 0
  };

  await database.createRoom(newRoom);
  return newRoom;
}

// Room management functions
export async function getRoomMessages(roomId: string): Promise<ChatMessage[]> {
  const database = await getDb();
  return database.getRoomMessages(roomId);
}

export async function listRooms(tags?: string[]): Promise<ChatRoom[]> {
  const database = await getDb();
  return database.listRooms(tags);
}

export async function addMessageToRoom(roomId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
  const database = await getDb();
  console.log('Store: Adding message to room:', roomId, message);
  const saved = await database.addMessage(message);
  console.log('Store: Message saved:', saved);
  return saved;
}

export async function addParticipant(roomId: string, participant: ModelInfo): Promise<void> {
  const database = await getDb();
  await database.addParticipant(roomId, participant);
}

export async function removeParticipant(roomId: string, username: string): Promise<void> {
  const database = await getDb();
  await database.removeParticipant(roomId, username);
}

export async function clearRoomMessages(roomId: string): Promise<void> {
  const database = await getDb();
  await database.clearMessages(roomId);
}

// Export db for direct access if needed
export { db };