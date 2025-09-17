
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = 3000;

// --- Core middleware stack ---
app.use(cors());
app.use(express.json());

// Logging middleware (morgan) + custom request id
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use((req, res, next) => {
  // Add a simple request ID for tracing
  req.requestId = Math.random().toString(36).slice(2, 8);
  console.log(`[req:${req.requestId}] headers=`, req.headers);
  next();
});

// Simple auth middleware (demo only)
app.use((req, res, next) => {
  // In real systems, validate token/API key/session here
  if (req.path.startsWith('/api/secure')) {
    const key = req.headers['x-api-key'];
    if (key !== 'demo-key') {
      return res.status(401).json({ error: 'Unauthorized: missing/invalid x-api-key' });
    }
  }
  next();
});

// --- Routes ---
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from HTTP/Express!', requestId: req.requestId });
});

app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body, via: 'HTTP POST', requestId: req.requestId });
});

// Protected route to show the auth middleware
app.get('/api/secure/profile', (req, res) => {
  res.json({ user: 'PSU Student', role: 'learner' });
});

app.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});
