
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'proto', 'greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const demo = grpcObject.demo;

const client = new demo.Greeter('localhost:50051', grpc.credentials.createInsecure());

// Add some metadata (like headers) to mimic middleware concerns
const md = new grpc.Metadata();
md.add('x-api-key', 'demo-key');

const nameArg = process.argv[2] || 'Student';
client.SayHello({ name: nameArg }, md, (err, resp) => {
  if (err) return console.error('SayHello error:', err);
  console.log('SayHello response:', resp);

  client.Echo({ text: 'This is an echo test' }, md, (err2, resp2) => {
    if (err2) return console.error('Echo error:', err2);
    console.log('Echo response:', resp2);
  });
});
