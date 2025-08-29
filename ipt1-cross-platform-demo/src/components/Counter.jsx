import React, { useState } from 'react'

/**
 * Counter demonstrates local state management with React's useState hook.
 * (Optional extension: replace with Redux Toolkit for global state.)
 */
export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <section>
      <h2>Counter</h2>
      <p>Current count: <strong>{count}</strong></p>
      <div className="buttons">
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
        <button onClick={() => setCount(c => c - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </section>
  )
}
