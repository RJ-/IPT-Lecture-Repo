import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  async function load() {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = await createTodo(title.trim());
      setTodos(prev => [newTodo, ...prev]);
      setTitle('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleDone(id, done) {
    try {
      const updated = await updateTodo(id, { done: !done });
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Frontend–Backend Integration Demo (REST)</h1>
      <p>
        Backend: <code>Express</code> @ <code>http://localhost:4000</code> • Frontend: <code>Vite + React</code>
      </p>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: '0.6rem 0.8rem' }}
        />
        <button type="submit" style={{ padding: '0.6rem 0.8rem' }}>Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
        {todos.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Created: {new Date(t.createdAt).toLocaleString()}</div>
            </div>
            <button onClick={() => handleDelete(t.id)} aria-label="delete">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
