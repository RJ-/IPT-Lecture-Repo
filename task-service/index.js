const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tasks = [
    { id: 1, title: 'eat', completed: false }, 
    { id: 2, title: 'sleep', completed: true }, 
    { id: 3, title: 'code', completed: false }
];

// Get all tasks
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
    if (!task){
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
  console.log(`Server is running on http://localhost:${port}`);
});