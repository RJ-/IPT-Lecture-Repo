# Backend (Express REST API)
Quick start:
1) cd backend
2) npm install
3) npm run dev
API base: http://localhost:4000/api

Endpoints:
- GET    /api/health
- GET    /api/todos
- POST   /api/todos        { title: string }
- PUT    /api/todos/:id    { title?: string, done?: boolean }
- DELETE /api/todos/:id
