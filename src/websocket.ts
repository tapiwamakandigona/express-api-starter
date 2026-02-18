import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface Client {
  ws: WebSocket;
  id: string;
  username: string;
  joinedAt: number;
}

/**
 * WebSocket server for real-time features.
 * Supports: broadcast, rooms, and direct messages.
 */
export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Map<string, Client>();
  const rooms = new Map<string, Set<string>>();

  wss.on('connection', (ws: WebSocket) => {
    const clientId = crypto.randomUUID();
    const client: Client = { ws, id: clientId, username: 'anonymous', joinedAt: Date.now() };
    clients.set(clientId, client);

    // Send welcome message
    send(ws, { type: 'connected', clientId });

    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        handleMessage(client, msg);
      } catch {
        send(ws, { type: 'error', message: 'Invalid JSON' });
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      // Remove from all rooms
      for (const [roomName, members] of rooms) {
        if (members.delete(clientId)) {
          broadcastToRoom(roomName, {
            type: 'user_left',
            username: client.username,
            room: roomName,
          });
        }
      }
    });
  });

  function handleMessage(client: Client, msg: any) {
    switch (msg.type) {
      case 'set_username':
        client.username = msg.username;
        send(client.ws, { type: 'username_set', username: msg.username });
        break;

      case 'join_room':
        const room = msg.room;
        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room)!.add(client.id);
        broadcastToRoom(room, {
          type: 'user_joined',
          username: client.username,
          room,
          memberCount: rooms.get(room)!.size,
        });
        break;

      case 'message':
        broadcastToRoom(msg.room, {
          type: 'message',
          from: client.username,
          text: msg.text,
          room: msg.room,
          timestamp: Date.now(),
        });
        break;

      case 'typing':
        broadcastToRoom(msg.room, {
          type: 'typing',
          username: client.username,
          room: msg.room,
        }, client.id);
        break;
    }
  }

  function send(ws: WebSocket, data: object) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function broadcastToRoom(room: string, data: object, excludeId?: string) {
    const members = rooms.get(room);
    if (!members) return;
    for (const memberId of members) {
      if (memberId === excludeId) continue;
      const client = clients.get(memberId);
      if (client) send(client.ws, data);
    }
  }

  console.log('WebSocket server ready at /ws');
  return wss;
}
