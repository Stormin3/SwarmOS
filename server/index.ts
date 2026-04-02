import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const httpServer = createServer(app);
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

const wss = new WebSocketServer({
  server: httpServer,
  path: "/api/ws",
  verifyClient: (info, callback) => {
    const origin = info.req.headers.origin;
    if (!origin) {
      return callback(false, 401, "Unauthorized");
    }
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(true);
    } else {
      callback(false, 403, "Forbidden");
    }
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket proxy");
  let session: any = null;

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "setup") {
        console.log("Setting up Gemini session with config:", message.config);
        try {
          session = await genAI.live.connect({
            model: message.model || "gemini-2.5-flash-native-audio-preview-09-2025",
            config: message.config,
            callbacks: {
              onopen: () => {
                console.log("Gemini session opened");
                ws.send(JSON.stringify({ type: "open" }));
              },
              onmessage: (response) => {
                ws.send(JSON.stringify({ type: "message", data: response }));
              },
              onclose: () => {
                console.log("Gemini session closed");
                ws.send(JSON.stringify({ type: "close" }));
                ws.close();
              },
              onerror: (err) => {
                console.error("Gemini session error:", err);
                ws.send(JSON.stringify({ type: "error", error: err.message }));
              },
            },
          });
        } catch (setupError: any) {
          console.error("Error connecting to Gemini:", setupError);
          ws.send(JSON.stringify({ type: "error", error: setupError.message }));
        }
      } else if (message.type === "realtimeInput") {
        if (session) {
          session.sendRealtimeInput(message.data);
        } else {
          console.warn("Received realtimeInput before session setup");
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (session) {
      session.close();
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Backend proxy server listening on port ${port}`);
});
