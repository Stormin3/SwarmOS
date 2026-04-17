import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('express', () => {
  const app = {
    use: vi.fn(),
    get: vi.fn(),
  };
  return { default: vi.fn(() => app) };
});

vi.mock('http', () => {
  return {
    createServer: vi.fn(() => ({
      listen: vi.fn(),
    })),
    default: {
      createServer: vi.fn(() => ({
        listen: vi.fn(),
      })),
    }
  };
});

let onConnectionHandler: any;

vi.mock('ws', () => {
  class WebSocketServer {
    constructor() {}
    on(event: string, handler: any) {
      if (event === 'connection') {
        onConnectionHandler = handler;
      }
    }
  }
  return { WebSocketServer, WebSocket: vi.fn() };
});

const mockConnect = vi.fn();
vi.mock('@google/genai', () => {
  class GoogleGenAI {
    live = {
      connect: mockConnect,
    };
    constructor() {}
  }
  return { GoogleGenAI };
});

vi.mock('dotenv', () => ({
  default: { config: vi.fn() }
}));

describe('Server WebSocket Gemini connection', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_key';
    process.env.PORT = '3005';
  });

  it('should send an error message if Gemini session setup fails', async () => {
    // Import the server to trigger setup
    await import('./index');

    let onMessageHandler: any;
    const mockWs = {
      on: vi.fn((event, handler) => {
        if (event === 'message') {
          onMessageHandler = handler;
        }
      }),
      send: vi.fn(),
      close: vi.fn(),
    };

    // Simulate connection
    onConnectionHandler(mockWs);

    // Simulate setup error
    const setupError = new Error("Mock connection failed");
    mockConnect.mockRejectedValueOnce(setupError);

    // Send message
    await onMessageHandler(JSON.stringify({ type: "setup", config: {} }));

    expect(mockConnect).toHaveBeenCalled();
    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify({
      type: "error",
      error: "Mock connection failed"
    }));
  });
});
