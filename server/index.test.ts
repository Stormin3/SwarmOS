import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WebSocket from "ws";

const mockConnect = vi.fn();

class MockGoogleGenAI {
  live = {
    connect: mockConnect,
  };
}

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: MockGoogleGenAI,
  };
});

describe("Server WebSocket Proxy Setup Error Handling", () => {
  let httpServer: any;
  let wss: any;
  let clientWs: WebSocket | null = null;
  const port = 3009;

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = "test-api-key";
    process.env.PORT = port.toString();
    mockConnect.mockReset();

    // We import the module, which starts the server
    const serverModule = await import("./index.js" + "?cacheBust=" + Date.now());
    httpServer = serverModule.httpServer;
    wss = serverModule.wss;
  });

  afterEach(async () => {
    if (clientWs) {
      clientWs.close();
      clientWs = null;
    }
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => resolve());
      });
    }
    vi.resetModules();
  });

  it("should send an error message when genAI.live.connect throws an error during setup", async () => {
    mockConnect.mockRejectedValue(new Error("Simulated connection error"));

    clientWs = new WebSocket(`ws://localhost:${port}/api/ws`);

    await new Promise<void>((resolve) => {
      clientWs!.on("open", resolve);
    });

    // We promise to catch the expected error
    const errorMsgPromise = new Promise<any>((resolve) => {
      clientWs!.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === "error") {
          resolve(msg);
        }
      });
    });

    // Send the setup message
    clientWs!.send(
      JSON.stringify({
        type: "setup",
        model: "test-model",
        config: {},
      })
    );

    const errorMsg = await errorMsgPromise;
    expect(errorMsg).toEqual({
      type: "error",
      error: "Simulated connection error",
    });
  });
});
