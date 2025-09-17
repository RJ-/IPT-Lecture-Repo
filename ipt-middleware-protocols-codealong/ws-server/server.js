
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app and HTTP server
const app = express();
// Create WebSocket server
const server = http.createServer(app);
// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

const PORT = 3001;

// Serve the demo client
app.use(express.static(path.join(__dirname, 'public')));

// Simple "handshake middleware" example during connection
wss.on('connection', function connection(ws, req) {
  // Simple API key check from query parameters
  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  // In a real application, use a secure method to handle API keys
  // This is just for demonstration purposes
  const apiKey = params.get('apiKey');
  // For demo purposes, we accept 'demo-key' as a valid API key
  if (apiKey !== 'demo-key') {
    // Reject connection if API key is missing or invalid
    ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized: missing/invalid apiKey' }));
    ws.close();
    return;
  }
  // Send a welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket demo!' }));

  // Handle incoming messages
  ws.on('message', function message(data) {
    // Broadcast to all connected clients
    for (const client of wss.clients) {
      // Ensure the client is open before sending
      if (client.readyState === 1) {
        // Echo the received message back to all clients
        client.send(JSON.stringify({ type: 'broadcast', data: data.toString() }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server on http://localhost:${PORT} (open in browser)`);
});
