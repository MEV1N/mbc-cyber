import { WebSocket, WebSocketServer } from 'ws';

const port = Number(process.env.PORT || process.env.WS_PORT || 8080);

const server = new WebSocketServer({ port });

server.on('connection', (socket) => {
  console.log('WebSocket client connected');

  socket.on('message', (rawMessage) => {
    let message;

    try {
      message = JSON.parse(rawMessage.toString());
    } catch {
      console.log('Invalid WebSocket message');
      return;
    }

    if (!message || message.type !== 'PLAY_VIDEO') return;

    console.log('PLAY_VIDEO received');

    const payload = JSON.stringify({
      type: 'PLAY_VIDEO'
    });

    for (const client of server.clients) {
      if (
        client !== socket &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(payload);
      }
    }
  });

  socket.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

console.log(`WebSocket server listening on port ${port}`);