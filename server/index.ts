import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('Client connected to WebSocket server');

  // Extract parameters from the request URL, if any
  const targetUrl = new URL(req.url!, `wss://generativelanguage.googleapis.com`);

  // Add the API key from the environment
  targetUrl.searchParams.set('key', process.env.GEMINI_API_KEY!);

  console.log('Connecting to Gemini:', targetUrl.toString().replace(process.env.GEMINI_API_KEY!, 'REDACTED'));

  // Connect to the actual Gemini Live API
  const geminiWs = new WebSocket(targetUrl.toString());

  // Buffer for messages received from the client before Gemini connects
  const messageBuffer: RawData[] = [];

  geminiWs.on('open', () => {
    console.log('Connected to Gemini Live API');
    // Flush the buffer
    while (messageBuffer.length > 0) {
      const msg = messageBuffer.shift();
      if (msg) geminiWs.send(msg);
    }
  });

  geminiWs.on('message', (data) => {
    // Forward messages from Gemini to the client
    ws.send(data);
  });

  geminiWs.on('close', () => {
    console.log('Gemini Live API connection closed');
    ws.close();
  });

  geminiWs.on('error', (error) => {
    console.error('Gemini Live API error:', error);
    ws.close();
  });

  ws.on('message', (data) => {
    // Forward messages from the client to Gemini
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.send(data);
    } else {
      // Buffer messages until the connection is open
      messageBuffer.push(data);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket server');
    geminiWs.close();
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
