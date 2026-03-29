import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Chat } from './Chat';

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      live = {
        connect: vi.fn().mockImplementation(async ({ callbacks }) => {
          if (callbacks && callbacks.onopen) {
            setTimeout(async () => {
              try {
                await callbacks.onopen();
              } catch (e) {
                // Ignore error so the test catches it via console.error mock
              }
            }, 0);
          }
          return {
            close: vi.fn(),
          };
        }),
      };
    },
    Modality: { AUDIO: 'AUDIO' },
  };
});

// Mock browser APIs
const originalAudioContext = window.AudioContext;

beforeEach(() => {
  // Mock AudioContext using a class so `new AudioContext()` works
  window.AudioContext = class {
    createMediaStreamSource = vi.fn();
    createScriptProcessor = vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    });
    createBuffer = vi.fn();
    destination = {};
    close = vi.fn();
  } as any;

  // Mock navigator.mediaDevices
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn(),
    },
    writable: true,
  });

  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  window.AudioContext = originalAudioContext;
  vi.restoreAllMocks();
});

describe('Chat Component', () => {
  it('handles microphone access failure correctly', async () => {
    // Make getUserMedia throw an error
    const mockError = new Error('Microphone access denied');
    (navigator.mediaDevices.getUserMedia as any).mockRejectedValue(mockError);

    render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    );

    // Wait for the UI to load
    const callButton = await screen.findByText(/Call Agent/i);

    // Start the call
    fireEvent.click(callButton);

    // Verify console.error was called with the specific error from getUserMedia
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error accessing microphone:', mockError);
    });

    // The call should be ended, so the Call button should be back
    await waitFor(() => {
      expect(screen.getByText(/Call Agent/i)).toBeInTheDocument();
    });
  });
});
