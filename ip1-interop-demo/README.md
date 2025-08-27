# IPT1 Interoperability Demo

This repository demonstrates **interoperability between programming languages** and basic cross-platform/web development concepts for IPT1 (Integrative Programming & Technology).

It includes:

- **server/** → Node.js backend that also calls a **Python** script.
- **html-app/** → Beginner-friendly HTML + JavaScript frontend.
- **react-app/** → React (Vite) frontend version with hooks and state.
- **slides/** → 5-slide lecture deck (`IPT1-Interop-Demo.pptx`).

---

## 🚀 How to Run

### 1. Backend (Node.js + Python)
1. Open a terminal:
   ```bash
   cd server
   npm init -y
   npm install express
   node index.js
   ```
2. Server runs at: `http://localhost:3000`

- Test endpoints:
  ```bash
  curl "http://localhost:3000/api/os"
  curl "http://localhost:3000/api/sum?a=2&b=3"
  ```

### 2. HTML App
1. Open `html-app/index.html` in your browser.
2. Click **Get OS Info** → shows Node.js info.
3. Enter numbers → **Compute** → server calls Python script to add.

### 3. React App
1. Open a terminal:
   ```bash
   cd react-app
   npm install
   npm run dev
   ```
2. Visit `http://localhost:5173` (default Vite dev server).
3. Same features: OS info and Python sum.

---

## 📝 Learning Objectives
- Demonstrate **interoperability**: JavaScript → Node.js → Python → Node.js → Browser.
- Show how JSON acts as a **bridge** between languages.
- Compare **plain HTML/JS** vs **React** implementation.
- Provide students with hands-on demo aligned with IPT1 course outcomes:
  - Week 3: *Interoperability between programming languages*
  - Week 4: *Cross-platform/mobile app basics*

---

## 📊 Slides
See **slides/IPT1-Interop-Demo.pptx** for a ready-to-use 5-slide lecture deck.

---

## ✅ Next Steps
- Extend React app into a **mobile app** using React Native or Flutter.
- Explore more complex integrations (databases, microservices, etc.).
