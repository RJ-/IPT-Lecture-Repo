
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;

// Serve the demo client
app.use(express.static(path.join(__dirname, 'public')));

// Simple "handshake middleware" example during connection
wss.on('connection', function connection(ws, req) {
  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const apiKey = params.get('apiKey');
  if (apiKey !== 'demo-key') {
    ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized: missing/invalid apiKey' }));
    ws.close();
    return;
  }

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket demo!' }));

  ws.on('message', function message(data) {
    // Broadcast to all connected clients
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: 'broadcast', data: data.toString() }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server on http://localhost:${PORT} (open in browser)`);
});
