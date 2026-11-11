# JavaScript Essentials & Integration — IPT1 Self-Paced Module

A self-paced, browser-based module for **IPT1 · Integrative Programming and Technologies** (BSIT 2A & 2B, Partido State University). Students read lecture-style lessons, run and edit every code example directly on the page (phone-friendly, nothing to install), answer a quiz per lesson, and track their progress.

Prepared by Prof. Rowell John B. Artiaga, DIT · College of Engineering and Computational Sciences.

## Contents

| Page | Topic | Time |
|---|---|---|
| `index.html` | Start Here — how to use, progress, course-outline map | — |
| `lesson-1.html` | Meet JavaScript — where it runs, variables, types, operators | 45 min |
| `lesson-2.html` | Decisions, Loops & Functions — truthy/falsy, arrow functions, callbacks | 50 min |
| `lesson-3.html` | Arrays, Objects & JSON — map/filter/reduce, JSON as the integration format | 50 min |
| `lesson-4.html` | JavaScript in the Browser — DOM, events, forms, rendering data | 50 min |
| `lesson-5.html` | Asynchronous JS & fetch() — Promises, async/await, real API calls | 60 min |
| `lesson-6.html` | JavaScript on the Server — Node.js, npm, Express, REST, middleware | 60 min |
| `lesson-7.html` | Connecting Front End & Back End — full loop, CORS, React, REST vs GraphQL | 60 min |
| `lesson-8.html` | JavaScript Across Integration — WebSockets, databases, microservices, React Native, Lambda, WebAssembly, security, CI/CD | 60 min |
| `capstone.html` | Portfolio Output (20-pt group task + rubric) and printable Progress Report | — |
| `glossary.html` | Glossary | — |
| `starter/`, `starter.zip` | Runnable Node.js/Express starter project for Track 2 | — |

## Features

- **Runnable code boxes.** Every "Try it" box can be edited and run. JavaScript output appears in a console panel; web-page examples render in a sandboxed frame.
- **Express simulator** (`assets/sim.js`). Lessons 6–8 run real Express-style server code *inside the browser* — `express()`, routes, `express.json()`, `cors()`, `req.params/query/body`, status codes, and a `fetch()` that reaches `http://localhost:<port>`. It also reproduces the browser's CORS error so students can see it and fix it. Requests to real URLs (e.g., JSONPlaceholder in Lesson 5) go to the internet.
- **Quizzes** with instant feedback and explanations; scores are saved.
- **Progress tracking** in the sidebar and on the home page, saved in the browser's `localStorage` (per device; no accounts, no server).
- **Progress Report** on the capstone page that students screenshot or print to PDF.
- Mobile layout, dark mode, print styles. No build step, no external libraries, no tracking.

## Publish on GitHub Pages

1. Create a new repository on GitHub (e.g., `ipt1-js-module`) and upload **the contents of this folder** (so `index.html` is at the top level).
   - Using Git:
     ```bash
     git init
     git add .
     git commit -m "IPT1 JavaScript module"
     git branch -M main
     git remote add origin https://github.com/<your-username>/ipt1-js-module.git
     git push -u origin main
     ```
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/ipt1-js-module/`.

**Putting it inside an existing class site** (like a `…/async-module/` subfolder): copy this folder into that repository as, for example, `js-module/`. All links are relative, so it works from any subfolder.

## Updating content

- Lesson list, titles and times live in one place: the `LESSONS` array at the top of `assets/app.js`.
- Code examples are written inside `<textarea>` tags so they can contain `<`, `>` and `&` without escaping:
  - `<div class="play"><textarea>…</textarea></div>` — runnable JavaScript
  - `<div class="play" data-mode="html"><textarea>…</textarea></div>` — runnable web page (add `data-server="on"` to enable the Express simulator and CORS checks)
  - `<textarea class="code" data-lang="js|html|bash|yaml|text" data-file="name">…</textarea>` — read-only highlighted code
- Quiz format:
  ```html
  <div class="quiz" data-id="l1">
    <div class="q" data-answer="2">            <!-- 0-based index of the correct option -->
      <p>Question text</p>
      <ul><li>A</li><li>B</li><li>C</li><li>D</li></ul>
      <p class="why">Explanation shown after answering.</p>
    </div>
  </div>
  ```
- Changing a quiz's `data-id` resets saved scores for that quiz.

## Teacher notes

- Designed for students whose classes have little or no computer access: every concept can be completed on a phone. Track 2 of the Portfolio Output is for groups with a computer.
- The Progress Report is a self-report stored on the student's device; treat it as evidence of engagement, not as a secure assessment. Pair it with the Integration Trace, which shows understanding in the students' own words.
- Lesson 5's live-API examples need internet access; everything else works offline once the page has loaded.
- Suggested pacing: Lessons 1–3 in one week, 4–5 in the next, 6–8 in the third, Portfolio Output due at the end of the third week.
