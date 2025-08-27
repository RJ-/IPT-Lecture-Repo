// Minimal Express server that exposes 2 endpoints:
// 1) /api/os    -> returns Node.js version (pure JS path)
// 2) /api/sum   -> calls a Python script to add two numbers (JS -> Python interop)

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/os', (req, res) => {
  res.json({
    node: process.version,
    platform: process.platform,
    message: 'Hello from Node.js!'
  });
});

app.get('/api/sum', (req, res) => {
  const a = Number(req.query.a ?? '0');
  const b = Number(req.query.b ?? '0');

  const py = spawn('python3', [path.join(__dirname, 'py', 'calc.py'), a.toString(), b.toString()]);

  let output = '';
  let errout = '';

  py.stdout.on('data', (chunk) => (output += chunk));
  py.stderr.on('data', (chunk) => (errout += chunk));

  py.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Python error', details: errout.trim() });
    }
    try {
      const data = JSON.parse(output);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'Bad JSON from Python', raw: output });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
