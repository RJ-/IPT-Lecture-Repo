
# Middleware & Communication Protocols — Code‑Along

This hands-on mini-lab shows three ways services communicate:
1) **HTTP (REST)** with Express + middleware
2) **WebSockets** for real-time updates
3) **gRPC** for efficient service-to-service calls

## Prereqs
- Node.js 18+
- npm

## Quick Start (each terminal in its own tab)

### 1) HTTP (Express)
```bash
cd http-server
npm install
npm start
# Open: http://localhost:3000/api/hello
# Test POST with body: { "name": "PSU" }
curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"name":"PSU"}'
```

### 2) WebSockets
```bash
cd ws-server
npm install
npm start
# Open the demo page:
# http://localhost:3001
```

### 3) gRPC
```bash
cd grpc-service
npm install
npm start  # starts the server
# In a second terminal:
node client.js "Rowell"
```

---

## Learning Focus
- **Middleware role**: centralize cross-cutting concerns (logging, auth, transform).
- **Protocol choices**:
  - **HTTP** – request/response, stateless, universal.
  - **WebSockets** – full‑duplex, real‑time.
  - **gRPC** – binary, typed (protobuf), fast for microservices.

---

## Folder Structure
```
middleware-protocols-codealong/
├── README.md
├── http-server/
│   ├── package.json
│   └── server.js
├── ws-server/
│   ├── package.json
│   ├── server.js
│   └── public/
│       └── index.html
└── grpc-service/
    ├── package.json
    ├── server.js
    ├── client.js
    └── proto/
        └── greeter.proto
```

---

## Teaching Prompts
- Swap **console logging** with a **request-id** middleware to show traceability.
- Simulate an **auth middleware** (reject if no `x-api-key` header).
- Change WebSocket broadcast to **room/topic** filtering.
- Add one more gRPC method and evolve the `.proto` file (versioning discussion).
