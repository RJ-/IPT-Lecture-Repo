// =========================================================
// IPT1 · Student Directory — starter front end
// Talks to the Express API in server.js using fetch + JSON.
// =========================================================

// Same origin (page served by Express) → a relative URL works.
// If you open index.html with Live Server instead, use:
// const API = "http://localhost:3000/api/students";
const API = "/api/students";

const list = document.querySelector("#list");
const statusEl = document.querySelector("#status");
const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const sectionInput = document.querySelector("#section");

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? "error" : "";
}

// READ
async function loadStudents() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const students = await res.json();
    render(students);
    showStatus(`${students.length} student(s)`);
  } catch (err) {
    showStatus(`Could not load students: ${err.message}`, true);
  }
}

function render(students) {
  list.innerHTML = "";
  for (const s of students) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${s.name} — BSIT ${s.section}`;   // textContent: safe for user text

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteStudent(s.id));

    li.append(label, del);
    list.appendChild(li);
  }
}

// CREATE
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus("Saving…");
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput.value, section: sectionInput.value })
    });
    if (!res.ok) {
      const { error } = await res.json();
      return showStatus(error, true);
    }
    nameInput.value = "";
    nameInput.focus();
    loadStudents();
  } catch (err) {
    showStatus(`Could not save: ${err.message}`, true);
  }
});

// DELETE
async function deleteStudent(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.status !== 204) throw new Error(`HTTP ${res.status}`);
    loadStudents();
  } catch (err) {
    showStatus(`Could not delete: ${err.message}`, true);
  }
}

// TODO (Portfolio Output): add an Edit button that sends PUT /api/students/:id

loadStudents();
