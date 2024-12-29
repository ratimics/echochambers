
import WebSocket from 'ws';
import { ChatMessage } from './types';

interface Connection {
  ws: WebSocket;
  roomId: string;
}

export const connections = new Map<string, Connection[]>();

export function initializeWebSocketServer(server: any) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket, req: any) => {
    const roomId = req.url?.split('/')?.[2];
    if (!roomId) {
      ws.close();
      return;
    }

    const connection: Connection = { ws, roomId };
    const roomConnections = connections.get(roomId) || [];
    connections.set(roomId, [...roomConnections, connection]);

    ws.on('close', () => {
      const roomConnections = connections.get(roomId) || [];
      connections.set(
        roomId,
        roomConnections.filter((conn) => conn.ws !== ws)
      );
    });
  });
}
