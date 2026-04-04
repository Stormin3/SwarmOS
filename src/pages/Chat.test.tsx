import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Chat } from './Chat';

describe('Chat Component', () => {
  let originalAudioContext: any;
  let mockGetUserMedia: Mock;
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Mock AudioContext properly as a class
    originalAudioContext = window.AudioContext;
    class MockAudioContext {
      createMediaStreamSource = vi.fn();
      createScriptProcessor = vi.fn().mockImplementation(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        onaudioprocess: null
      }));
      destination = {};
      createBuffer = vi.fn();
      createBufferSource = vi.fn();
      close = vi.fn();
    }
    window.AudioContext = MockAudioContext as any;
    (window as any).webkitAudioContext = MockAudioContext;

    // Mock getUserMedia
    mockGetUserMedia = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      writable: true,
      configurable: true
    });

    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    window.AudioContext = originalAudioContext;
    delete (window as any).webkitAudioContext;
    vi.restoreAllMocks();
  });

  it('handles microphone access error correctly during call', async () => {
    let mockWsInstance: any = null;

    vi.stubGlobal('WebSocket', class MockWebSocket {
        send: any;
        close: any;
        readyState: number;
        onopen: any;
        onmessage: any;
        onclose: any;
        onerror: any;
        constructor() {
            this.send = vi.fn();
            this.close = vi.fn();
            this.readyState = 1;
            mockWsInstance = this;
        }
    });

    render(
      <MemoryRouter initialEntries={[`/?agent=eleanor`]}>
        <Chat />
      </MemoryRouter>
    );

    // Wait for the agent to load
    const agentButtons = await screen.findAllByText('Eleanor Vance');
    expect(agentButtons.length).toBeGreaterThan(0);

    // Trigger the WebSocket open message
    const errorMsg = new Error("Microphone denied");
    mockGetUserMedia.mockRejectedValueOnce(errorMsg);

    // Click Call Agent
    const callButton = await screen.findByText('Call Agent');
    await act(async () => {
        fireEvent.click(callButton);
    });

    // Wait for ws instance
    await waitFor(() => {
        expect(mockWsInstance).not.toBeNull();
    });

    // Trigger onopen manually
    await act(async () => {
      if (mockWsInstance.onopen) mockWsInstance.onopen(new Event("open"));
    });

    // Simulate WS onmessage
    await act(async () => {
      if (mockWsInstance.onmessage) {
        await mockWsInstance.onmessage({
          data: JSON.stringify({ type: "open" })
        });
      }
    });

    // It should have logged the error
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error accessing microphone:", errorMsg);
    });

    // And it should have ended the call, changing back to "Call Agent"
    await waitFor(() => {
      expect(screen.getByText('Call Agent')).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });
});
