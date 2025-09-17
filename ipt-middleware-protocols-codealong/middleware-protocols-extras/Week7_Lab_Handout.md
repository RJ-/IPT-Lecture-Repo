
# Week 7 Code-Along: Middleware & Communication Protocols

## Objectives
- Understand the role of middleware in integration.
- Practice communication protocols: HTTP, WebSockets, gRPC.
- Compare protocols for real-world use cases.

## Activities

### 1) HTTP with Express
- Start server: `npm start` inside `http-server/`
- Test endpoints:
  - `GET /api/hello`
  - `POST /api/echo` with JSON body `{'name': 'PSU'}`
  - `GET /api/secure/profile` with header `x-api-key: demo-key`

### 2) WebSockets
- Start server: `npm start` inside `ws-server/`
- Open `http://localhost:3001` in two tabs, exchange messages.
- Observe full-duplex, real-time communication.

### 3) gRPC
- Start server: `npm start` inside `grpc-service/`
- In another terminal, run client: `node client.js Rowell`
- Check responses for `SayHello` and `Echo`.

## Reflection Questions
1. What is the role of middleware in managing requests?
2. Compare request/response vs full-duplex communication.
3. Why might gRPC be more efficient for microservices?

---
Prepared for **IPT1 – Week 7** at PSU CECS.
