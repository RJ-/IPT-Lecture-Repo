   # Frontend–Backend Integration Demo
   A minimal full-stack demo for IPT1 Week 11.

   ## Stack
   - **Backend:** Node.js + Express (REST API)
   - **Frontend:** React + Vite (fetch-based client)

   ## How to Run (Two Terminals)
   ### Terminal A — Backend
   ```bash
   cd backend
   npm install
   npm run dev   # starts http://localhost:4000
   ```

   ### Terminal B — Frontend
   ```bash
   cd frontend
   npm install
   npm run dev   # opens http://localhost:5173
   ```

   ## Test the API with curl
   ```bash
   # List todos
   curl http://localhost:4000/api/todos

   # Create a todo
   curl -X POST http://localhost:4000/api/todos \
-H "Content-Type: application/json" \
-d '{"title":"Demo from curl"}'

   # Toggle done (replace :id)
   curl -X PUT http://localhost:4000/api/todos/:id \
-H "Content-Type: application/json" \
-d '{"done": true}'

   # Delete (replace :id)
   curl -X DELETE http://localhost:4000/api/todos/:id
   ```

   ## Lesson Talking Points
   - Request → Response cycle (frontend `fetch` ↔ backend Express routes)
   - CORS and ports (5173 ↔ 4000)
   - Data shapes and validation
   - Stateless REST design
   - Extend to GraphQL (swap Express routes for a GraphQL endpoint as a follow-up)
   ```
