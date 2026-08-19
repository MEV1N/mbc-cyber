import { WebSocket, WebSocketServer } from 'ws';

const port = Number(process.env.WS_PORT || 8080);
const server = new WebSocketServer({ port });

server.on('connection', (socket) => {
  socket.on('message', (rawMessage) => {
    let message;

    try {
      message = JSON.parse(rawMessage.toString());
    } catch {
      return;
    }

    if (!message || message.type !== 'PLAY_VIDEO') return;

    const payload = JSON.stringify({ type: 'PLAY_VIDEO' });
    for (const client of server.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  });
});

console.log(`WebSocket server listening on ws://localhost:${port}`);
