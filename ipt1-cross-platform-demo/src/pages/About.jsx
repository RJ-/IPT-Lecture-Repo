import React from 'react'

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>
        This page is lazy-loaded using <code>React.lazy</code> and <code>Suspense</code>.
        It won't be downloaded until the user navigates here.
      </p>
    </main>
  )
}
