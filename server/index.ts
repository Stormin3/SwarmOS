import cors from "cors";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, type Session } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
app.use(cors());
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


// Simple in-memory token store for WebSocket authentication
const wsTokens = new Set<string>();

app.get("/api/ws-token", (req, res) => {
  // In a real application, you would verify the user's session or JWT here
  // before issuing a WebSocket token.
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  wsTokens.add(token);

  // Token expires after 30 seconds
  setTimeout(() => {
    wsTokens.delete(token);
  }, 30000);

  res.json({ token });
});

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

wss.on("connection", (ws) => {
  let session: any = null;

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "setup") {
        console.log("Setting up Gemini session with config:", message.config);

        const ALLOWED_MODELS = [
          "gemini-2.5-flash-native-audio-preview-09-2025"
        ];

        const requestedModel = message.model || "gemini-2.5-flash-native-audio-preview-09-2025";

        if (!ALLOWED_MODELS.includes(requestedModel)) {
          console.error("Invalid model requested:", requestedModel);
          ws.send(JSON.stringify({ type: "error", error: "Invalid model requested" }));
          return;
        }

        try {
          session = await genAI.live.connect({
            model: requestedModel,
            config: message.config,
            callbacks: {
              onopen: () => {
                ws.send(JSON.stringify({ type: "open" }));
              },
              onmessage: (response) => {
                ws.send(JSON.stringify({ type: "message", data: response }));
              },
              onclose: () => {
                ws.send(JSON.stringify({ type: "close" }));
                ws.close();
              },
              onerror: (err) => {
                console.error("Gemini session error:", err);
                ws.send(JSON.stringify({ type: "error", error: "An error occurred during the Gemini session." }));
              },
            },
          });
        } catch (setupError: any) {
          console.error("Error connecting to Gemini:", setupError);
          ws.send(JSON.stringify({ type: "error", error: "Failed to connect to Gemini." }));
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
    if (session) {
      session.close();
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Backend proxy server listening on port ${port}`);
});
export { httpServer, wss };
