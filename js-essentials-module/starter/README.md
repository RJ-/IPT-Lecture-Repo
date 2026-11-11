# IPT1 Student Directory — Starter Project

A small full-stack app: a front end (`public/`) and an Express REST API (`server.js`) that exchange JSON. Use it as the starting point for **Track 2** of the module's Portfolio Output.

## Run it

1. Install [Node.js](https://nodejs.org) (the LTS version).
2. Open this folder in VS Code, then open a terminal (`` Ctrl + ` ``).
3. Run:

   ```bash
   npm install
   npm start
   ```

4. Open <http://localhost:3000> in your browser.

Use `npm run dev` instead of `npm start` to restart the server automatically whenever you save `server.js`.

## The API

| Method | Path | Body | Success |
|---|---|---|---|
| GET | `/api/students` (optional `?section=2A`) | — | 200 + array |
| GET | `/api/students/:id` | — | 200 + object, or 404 |
| POST | `/api/students` | `{ "name": "...", "section": "2A" }` | 201 + new object, or 400 |
| PUT | `/api/students/:id` | `{ "name"?: "...", "section"?: "2B" }` | 200 + object, or 400/404 |
| DELETE | `/api/students/:id` | — | 204, or 404 |

You can test it with the browser (GET only), Thunder Client / Postman, or curl:

```bash
curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d '{"name":"Carla Diaz","section":"2A"}'
```

## Files

```
server.js         Express app: middleware, routes, in-memory data
public/index.html The page
public/app.js     Front-end JavaScript: fetch, render, form handling
```

## Your task

Adapt the project to your chosen theme (events, lost & found, or equipment borrowing). See the **Portfolio Output** page of the module for the required features and scoring guide.

> Data is kept in memory, so it resets when the server restarts. Saving to a database (MySQL or MongoDB) is an optional extension — see Lesson 8.2.
