
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load protobuf
const PROTO_PATH = path.join(__dirname, 'proto', 'greeter.proto');
// Synchronously load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// Load the package definition into a gRPC object
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const demo = grpcObject.demo;
// Define server port
const PORT = '0.0.0.0:50051';

// --- Simple "interceptor" wrapper to demonstrate middleware-ish behavior ---
// Note: gRPC in Node.js does not have built-in middleware support like Express.
// This is a simple example to log requests and responses.
function withLogging(handler) {
  return (call, callback) => {
    const meta = call.metadata.getMap();
    const rid = Math.random().toString(36).slice(2, 8);
    console.log(`[gRPC req:${rid}] method=${handler.name}, metadata=`, meta);
    handler(call, (err, resp) => {
      console.log(`[gRPC res:${rid}]`, resp);
      callback(err, resp);
    });
  };
}

// Service implementations
// Note: In real applications, these would be in separate modules/files.
// Here we define two simple RPC methods: SayHello and Echo
// Both methods use the withLogging wrapper to log requests and responses.
// The SayHello method responds with a greeting message.
// The Echo method responds by echoing back the received text.
// The 'via' field indicates the protocol used.
// The service is then added to the gRPC server.
// The server listens on the specified port and starts serving requests.
const GreeterService = {
  SayHello: withLogging((call, callback) => {
    const name = call.request.name || 'world';
    callback(null, { message: `Hello, ${name} (from gRPC)!` });
  }),
  Echo: withLogging((call, callback) => {
    callback(null, { text: call.request.text, via: 'gRPC' });
  })
};

// Start the gRPC server
// Note: In production, use secure credentials (SSL/TLS)
// Here we use insecure credentials for simplicity.
function start() {
  const server = new grpc.Server();
  server.addService(demo.Greeter.service, GreeterService);
  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on ${PORT}`);
    server.start();
  });
}

// Start the server
start();
