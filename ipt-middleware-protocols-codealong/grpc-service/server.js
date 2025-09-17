
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'proto', 'greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const demo = grpcObject.demo;

const PORT = '0.0.0.0:50051';

// --- Simple "interceptor" wrapper to demonstrate middleware-ish behavior ---
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
const GreeterService = {
  SayHello: withLogging((call, callback) => {
    const name = call.request.name || 'world';
    callback(null, { message: `Hello, ${name} (from gRPC)!` });
  }),
  Echo: withLogging((call, callback) => {
    callback(null, { text: call.request.text, via: 'gRPC' });
  })
};

function start() {
  const server = new grpc.Server();
  server.addService(demo.Greeter.service, GreeterService);
  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on ${PORT}`);
    server.start();
  });
}

start();
