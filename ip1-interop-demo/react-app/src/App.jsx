// INTEROPERABILITY

// import { useState } from "react";
// import "./App.css";

// const OS_URL = "http://localhost:3000/api/os";
// const SUM_URL = "http://localhost:3000/api/sum";

// export default function App() {
//   const [osInfo, setOsInfo] = useState("...");
//   const [a, setA] = useState(2);
//   const [b, setB] = useState(3);
//   const [sumOut, setSumOut] = useState("...");

//   const getOs = async () => {
//     const res = await fetch(OS_URL);
//     const data = await res.json();
//     setOsInfo(JSON.stringify(data, null, 2));
//   };

//   const computeSum = async () => {
//     const res = await fetch(`${SUM_URL}?a=${a}&b=${b}`);
//     const data = await res.json();
//     setSumOut(JSON.stringify(data, null, 2));
//   };

//   return (
//     <div>
//       <h1>React + Node + Python Interop</h1>
//       <button onClick={getOs}>Get OS Info</button>
//       <pre>{osInfo}</pre>
//       <h3>Sum with Python</h3>
//       <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
//       +
//       <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
//       <button onClick={computeSum}>Compute</button>
//       <pre>{sumOut}</pre>
//     </div>
//   );
// }

// CROSS PLATFORM DEVELOPMENT
import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Router>
);

export default App;
