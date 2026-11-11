// =========================================================
// IPT1 · Student Directory — starter back end (Node.js + Express)
// Run:  npm install   then   npm start   → open http://localhost:3000
// =========================================================
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());                     // allow other origins (e.g. Live Server on 5500)
app.use(express.json());             // parse JSON bodies into req.body
app.use(express.static("public"));   // serve index.html and app.js from /public
app.use((req, res, next) => {        // simple request logger
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${req.url}`);
  next();
});

// ---------- "Database" (in memory — resets when the server restarts) ----------
let students = [
  { id: 1, name: "Ana Reyes", section: "2A" },
  { id: 2, name: "Ben Cruz", section: "2B" }
];
let nextId = 3;
const SECTIONS = ["2A", "2B"];

// ---------- Routes ----------

// READ all (optional filter: /api/students?section=2A)
app.get("/api/students", (req, res) => {
  const { section } = req.query;
  res.json(section ? students.filter(s => s.section === section) : students);
});

// READ one
app.get("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// CREATE
app.post("/api/students", (req, res) => {
  const name = (req.body.name || "").trim();
  const section = req.body.section;
  if (name.length < 2) return res.status(400).json({ error: "Name must be at least 2 characters" });
  if (!SECTIONS.includes(section)) return res.status(400).json({ error: "Section must be 2A or 2B" });

  const student = { id: nextId++, name, section };
  students.push(student);
  res.status(201).json(student);
});

// UPDATE
app.put("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();
    if (name.length < 2) return res.status(400).json({ error: "Name must be at least 2 characters" });
    student.name = name;
  }
  if (req.body.section !== undefined) {
    if (!SECTIONS.includes(req.body.section)) return res.status(400).json({ error: "Section must be 2A or 2B" });
    student.section = req.body.section;
  }
  res.json(student);
});

// DELETE
app.delete("/api/students/:id", (req, res) => {
  const before = students.length;
  students = students.filter(s => s.id !== Number(req.params.id));
  if (students.length === before) return res.status(404).json({ error: "Student not found" });
  res.sendStatus(204);
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Student Directory running at http://localhost:${PORT}`);
});
