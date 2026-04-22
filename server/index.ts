import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Session } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";
import { z } from "zod";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: "/api/ws" });

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
        } catch (setupError: unknown) {
          console.error("Error connecting to Gemini:", setupError);
          const errorMessage = setupError instanceof Error ? setupError.message : String(setupError);
          ws.send(JSON.stringify({ type: "error", error: errorMessage }));
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
