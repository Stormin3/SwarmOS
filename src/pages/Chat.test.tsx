import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Chat } from './Chat';

describe('Chat Component - Error Handling', () => {
  let originalAudioContext: any;
  let originalWebSocket: any;
  let originalMediaDevices: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    originalAudioContext = window.AudioContext;
    originalWebSocket = window.WebSocket;
    originalMediaDevices = navigator.mediaDevices;
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    window.AudioContext = originalAudioContext;
    window.WebSocket = originalWebSocket;
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true
    });
    consoleErrorSpy.mockRestore();
  });

  it('handles startCall error correctly', async () => {
    const errorToThrow = new Error('Simulated startCall error');

    // We mock the audio context but do not define it to be a constructor
    // Or we throw from the constructor
    class ThrowingAudioContext {
      constructor() {
        throw errorToThrow;
      }
    }

    window.AudioContext = ThrowingAudioContext as any;

    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    const callButton = screen.getByRole('button', { name: /Call Agent/i });
    fireEvent.click(callButton);

    await waitFor(() => {
      expect(screen.getByText('Simulated startCall error')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start call:', errorToThrow);
  });

  it('handles ws.onerror correctly', async () => {
    // Basic mock of AudioContext constructor
    class MockAudioContext {
      createBuffer = vi.fn()
      createBufferSource = vi.fn()
      createMediaStreamSource = vi.fn()
      createScriptProcessor = vi.fn()
      destination = {}
      close = vi.fn()
    }

    window.AudioContext = MockAudioContext as any;

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }])
        })
      },
      configurable: true
    });

    let wsInstance: any = null;

    class MockWebSocket {
      send = vi.fn()
      close = vi.fn()
      readyState = 1 // OPEN
      onopen: any = null
      onerror: any = null
      constructor() {
        wsInstance = this;
      }
    }
    window.WebSocket = MockWebSocket as any;

    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    const callButton = screen.getByRole('button', { name: /Call Agent/i });
    fireEvent.click(callButton);

    // Wait for the WS to be instantiated
    await waitFor(() => {
      expect(wsInstance).not.toBeNull();
    });

    // Simulate ws open
    if(wsInstance.onopen) wsInstance.onopen();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /End Call/i })).toBeInTheDocument();
    });

    // Manually trigger the error callback directly on wsInstance
    const wsError = new Error('Simulated WS Error');
    wsInstance.onerror(wsError);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Proxy WebSocket error:', wsError);
    });
  });
});
