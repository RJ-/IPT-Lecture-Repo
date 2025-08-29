import React, { Suspense, lazy } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";

// Lazy loaded About page for performance optimization
const About = lazy(() => import("./pages/About.jsx"));

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About (Lazy)</NavLink>
      </nav>

      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>

      <p className="note">
        This lab demonstrates: <strong>state management</strong> via{" "}
        <code>useState</code>,<strong> offline support</strong> via{" "}
        <code>Service Worker</code>, and
        <strong> lazy loading</strong> for the About route.
      </p>
    </div>
  );
}
