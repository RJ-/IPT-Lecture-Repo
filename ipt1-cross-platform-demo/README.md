# Week 4 Extension Lab — React + Vite

Extend the Week 4 web app with **state management**, **offline support**, and **lazy loading**.

## ✅ What’s Implemented

1. **State Management (Counter)** — `src/components/Counter.jsx` uses React’s `useState`.
2. **Offline Support** — `public/sw.js` + registration in `src/registerSW.js`. Works after your **first successful online load**.
3. **Lazy Loading** — `About` route is loaded via `React.lazy` and `Suspense` in `src/App.jsx`.

## 🗂 Project Structure

```
week4-extension-lab/
├─ public/
│  ├─ sw.js
│  ├─ manifest.webmanifest
│  └─ icons/
├─ src/
│  ├─ components/Counter.jsx
│  ├─ pages/Home.jsx
│  ├─ pages/About.jsx   (lazy-loaded)
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  └─ registerSW.js
├─ index.html
├─ package.json
├─ vite.config.js
└─ .devcontainer/devcontainer.json
```

## 🚀 Getting Started

> Requires **Node 18+** and **npm**.

```bash
npm install
npm run dev        # start dev server
npm run build      # create production build (dist/)
npm run preview    # serve the production build locally
```

- Visit `http://localhost:5173/` during `npm run dev` (port may vary).
- **Service Worker** only runs in `npm run preview` (or any production hosting), not Vite dev mode.

## 🧪 What to Try

- Navigate between **Home** and **About** — watch network panel to see the About chunk load only on demand.
- Use the **Counter**: increment, decrement, reset.
- After `npm run build && npm run preview`, load the app, then go **offline** and refresh — the app should load from cache.

## 🧰 Optional: Redux Version

If you want a Redux variant for the counter, install Redux Toolkit and replace the `Counter` with a Redux-powered one:

```bash
npm i @reduxjs/toolkit react-redux
```

Then create a store and slice, wrap `<App />` with `<Provider store={store}>`, and move the counter state there.

## 📦 Notes

- The Service Worker uses a **runtime caching** (stale‑while‑revalidate) strategy. The first online visit populates the cache so subsequent offline loads work.
- For a full PWA (install prompts, versioned precache), consider adding `vite-plugin-pwa` later.
```

