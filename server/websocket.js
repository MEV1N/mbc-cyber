import http from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

const port = Number(process.env.PORT || process.env.WS_PORT || 8080);

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'mbc-websocket' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MBC WebSocket server is running');
});

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', (socket) => {
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

    for (const client of wsServer.clients) {
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

httpServer.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
  console.log(`Health endpoint: http://localhost:${port}/health`);
});