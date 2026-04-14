import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import WebSocket from 'ws';

// Mock console methods to avoid test output noise, except for specific tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Need to mock express and ws to fully test without binding ports
const mockSendRealtimeInput = vi.fn();
const mockClose = vi.fn();

const mockConnect = vi.fn().mockResolvedValue({
  sendRealtimeInput: mockSendRealtimeInput,
  close: mockClose,
});

class MockGoogleGenAI {
  live: any;
  constructor() {
    this.live = {
      connect: mockConnect,
    };
  }
}

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: MockGoogleGenAI,
  };
});

describe('WebSocket Proxy Server', () => {
  let wsClient: WebSocket;

  beforeAll(async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    process.env.PORT = '3012';

    // We let the server start
    await import('./index.js'); // Use .js extension as per TS compiled output or if it throws with .ts
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Ideally we export the server and close it, but since it's global, we just let it hang
  });

  const connectWs = (): Promise<WebSocket> => {
    return new Promise((resolve) => {
      const ws = new WebSocket('ws://localhost:3012/api/ws');
      ws.on('open', () => resolve(ws));
    });
  }

  it('should start the server and accept websocket connections', async () => {
    wsClient = await connectWs();
    expect(wsClient.readyState).toBe(WebSocket.OPEN);
    wsClient.close();
  });

  it('should handle setup message and connect to Gemini', async () => {
    wsClient = await connectWs();

    const setupMsg = {
      type: 'setup',
      config: { test: 'config' },
      model: 'test-model'
    };

    // We need to wait for the open message from the server
    const openPromise = new Promise((resolve) => {
      wsClient.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'open') resolve(msg);
      });
    });

    wsClient.send(JSON.stringify(setupMsg));

    // Wait a bit for server to process
    await new Promise(r => setTimeout(r, 100));

    expect(mockConnect).toHaveBeenCalledWith({
      model: "test-model",
      config: { test: 'config' },
      callbacks: expect.any(Object)
    });

    // trigger the onopen callback
    const connectCall = mockConnect.mock.calls[0][0];
    connectCall.callbacks.onopen();

    const openMsg = await openPromise;
    expect(openMsg).toEqual({ type: 'open' });

    wsClient.close();
  });

  it('should use default model if not provided', async () => {
    wsClient = await connectWs();

    const setupMsg = {
      type: 'setup',
      config: { test: 'config' }
    };

    wsClient.send(JSON.stringify(setupMsg));
    await new Promise(r => setTimeout(r, 100));

    expect(mockConnect).toHaveBeenCalledWith({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      config: { test: 'config' },
      callbacks: expect.any(Object)
    });

    wsClient.close();
  });

  it('should handle realtimeInput message', async () => {
    wsClient = await connectWs();

    // Setup first
    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));
    await new Promise(r => setTimeout(r, 100));

    // Send realtime input
    const inputMsg = {
      type: 'realtimeInput',
      data: { audio: 'base64data' }
    };
    wsClient.send(JSON.stringify(inputMsg));

    await new Promise(r => setTimeout(r, 100));

    expect(mockSendRealtimeInput).toHaveBeenCalledWith({ audio: 'base64data' });

    wsClient.close();
  });

  it('should warn when receiving realtimeInput before setup', async () => {
    wsClient = await connectWs();

    // Send realtime input without setup
    const inputMsg = {
      type: 'realtimeInput',
      data: { audio: 'base64data' }
    };
    wsClient.send(JSON.stringify(inputMsg));

    await new Promise(r => setTimeout(r, 100));

    expect(console.warn).toHaveBeenCalledWith("Received realtimeInput before session setup");
    expect(mockSendRealtimeInput).not.toHaveBeenCalled();

    wsClient.close();
  });

  it('should handle gemini messages and forward to client', async () => {
    wsClient = await connectWs();

    // Setup first
    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));
    await new Promise(r => setTimeout(r, 100));

    // Listen for messages from server
    const msgPromise = new Promise((resolve) => {
      wsClient.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'message') resolve(msg);
      });
    });

    // Trigger onmessage from mock
    const connectCall = mockConnect.mock.calls[0][0];
    const geminiResponse = { serverContent: { text: "hello" } };
    connectCall.callbacks.onmessage(geminiResponse);

    const msg = await msgPromise;
    expect(msg).toEqual({ type: 'message', data: geminiResponse });

    wsClient.close();
  });

  it('should handle gemini close event', async () => {
    wsClient = await connectWs();

    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));
    await new Promise(r => setTimeout(r, 100));

    const closePromise = new Promise((resolve) => {
      wsClient.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'close') resolve(msg);
      });
    });

    const connectCall = mockConnect.mock.calls[0][0];
    connectCall.callbacks.onclose();

    const closeMsg = await closePromise;
    expect(closeMsg).toEqual({ type: 'close' });

    wsClient.close();
  });

  it('should handle gemini error event', async () => {
    wsClient = await connectWs();

    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));
    await new Promise(r => setTimeout(r, 100));

    const errorPromise = new Promise((resolve) => {
      wsClient.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'error') resolve(msg);
      });
    });

    const connectCall = mockConnect.mock.calls[0][0];
    connectCall.callbacks.onerror(new Error("Test error"));

    const errorMsg = await errorPromise;
    expect(errorMsg).toEqual({ type: 'error', error: "Test error" });
    expect(console.error).toHaveBeenCalledWith("Gemini session error:", expect.any(Error));

    wsClient.close();
  });

  it('should handle invalid JSON messages', async () => {
    wsClient = await connectWs();

    wsClient.send("invalid json");

    await new Promise(r => setTimeout(r, 100));

    expect(console.error).toHaveBeenCalledWith("Error processing message:", expect.any(Error));

    wsClient.close();
  });

  it('should handle setup connection errors', async () => {
    wsClient = await connectWs();

    // Make connect fail
    mockConnect.mockRejectedValueOnce(new Error("Setup failed"));

    const errorPromise = new Promise((resolve) => {
      wsClient.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'error') resolve(msg);
      });
    });

    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));

    const errorMsg = await errorPromise;
    expect(errorMsg).toEqual({ type: 'error', error: "Setup failed" });
    expect(console.error).toHaveBeenCalledWith("Error connecting to Gemini:", expect.any(Error));

    wsClient.close();
  });

  it('should close session when client disconnects', async () => {
    wsClient = await connectWs();

    // Setup first
    wsClient.send(JSON.stringify({ type: 'setup', config: {} }));
    await new Promise(r => setTimeout(r, 100));

    // Disconnect
    wsClient.close();

    await new Promise(r => setTimeout(r, 100));

    expect(mockClose).toHaveBeenCalled();
  });
});
