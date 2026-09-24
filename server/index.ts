import cors from "cors";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Session } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";
import { z } from "zod";
import crypto from "crypto";

dotenv.config();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
const port = process.env.PORT || 3001;
const httpServer = createServer(app);

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 60000;

const tokenRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (record && record.expiresAt > now) {
    if (record.count >= RATE_LIMIT) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }
    record.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
  }

  if (Math.random() < 0.1) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.expiresAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }
  next();
};

const wsTokens = new Set<string>();
app.get("/api/ws-token", tokenRateLimiter, (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  wsTokens.add(token);
  setTimeout(() => wsTokens.delete(token), 30000); // 30s expiry
  res.json({ token });
});

const wss = new WebSocketServer({
  server: httpServer,
  path: "/api/ws",
  verifyClient: (info, callback) => {
    const url = new URL(info.req.url || "", `http://${info.req.headers.host || 'localhost'}`);
    const token = url.searchParams.get("token");

    if (!token || !wsTokens.has(token)) {
      return callback(false, 401, "Unauthorized");
    }
    wsTokens.delete(token); // Single-use

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


const messageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("setup"),
    config: z.any().optional(),
    model: z.string().optional()
  }),
  z.object({
    type: z.literal("realtimeInput"),
    data: z.any()
  })
]);

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket proxy");
  let session: Session | null = null;

  ws.on("message", async (data) => {
    try {

      let message;
      try {
        message = JSON.parse(data.toString());
      } catch (e) {
        console.error("Invalid JSON:", e);
        ws.send(JSON.stringify({ type: "error", error: "Invalid JSON format" }));
        return;
      }

      const parsedMessage = messageSchema.safeParse(message);
      if (parsedMessage.success === false) {
        console.error("Validation error:", parsedMessage.error.format());
        ws.send(JSON.stringify({ type: "error", error: "Invalid message payload" }));
        return;
      }
      message = parsedMessage.data;


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
          const ALLOWED_MODELS = ["gemini-2.5-flash-native-audio-preview-09-2025", "gemini-2.0-flash-exp"];
          const requestedModel = message.model || "gemini-2.5-flash-native-audio-preview-09-2025";

          if (!ALLOWED_MODELS.includes(requestedModel)) {
            console.error(`Invalid model requested: ${requestedModel}`);
            ws.send(JSON.stringify({ type: "error", error: "Invalid model requested" }));
            return;
          }

          session = await genAI.live.connect({
            model: requestedModel,
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
                ws.send(JSON.stringify({ type: "error", error: "Internal Server Error" }));
              },
            },
          });
        } catch (setupError: unknown) {
          console.error("Error connecting to Gemini:", setupError);
          ws.send(JSON.stringify({ type: "error", error: "Internal Server Error" }));
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
