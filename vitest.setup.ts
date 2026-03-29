import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock AudioContext
const mockAudioContext = {
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    onended: null,
    disconnect: vi.fn(),
  })),
  createBuffer: vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(0)),
  })),
  destination: {},
  close: vi.fn(),
};

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockAudioContext),
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockAudioContext),
});

// Mock mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn(() => []),
    }),
  },
});
