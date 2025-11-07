import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory datastore for simplicity
// Each item: { id, title, done, createdAt }
let todos = [
  { id: uuid(), title: "Set up backend server", done: true, createdAt: new Date().toISOString() },
  { id: uuid(), title: "Connect React frontend", done: false, createdAt: new Date().toISOString() }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// List all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Create a todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string.' });
  }
  const newTodo = { id: uuid(), title, done: false, createdAt: new Date().toISOString() };
  todos.unshift(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo (toggle done or edit title)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });

  if (typeof title !== 'undefined') {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title, if provided, must be a non-empty string.' });
    }
    todos[idx].title = title;
  }
  if (typeof done !== 'undefined') {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done, if provided, must be a boolean.' });
    }
    todos[idx].done = done;
  }

  res.json(todos[idx]);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
