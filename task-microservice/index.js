const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON requests

let tasks = [
    { id: 1, title: 'eat', completed: false },
    { id: 2, title: 'code', completed: false },
    { id: 3, title: 'sleep', completed: false },
]; // In-memory task storage

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).send("Task not found.");
    }
    task.completed = true;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.status(204).send();
});



app.listen(port, () => {
    console.log(`Task Service running at http://localhost:${port}`);
});